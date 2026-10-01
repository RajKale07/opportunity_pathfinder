package com.pathfinder.opportunity;

import com.pathfinder.auth.User;
import com.pathfinder.digitaltwin.DigitalTwinEngine;
import com.pathfinder.digitaltwin.DigitalTwinFeatureVector;
import com.pathfinder.profile.ProfileService;
import com.pathfinder.profile.StudentProfile;
import com.pathfinder.skills.StudentSkill;
import com.pathfinder.skills.StudentSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OpportunityMatchingEngine {

    private final OpportunityRepository opportunityRepository;
    private final OpportunitySkillRepository opportunitySkillRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final ApplicationRepository applicationRepository;
    private final ProfileService profileService;
    private final DigitalTwinEngine digitalTwinEngine;

    @Transactional(readOnly = true)
    public List<OpportunityDto.OpportunityResponse> matchOpportunities(User user) {
        StudentProfile profile = profileService.getOrCreateProfile(user);
        List<Opportunity> allOpportunities = opportunityRepository.findAll();
        Map<Long, Double> studentSkillMap = studentSkillRepository.findByStudentProfileId(profile.getId()).stream()
                .collect(Collectors.toMap(ss -> ss.getSkill().getId(), StudentSkill::getProficiency));

        Map<Long, Application.ApplicationStatus> appMap = applicationRepository.findByStudentProfileIdOrderByAppliedAtDesc(profile.getId()).stream()
                .collect(Collectors.toMap(a -> a.getOpportunity().getId(), Application::getStatus, (a, b) -> a));

        DigitalTwinFeatureVector twinFeatures = digitalTwinEngine.extractFeatures(profile);

        List<OpportunityDto.OpportunityResponse> results = new ArrayList<>();

        for (Opportunity opp : allOpportunities) {
            List<OpportunitySkill> reqs = opportunitySkillRepository.findByOpportunityId(opp.getId());

            int mandatoryTotal = 0;
            int mandatoryMet = 0;
            double weightedMet = 0.0;
            double weightedTotal = 0.0;

            List<String> satisfiedSkills = new ArrayList<>();
            List<String> missingSkills = new ArrayList<>();

            for (OpportunitySkill os : reqs) {
                double currentProf = studentSkillMap.getOrDefault(os.getSkill().getId(), 0.0);
                boolean satisfies = currentProf >= os.getMinProficiency();
                double weight = os.getIsRequired() ? 1.0 : 0.5;

                if (os.getIsRequired()) {
                    mandatoryTotal++;
                    if (satisfies) mandatoryMet++;
                }

                weightedTotal += weight;
                if (satisfies) {
                    weightedMet += weight;
                    satisfiedSkills.add(os.getSkill().getName() + " (" + Math.round(currentProf) + "%)");
                } else {
                    double deficit = Math.max(0, os.getMinProficiency() - currentProf);
                    missingSkills.add(os.getSkill().getName() + " (-" + Math.round(deficit) + "%)");
                }
            }

            double matchPercentage = weightedTotal == 0 ? 80.0 : round((weightedMet / weightedTotal) * 100.0);

            // Opportunity Readiness (distinct from Match % as requested by Section 20)
            double techFactor = twinFeatures.getSkillProficiency();
            double projectFactor = Math.min(100.0, twinFeatures.getProjectCount() * 30.0);
            double interviewFactor = twinFeatures.getInterviewScore();
            double consistencyFactor = twinFeatures.getConsistencyScore();

            double readinessPercentage = round((0.35 * techFactor) + (0.25 * projectFactor) + (0.20 * interviewFactor) + (0.20 * consistencyFactor));

            String whyMatched = String.format("Matches %d of %d required technical competencies for %s at %s. Verified portfolio project evidence aligns with role scope.",
                    mandatoryMet, mandatoryTotal, opp.getTitle(), opp.getCompany());

            String readinessNarrative;
            if (readinessPercentage >= 75.0) {
                readinessNarrative = "Production Ready: Strong technical fundamentals, verified code repositories, and solid assessment track record.";
            } else if (readinessPercentage >= 55.0) {
                readinessNarrative = String.format("Developing Competency: Match is solid (%s%%), but readiness is %s%% due to pending mock interview scores and missing %s practice.",
                        Math.round(matchPercentage), Math.round(readinessPercentage), missingSkills.isEmpty() ? "portfolio" : missingSkills.get(0));
            } else {
                readinessNarrative = "Foundational Stage: Recommend completing current roadmap phases and building at least one dedicated capstone before applying.";
            }

            String ratioString = mandatoryTotal == 0 ? "All Criteria Met" : mandatoryMet + "/" + mandatoryTotal + " Required";

            results.add(OpportunityDto.OpportunityResponse.builder()
                    .id(opp.getId())
                    .title(opp.getTitle())
                    .company(opp.getCompany())
                    .type(opp.getType())
                    .domain(opp.getDomain())
                    .location(opp.getLocation())
                    .remote(opp.getRemote())
                    .compensation(opp.getCompensation())
                    .deadline(opp.getDeadline())
                    .description(opp.getDescription())
                    .matchPercentage(matchPercentage)
                    .readinessPercentage(readinessPercentage)
                    .requirementsMetRatio(ratioString)
                    .satisfiedSkills(satisfiedSkills)
                    .missingSkills(missingSkills)
                    .whyMatchedExplanation(whyMatched)
                    .readinessExplanation(readinessNarrative)
                    .applicationStatus(appMap.get(opp.getId()))
                    .build());
        }

        // Sort by match percentage descending
        results.sort((a, b) -> Double.compare(b.getMatchPercentage(), a.getMatchPercentage()));
        return results;
    }

    private double round(double val) {
        return Math.round(val * 10.0) / 10.0;
    }
}
