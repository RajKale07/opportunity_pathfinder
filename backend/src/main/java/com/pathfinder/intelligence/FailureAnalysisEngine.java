package com.pathfinder.intelligence;

import com.pathfinder.auth.User;
import com.pathfinder.common.AuditLogService;
import com.pathfinder.profile.ProfileService;
import com.pathfinder.profile.StudentProfile;
import com.pathfinder.skills.Skill;
import com.pathfinder.skills.SkillPrerequisiteRepository;
import com.pathfinder.skills.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FailureAnalysisEngine {

    private final FailureEventRepository failureRepository;
    private final SkillRepository skillRepository;
    private final SkillPrerequisiteRepository prerequisiteRepository;
    private final ProfileService profileService;
    private final AuditLogService auditLogService;

    @Transactional
    public FailureEvent analyzeAndRecordFailure(User user, IntelligenceDto.RecordFailureRequest req) {
        StudentProfile profile = profileService.getOrCreateProfile(user);
        Skill skill = req.getSkillId() != null ? skillRepository.findById(req.getSkillId()).orElse(null) : null;

        // Determine Severity
        FailureEvent.Severity severity = FailureEvent.Severity.MEDIUM;
        if (req.getScore() != null && req.getScore() < 50.0) {
            severity = FailureEvent.Severity.HIGH;
        }

        // Determine Confidence & Contributing factors
        FailureEvent.ConfidenceCategory confidence = FailureEvent.ConfidenceCategory.OBSERVED;
        String observed = String.format("Score of %.1f%% achieved in %s (threshold: 70%%).",
                req.getScore() != null ? req.getScore() : 0.0, req.getContext());

        String likely = "Insufficient structured problem practice and incomplete prerequisite foundational mastery.";
        if (skill != null) {
            likely = String.format("Lack of algorithmic drills in %s and untested edge-case understanding.", skill.getName());
        }

        String recovery = skill != null ?
                String.format("Insert dedicated prerequisite module for %s, complete 5 focused lab exercises, and reassess.", skill.getName()) :
                "Reduce workload pacing, review foundational concepts, and retake assessment.";

        FailureEvent failure = FailureEvent.builder()
                .studentProfile(profile)
                .failureType(req.getFailureType() != null ? req.getFailureType() : FailureEvent.FailureType.ASSESSMENT_FAILURE)
                .context(req.getContext())
                .skill(skill)
                .score(req.getScore())
                .severity(severity)
                .confidence(confidence)
                .observedFactor(observed)
                .likelyContributingFactor(likely)
                .evidence(req.getEvidence() != null ? req.getEvidence() : "Assessment test submission report")
                .recommendedRecoveryAction(recovery)
                .isResolved(false)
                .timestamp(Instant.now())
                .build();

        FailureEvent saved = failureRepository.save(failure);

        auditLogService.logEvent(
                "FAILURE_EVENT_RECORDED",
                user.getId(),
                "FailureEvent",
                saved.getId(),
                String.format("Failure logged in %s: %s (Severity: %s)", req.getContext(), observed, severity)
        );

        return saved;
    }

    @Transactional(readOnly = true)
    public List<IntelligenceDto.FailureResponse> getStudentFailures(User user) {
        StudentProfile profile = profileService.getOrCreateProfile(user);
        return failureRepository.findByStudentProfileIdOrderByTimestampDesc(profile.getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public IntelligenceDto.FailureResponse toResponse(FailureEvent f) {
        return IntelligenceDto.FailureResponse.builder()
                .id(f.getId())
                .failureType(f.getFailureType())
                .context(f.getContext())
                .skillId(f.getSkill() != null ? f.getSkill().getId() : null)
                .skillName(f.getSkill() != null ? f.getSkill().getName() : "General Competency")
                .score(f.getScore())
                .severity(f.getSeverity())
                .confidence(f.getConfidence())
                .observedFactor(f.getObservedFactor())
                .likelyContributingFactor(f.getLikelyContributingFactor())
                .evidence(f.getEvidence())
                .recommendedRecoveryAction(f.getRecommendedRecoveryAction())
                .isResolved(f.getIsResolved())
                .timestamp(f.getTimestamp())
                .build();
    }
}
