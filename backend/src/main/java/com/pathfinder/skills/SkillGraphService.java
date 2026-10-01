package com.pathfinder.skills;

import com.pathfinder.auth.User;
import com.pathfinder.common.AppException;
import com.pathfinder.common.AuditLogService;
import com.pathfinder.profile.ProfileService;
import com.pathfinder.profile.StudentProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillGraphService {

    private final SkillRepository skillRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final SkillPrerequisiteRepository prerequisiteRepository;
    private final ProfileService profileService;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public List<SkillDto.SkillResponse> getAllSkills() {
        return skillRepository.findAll().stream()
                .map(this::toSkillResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SkillDto.StudentSkillResponse> getStudentSkills(User user) {
        StudentProfile profile = profileService.getOrCreateProfile(user);
        return studentSkillRepository.findByStudentProfileId(profile.getId()).stream()
                .map(this::toStudentSkillResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SkillDto.StudentSkillResponse updateSkillProficiency(User user, SkillDto.UpdateStudentSkillRequest request) {
        StudentProfile profile = profileService.getOrCreateProfile(user);

        Skill skill = null;
        if (request.getSkillId() != null) {
            skill = skillRepository.findById(request.getSkillId())
                    .orElseThrow(() -> new AppException("Skill not found with ID: " + request.getSkillId()));
        } else if (request.getSkillName() != null) {
            skill = skillRepository.findByNameIgnoreCase(request.getSkillName().trim())
                    .orElseThrow(() -> new AppException("Skill not found with name: " + request.getSkillName()));
        } else {
            throw new AppException("Either skillId or skillName must be provided");
        }

        final Skill finalSkill = skill;
        StudentSkill studentSkill = studentSkillRepository
                .findByStudentProfileIdAndSkillId(profile.getId(), finalSkill.getId())
                .orElseGet(() -> StudentSkill.builder()
                        .studentProfile(profile)
                        .skill(finalSkill)
                        .build());

        double prevProficiency = studentSkill.getProficiency();
        if (request.getProficiency() != null) {
            studentSkill.setProficiency(Math.max(0.0, Math.min(100.0, request.getProficiency())));
        }
        if (request.getConfidenceScore() != null) {
            studentSkill.setConfidenceScore(Math.max(0.0, Math.min(100.0, request.getConfidenceScore())));
        }
        studentSkill.setLastAssessedAt(Instant.now());
        StudentSkill saved = studentSkillRepository.save(studentSkill);

        auditLogService.logEvent(
                "SKILL_PROFICIENCY_UPDATED",
                user.getId(),
                "StudentSkill",
                saved.getId(),
                String.format("Skill %s proficiency updated from %.1f%% to %.1f%%", finalSkill.getName(), prevProficiency, saved.getProficiency())
        );

        return toStudentSkillResponse(saved);
    }

    @Transactional(readOnly = true)
    public SkillDto.PrerequisiteCheckResult checkPrerequisites(User user, Long targetSkillId) {
        StudentProfile profile = profileService.getOrCreateProfile(user);
        Skill targetSkill = skillRepository.findById(targetSkillId)
                .orElseThrow(() -> new AppException("Target skill not found"));

        List<SkillPrerequisite> prerequisites = prerequisiteRepository.findBySkillId(targetSkillId);
        List<SkillDto.MissingPrerequisite> missing = new ArrayList<>();

        Map<Long, Double> studentSkillMap = studentSkillRepository.findByStudentProfileId(profile.getId()).stream()
                .collect(Collectors.toMap(ss -> ss.getSkill().getId(), StudentSkill::getProficiency));

        for (SkillPrerequisite req : prerequisites) {
            double currentProficiency = studentSkillMap.getOrDefault(req.getPrerequisiteSkill().getId(), 0.0);
            if (currentProficiency < req.getMinRequiredProficiency()) {
                missing.add(SkillDto.MissingPrerequisite.builder()
                        .prerequisiteSkillId(req.getPrerequisiteSkill().getId())
                        .prerequisiteSkillName(req.getPrerequisiteSkill().getName())
                        .currentProficiency(currentProficiency)
                        .requiredProficiency(req.getMinRequiredProficiency())
                        .type(req.getType())
                        .build());
            }
        }

        return SkillDto.PrerequisiteCheckResult.builder()
                .targetSkillId(targetSkill.getId())
                .targetSkillName(targetSkill.getName())
                .isUnlocked(missing.isEmpty())
                .missingPrerequisites(missing)
                .build();
    }

    @Transactional(readOnly = true)
    public SkillDto.SkillGraphData getFullSkillGraph(User user) {
        StudentProfile profile = profileService.getOrCreateProfile(user);
        Map<Long, Double> studentProficiency = studentSkillRepository.findByStudentProfileId(profile.getId()).stream()
                .collect(Collectors.toMap(ss -> ss.getSkill().getId(), StudentSkill::getProficiency));

        List<Skill> allSkills = skillRepository.findAll();
        List<SkillDto.GraphNode> nodes = allSkills.stream()
                .map(s -> SkillDto.GraphNode.builder()
                        .id(String.valueOf(s.getId()))
                        .label(s.getName())
                        .category(s.getCategory().name())
                        .studentProficiency(studentProficiency.getOrDefault(s.getId(), 0.0))
                        .build())
                .collect(Collectors.toList());

        List<SkillPrerequisite> allPrereqs = prerequisiteRepository.findAll();
        List<SkillDto.GraphEdge> edges = allPrereqs.stream()
                .map(p -> SkillDto.GraphEdge.builder()
                        .source(String.valueOf(p.getPrerequisiteSkill().getId()))
                        .target(String.valueOf(p.getSkill().getId()))
                        .type(p.getType().name())
                        .build())
                .collect(Collectors.toList());

        return SkillDto.SkillGraphData.builder()
                .nodes(nodes)
                .edges(edges)
                .build();
    }

    private SkillDto.SkillResponse toSkillResponse(Skill s) {
        return SkillDto.SkillResponse.builder()
                .id(s.getId())
                .name(s.getName())
                .category(s.getCategory())
                .description(s.getDescription())
                .difficultyLevel(s.getDifficultyLevel())
                .build();
    }

    private SkillDto.StudentSkillResponse toStudentSkillResponse(StudentSkill ss) {
        return SkillDto.StudentSkillResponse.builder()
                .id(ss.getId())
                .skillId(ss.getSkill().getId())
                .skillName(ss.getSkill().getName())
                .category(ss.getSkill().getCategory())
                .proficiency(ss.getProficiency())
                .confidenceScore(ss.getConfidenceScore())
                .isVerified(ss.getIsVerified())
                .evidenceCount(ss.getEvidenceCount())
                .lastAssessedAt(ss.getLastAssessedAt())
                .build();
    }
}
