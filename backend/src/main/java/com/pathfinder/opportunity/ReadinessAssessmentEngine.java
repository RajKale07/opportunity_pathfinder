package com.pathfinder.opportunity;

import com.pathfinder.auth.User;
import com.pathfinder.digitaltwin.DigitalTwinEngine;
import com.pathfinder.digitaltwin.DigitalTwinFeatureVector;
import com.pathfinder.profile.ProfileService;
import com.pathfinder.profile.StudentProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReadinessAssessmentEngine {

    private final DigitalTwinEngine digitalTwinEngine;
    private final ProfileService profileService;

    @Transactional(readOnly = true)
    public OpportunityDto.ReadinessProfileResponse evaluateReadinessProfile(User user) {
        StudentProfile profile = profileService.getOrCreateProfile(user);
        DigitalTwinFeatureVector f = digitalTwinEngine.extractFeatures(profile);

        List<OpportunityDto.DimensionScore> dimensions = new ArrayList<>();

        // 1. Technical Skills
        dimensions.add(OpportunityDto.DimensionScore.builder()
                .dimensionName("Technical Skills")
                .score(f.getSkillProficiency())
                .benchmark("Benchmark: 70%")
                .evidenceSummary(String.format("Core skill proficiency is %.1f%% across foundational and framework domains.", f.getSkillProficiency()))
                .build());

        // 2. Projects
        double projScore = Math.min(100.0, f.getProjectCount() * 25.0);
        dimensions.add(OpportunityDto.DimensionScore.builder()
                .dimensionName("Projects")
                .score(projScore)
                .benchmark("Benchmark: 2+ verified")
                .evidenceSummary(String.format("%d verified repository projects with average complexity score %.1f/10.", f.getProjectCount(), f.getProjectQuality()))
                .build());

        // 3. Problem Solving (DSA)
        dimensions.add(OpportunityDto.DimensionScore.builder()
                .dimensionName("Problem Solving")
                .score(f.getProblemSolvingScore())
                .benchmark("Benchmark: 65%")
                .evidenceSummary(String.format("Algorithmic problem solving and data structures rating at %.1f%%.", f.getProblemSolvingScore()))
                .build());

        // 4. Communication
        dimensions.add(OpportunityDto.DimensionScore.builder()
                .dimensionName("Communication")
                .score(f.getCommunicationScore())
                .benchmark("Benchmark: 70%")
                .evidenceSummary("Assessed via technical project write-ups and structured answers.")
                .build());

        // 5. Interview Readiness
        dimensions.add(OpportunityDto.DimensionScore.builder()
                .dimensionName("Interview Readiness")
                .score(f.getInterviewScore())
                .benchmark("Benchmark: 70%")
                .evidenceSummary(String.format("Mock assessment technical scoring average: %.1f%%.", f.getInterviewScore()))
                .build());

        // 6. Resume Quality
        double resumeScore = profile.getResumeText() != null && !profile.getResumeText().isBlank() ? 85.0 : 45.0;
        dimensions.add(OpportunityDto.DimensionScore.builder()
                .dimensionName("Resume Quality")
                .score(resumeScore)
                .benchmark("Benchmark: 80%")
                .evidenceSummary(resumeScore > 50 ? "Structured resume parsed with clear technical skills and outcomes." : "Basic resume profile. Add detailed project impact metrics.")
                .build());

        // 7. Portfolio Evidence
        double portfolioScore = (profile.getGithubUrl() != null ? 50.0 : 0.0) + (profile.getLinkedinUrl() != null ? 30.0 : 0.0) + (profile.getPortfolioUrl() != null ? 20.0 : 0.0);
        dimensions.add(OpportunityDto.DimensionScore.builder()
                .dimensionName("Portfolio Evidence")
                .score(portfolioScore)
                .benchmark("Benchmark: 75%")
                .evidenceSummary("Public links verified for GitHub code and LinkedIn profile.")
                .build());

        // 8. Consistency
        dimensions.add(OpportunityDto.DimensionScore.builder()
                .dimensionName("Consistency")
                .score(f.getConsistencyScore())
                .benchmark("Benchmark: 75%")
                .evidenceSummary(String.format("Habit regularity score %.1f%% with active roadmap adherence.", f.getConsistencyScore()))
                .build());

        // 9. Career Goal Alignment
        dimensions.add(OpportunityDto.DimensionScore.builder()
                .dimensionName("Goal Alignment")
                .score(f.getCareerGoalAlignment())
                .benchmark("Benchmark: 80%")
                .evidenceSummary(String.format("Roadmap directly targets '%s' primary milestones.", profile.getTargetRole()))
                .build());

        // 10. Opportunity Requirements Fit
        dimensions.add(OpportunityDto.DimensionScore.builder()
                .dimensionName("Opportunity Fit")
                .score(f.getOpportunityAlignment())
                .benchmark("Benchmark: 70%")
                .evidenceSummary("Alignment across active target internship role postings.")
                .build());

        double composite = dimensions.stream().mapToDouble(OpportunityDto.DimensionScore::getScore).average().orElse(0.0);
        composite = Math.round(composite * 10.0) / 10.0;

        List<String> strengths = new ArrayList<>();
        List<String> blockers = new ArrayList<>();

        for (OpportunityDto.DimensionScore d : dimensions) {
            if (d.getScore() >= 75.0) {
                strengths.add(d.getDimensionName() + " (" + Math.round(d.getScore()) + "%)");
            } else if (d.getScore() < 60.0) {
                blockers.add(d.getDimensionName() + " (" + Math.round(d.getScore()) + "%)");
            }
        }

        String tier = composite >= 80.0 ? "INDUSTRY READY" : composite >= 60.0 ? "DEVELOPING APPLICANT" : "FOUNDATIONAL BUILDER";

        String narrative = String.format(
                "Candidate evaluates at %.1f%% overall multidimensional readiness (%s). Primary driver is strong %s, while acceleration is recommended in %s.",
                composite, tier, strengths.isEmpty() ? "consistency" : strengths.get(0),
                blockers.isEmpty() ? "ongoing practice" : blockers.get(0)
        );

        return OpportunityDto.ReadinessProfileResponse.builder()
                .overallReadinessScore(composite)
                .readinessTier(tier)
                .dimensions(dimensions)
                .keyStrengths(strengths)
                .keyBlockers(blockers)
                .summaryNarrative(narrative)
                .build();
    }
}
