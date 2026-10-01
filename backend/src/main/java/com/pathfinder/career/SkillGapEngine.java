package com.pathfinder.career;

import com.pathfinder.auth.User;
import com.pathfinder.common.AppException;
import com.pathfinder.profile.ProfileService;
import com.pathfinder.profile.StudentProfile;
import com.pathfinder.skills.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillGapEngine {

    private final CareerPathRepository careerPathRepository;
    private final CareerPathSkillRepository careerPathSkillRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final SkillPrerequisiteRepository prerequisiteRepository;
    private final ProfileService profileService;

    @Transactional(readOnly = true)
    public CareerDto.SkillGapReport generateSkillGapReport(User user, Long careerPathId) {
        StudentProfile profile = profileService.getOrCreateProfile(user);
        CareerPath careerPath = careerPathRepository.findById(careerPathId)
                .orElseThrow(() -> new AppException("Career path not found with ID: " + careerPathId));

        List<CareerPathSkill> pathSkills = careerPathSkillRepository.findByCareerPathId(careerPathId);
        Map<Long, Double> studentSkills = studentSkillRepository.findByStudentProfileId(profile.getId()).stream()
                .collect(Collectors.toMap(ss -> ss.getSkill().getId(), StudentSkill::getProficiency));

        List<CareerDto.SkillGapItem> gapItems = new ArrayList<>();
        int readyCount = 0;
        int gapCount = 0;
        double totalGapPercent = 0.0;

        for (CareerPathSkill ps : pathSkills) {
            Skill skill = ps.getSkill();
            double target = ps.getTargetProficiency();
            double current = studentSkills.getOrDefault(skill.getId(), 0.0);
            double gap = Math.max(0.0, target - current);

            // Check prerequisite blocking
            List<SkillPrerequisite> prereqs = prerequisiteRepository.findBySkillId(skill.getId());
            boolean isBlocked = false;
            for (SkillPrerequisite pre : prereqs) {
                double preProf = studentSkills.getOrDefault(pre.getPrerequisiteSkill().getId(), 0.0);
                if (preProf < pre.getMinRequiredProficiency()) {
                    isBlocked = true;
                    break;
                }
            }

            CareerDto.GapPriority priority;
            String recommendation;
            if (gap <= 0.0) {
                priority = CareerDto.GapPriority.READY;
                recommendation = "Proficiency satisfies target career standards. Ready for production work.";
                readyCount++;
            } else {
                gapCount++;
                totalGapPercent += (gap / target) * 100.0;

                if (isBlocked || gap > 40.0) {
                    priority = CareerDto.GapPriority.HIGH;
                    recommendation = isBlocked ?
                            "Critical blocker: Foundational prerequisites must be completed before advancing." :
                            "Substantial skill gap: High priority learning milestone required.";
                } else if (gap > 20.0) {
                    priority = CareerDto.GapPriority.MEDIUM;
                    recommendation = "Moderate gap: Intermediate targeted project practice recommended.";
                } else {
                    priority = CareerDto.GapPriority.LOW;
                    recommendation = "Minor gap: Near target proficiency. Polish with assessments.";
                }
            }

            gapItems.add(CareerDto.SkillGapItem.builder()
                    .skillId(skill.getId())
                    .skillName(skill.getName())
                    .currentProficiency(round(current))
                    .requiredProficiency(round(target))
                    .gapValue(round(gap))
                    .priority(priority)
                    .isPrerequisiteBlocker(isBlocked)
                    .actionRecommendation(recommendation)
                    .build());
        }

        // Sort: HIGH priority first, then MEDIUM, LOW, READY
        gapItems.sort((a, b) -> b.getPriority().compareTo(a.getPriority()));

        double avgGap = gapCount == 0 ? 0.0 : round(totalGapPercent / pathSkills.size());

        return CareerDto.SkillGapReport.builder()
                .careerPathId(careerPath.getId())
                .careerPathTitle(careerPath.getTitle())
                .totalRequiredSkills(pathSkills.size())
                .readySkillsCount(readyCount)
                .gapSkillsCount(gapCount)
                .averageGapPercentage(avgGap)
                .gaps(gapItems)
                .build();
    }

    private double round(double val) {
        return Math.round(val * 10.0) / 10.0;
    }
}
