package com.pathfinder.career;

import com.pathfinder.auth.User;
import com.pathfinder.profile.*;
import com.pathfinder.skills.StudentSkill;
import com.pathfinder.skills.StudentSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CareerRecommendationEngine {

    private final CareerPathRepository careerPathRepository;
    private final CareerPathSkillRepository careerPathSkillRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final ProfileService profileService;
    private final CareerGoalRepository careerGoalRepository;
    private final ProjectRepository projectRepository;
    private final SkillGapEngine skillGapEngine;

    @Transactional(readOnly = true)
    public List<CareerDto.CareerRecommendationResponse> evaluateAllCareerPaths(User user) {
        StudentProfile profile = profileService.getOrCreateProfile(user);
        List<CareerPath> allPaths = careerPathRepository.findAll();
        List<CareerGoal> goals = careerGoalRepository.findByStudentProfileId(profile.getId());
        List<Project> projects = projectRepository.findByStudentProfileId(profile.getId());
        Map<Long, Double> studentSkillMap = studentSkillRepository.findByStudentProfileId(profile.getId()).stream()
                .collect(Collectors.toMap(ss -> ss.getSkill().getId(), StudentSkill::getProficiency));

        List<CareerDto.CareerRecommendationResponse> results = new ArrayList<>();

        for (CareerPath path : allPaths) {
            List<CareerPathSkill> pathSkills = careerPathSkillRepository.findByCareerPathId(path.getId());

            // 1. Skill Alignment Calculation
            double skillSum = 0.0;
            double weightSum = 0.0;
            for (CareerPathSkill ps : pathSkills) {
                double current = studentSkillMap.getOrDefault(ps.getSkill().getId(), 0.0);
                double ratio = Math.min(100.0, (current / ps.getTargetProficiency()) * 100.0);
                skillSum += ratio * ps.getWeight();
                weightSum += ps.getWeight();
            }
            double skillAlignment = weightSum > 0 ? skillSum / weightSum : 0.0;

            // 2. Interest Alignment
            double interestAlignment = 60.0;
            if (profile.getPreferredDomain() != null &&
                    (profile.getPreferredDomain().toLowerCase().contains(path.getDomain().toLowerCase()) ||
                     path.getDomain().toLowerCase().contains(profile.getPreferredDomain().toLowerCase()))) {
                interestAlignment = 92.0;
            } else if (profile.getTargetRole() != null &&
                    profile.getTargetRole().toLowerCase().contains(path.getTitle().toLowerCase())) {
                interestAlignment = 95.0;
            }

            // 3. Goal Alignment
            double goalAlignment = 50.0;
            for (CareerGoal g : goals) {
                if (g.getTargetRole().equalsIgnoreCase(path.getTitle()) ||
                    (g.getCareerDomain() != null && g.getCareerDomain().equalsIgnoreCase(path.getDomain()))) {
                    if (g.getPriorityLevel() == CareerGoal.PriorityLevel.PRIMARY) goalAlignment = 98.0;
                    else if (g.getPriorityLevel() == CareerGoal.PriorityLevel.ALTERNATIVE) goalAlignment = 82.0;
                    else if (g.getPriorityLevel() == CareerGoal.PriorityLevel.EXPLORATION) goalAlignment = 70.0;
                    break;
                }
            }

            // 4. Academic Alignment
            double academicAlignment = profile.getGpa() != null ?
                    (profile.getGpa() <= 4.0 ? (profile.getGpa() / 4.0) * 100.0 : (profile.getGpa() / 10.0) * 100.0) : 70.0;

            // 5. Project Alignment
            double projectAlignment = 40.0;
            if (!projects.isEmpty()) {
                long matchingProjects = projects.stream()
                        .filter(p -> p.getTechStack() != null && pathSkills.stream()
                                .anyMatch(ps -> p.getTechStack().toLowerCase().contains(ps.getSkill().getName().toLowerCase())))
                        .count();
                projectAlignment = Math.min(100.0, 50.0 + (matchingProjects * 22.0));
            }

            // 6. Opportunity Alignment
            double opportunityAlignment = 76.0;

            // Transparent Multi-factor formula as specified in Section 10:
            // 0.30*Skill + 0.20*Interest + 0.15*Goal + 0.10*Academic + 0.15*Project + 0.10*Opportunity
            double overall = (0.30 * skillAlignment) +
                             (0.20 * interestAlignment) +
                             (0.15 * goalAlignment) +
                             (0.10 * academicAlignment) +
                             (0.15 * projectAlignment) +
                             (0.10 * opportunityAlignment);

            overall = round(Math.max(0.0, Math.min(100.0, overall)));

            String rationale = String.format(
                    "High alignment driven by %s domain interest (%.0f%%) and verified portfolio project correlation (%.0f%%). Skill mastery stands at %.0f%% with clear gap mitigation paths.",
                    path.getDomain(), interestAlignment, projectAlignment, skillAlignment
            );

            // Fetch top skill gaps for this path
            CareerDto.SkillGapReport gapReport = skillGapEngine.generateSkillGapReport(user, path.getId());
            List<CareerDto.SkillGapItem> topGaps = gapReport.getGaps().stream()
                    .filter(g -> g.getPriority() != CareerDto.GapPriority.READY)
                    .limit(3)
                    .collect(Collectors.toList());

            results.add(CareerDto.CareerRecommendationResponse.builder()
                    .careerPathId(path.getId())
                    .title(path.getTitle())
                    .domain(path.getDomain())
                    .overallMatchScore(overall)
                    .skillAlignment(round(skillAlignment))
                    .interestAlignment(round(interestAlignment))
                    .goalAlignment(round(goalAlignment))
                    .academicAlignment(round(academicAlignment))
                    .projectAlignment(round(projectAlignment))
                    .opportunityAlignment(round(opportunityAlignment))
                    .matchRationale(rationale)
                    .topSkillGaps(topGaps)
                    .build());
        }

        // Rank by overall score descending
        results.sort((a, b) -> Double.compare(b.getOverallMatchScore(), a.getOverallMatchScore()));
        return results;
    }

    private double round(double val) {
        return Math.round(val * 10.0) / 10.0;
    }
}
