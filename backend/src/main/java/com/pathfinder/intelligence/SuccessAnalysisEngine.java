package com.pathfinder.intelligence;

import com.pathfinder.auth.User;
import com.pathfinder.common.AuditLogService;
import com.pathfinder.profile.ProfileService;
import com.pathfinder.profile.StudentProfile;
import com.pathfinder.skills.Skill;
import com.pathfinder.skills.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SuccessAnalysisEngine {

    private final SuccessEventRepository successRepository;
    private final SkillRepository skillRepository;
    private final ProfileService profileService;
    private final AuditLogService auditLogService;

    @Transactional
    public SuccessEvent recordSuccess(User user, SuccessEvent.SuccessType type, String title, String context, Long skillId, Double score, String factors) {
        StudentProfile profile = profileService.getOrCreateProfile(user);
        Skill skill = skillId != null ? skillRepository.findById(skillId).orElse(null) : null;

        SuccessEvent success = SuccessEvent.builder()
                .studentProfile(profile)
                .successType(type)
                .title(title)
                .context(context)
                .skill(skill)
                .score(score)
                .contributingFactors(factors != null ? factors : "Consistent project execution and applied hands-on practice.")
                .transferableLearnings("Repeatable pattern: break complex modules into daily verifiable test tasks.")
                .timestamp(Instant.now())
                .build();

        SuccessEvent saved = successRepository.save(success);

        auditLogService.logEvent(
                "SUCCESS_EVENT_RECORDED",
                user.getId(),
                "SuccessEvent",
                saved.getId(),
                "Logged success event: " + title
        );

        return saved;
    }

    @Transactional(readOnly = true)
    public List<IntelligenceDto.SuccessResponse> getStudentSuccesses(User user) {
        StudentProfile profile = profileService.getOrCreateProfile(user);
        return successRepository.findByStudentProfileIdOrderByTimestampDesc(profile.getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public IntelligenceDto.SuccessResponse toResponse(SuccessEvent s) {
        return IntelligenceDto.SuccessResponse.builder()
                .id(s.getId())
                .successType(s.getSuccessType())
                .title(s.getTitle())
                .context(s.getContext())
                .skillId(s.getSkill() != null ? s.getSkill().getId() : null)
                .skillName(s.getSkill() != null ? s.getSkill().getName() : "General Competency")
                .score(s.getScore())
                .contributingFactors(s.getContributingFactors())
                .transferableLearnings(s.getTransferableLearnings())
                .timestamp(s.getTimestamp())
                .build();
    }
}
