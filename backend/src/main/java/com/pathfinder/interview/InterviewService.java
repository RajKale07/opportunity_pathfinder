package com.pathfinder.interview;

import com.pathfinder.auth.User;
import com.pathfinder.common.AppException;
import com.pathfinder.common.AuditLogService;
import com.pathfinder.intelligence.FailureAnalysisEngine;
import com.pathfinder.intelligence.FailureEvent;
import com.pathfinder.intelligence.IntelligenceDto;
import com.pathfinder.intelligence.SuccessAnalysisEngine;
import com.pathfinder.intelligence.SuccessEvent;
import com.pathfinder.profile.ProfileService;
import com.pathfinder.profile.StudentProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewQuestionRepository questionRepository;
    private final InterviewAssessmentRepository assessmentRepository;
    private final ProfileService profileService;
    private final FailureAnalysisEngine failureAnalysisEngine;
    private final SuccessAnalysisEngine successAnalysisEngine;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public List<InterviewDto.QuestionResponse> getAllQuestions() {
        return questionRepository.findAll().stream()
                .map(this::toQuestionResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public InterviewDto.AssessmentResult evaluateAnswer(User user, InterviewDto.SubmitAnswerRequest req) {
        StudentProfile profile = profileService.getOrCreateProfile(user);
        InterviewQuestion question = questionRepository.findById(req.getQuestionId())
                .orElseThrow(() -> new AppException("Question not found"));

        String ans = req.getAnswer() != null ? req.getAnswer().trim() : "";

        // Deterministic transparent scoring algorithm
        double score = 40.0;
        String weakness = null;
        String feedback;

        if (ans.length() < 30) {
            score = 35.0;
            weakness = "Superficial answer lacking technical depth";
            feedback = "Answer is too brief. Provide architectural explanations, trade-offs, and concrete examples.";
        } else if (ans.length() < 100) {
            score = 65.0;
            feedback = "Satisfactory conceptual baseline. Elaborate on edge-case handling and production implications.";
        } else {
            score = 88.0;
            feedback = "Comprehensive and structured response demonstrating clear conceptual grasp and engineering nuance.";
        }

        InterviewAssessment assessment = InterviewAssessment.builder()
                .studentProfile(profile)
                .question(question)
                .studentAnswer(ans)
                .score(score)
                .feedback(feedback)
                .detectedWeakness(weakness)
                .timestamp(Instant.now())
                .build();

        InterviewAssessment saved = assessmentRepository.save(assessment);

        // Closed loop integration:
        if (score < 60.0) {
            failureAnalysisEngine.analyzeAndRecordFailure(user, IntelligenceDto.RecordFailureRequest.builder()
                    .failureType(FailureEvent.FailureType.INTERVIEW_FAILURE)
                    .context("Mock Interview Assessment: " + question.getQuestionText().substring(0, Math.min(50, question.getQuestionText().length())) + "...")
                    .skillId(question.getTargetSkill() != null ? question.getTargetSkill().getId() : null)
                    .score(score)
                    .evidence("Recorded answer: " + (ans.length() > 60 ? ans.substring(0, 60) + "..." : ans))
                    .build());
        } else if (score >= 80.0) {
            successAnalysisEngine.recordSuccess(
                    user,
                    SuccessEvent.SuccessType.INTERVIEW_PASSED,
                    "High Score in Technical Interview Practice",
                    question.getQuestionText(),
                    question.getTargetSkill() != null ? question.getTargetSkill().getId() : null,
                    score,
                    "Detailed technical response structure with comprehensive domain understanding."
            );
        }

        auditLogService.logEvent(
                "INTERVIEW_ANSWER_EVALUATED",
                user.getId(),
                "InterviewAssessment",
                saved.getId(),
                String.format("Evaluated answer for Q%d with score %.1f%%", question.getId(), score)
        );

        return InterviewDto.AssessmentResult.builder()
                .id(saved.getId())
                .questionId(question.getId())
                .questionText(question.getQuestionText())
                .score(saved.getScore())
                .feedback(saved.getFeedback())
                .detectedWeakness(saved.getDetectedWeakness())
                .timestamp(saved.getTimestamp())
                .build();
    }

    @Transactional(readOnly = true)
    public List<InterviewDto.AssessmentResult> getPastAssessments(User user) {
        StudentProfile profile = profileService.getOrCreateProfile(user);
        return assessmentRepository.findByStudentProfileIdOrderByTimestampDesc(profile.getId()).stream()
                .map(a -> InterviewDto.AssessmentResult.builder()
                        .id(a.getId())
                        .questionId(a.getQuestion().getId())
                        .questionText(a.getQuestion().getQuestionText())
                        .score(a.getScore())
                        .feedback(a.getFeedback())
                        .detectedWeakness(a.getDetectedWeakness())
                        .timestamp(a.getTimestamp())
                        .build())
                .collect(Collectors.toList());
    }

    public InterviewDto.QuestionResponse toQuestionResponse(InterviewQuestion q) {
        return InterviewDto.QuestionResponse.builder()
                .id(q.getId())
                .questionText(q.getQuestionText())
                .type(q.getType())
                .targetSkillId(q.getTargetSkill() != null ? q.getTargetSkill().getId() : null)
                .targetSkillName(q.getTargetSkill() != null ? q.getTargetSkill().getName() : "Core Computer Science")
                .difficulty(q.getDifficulty())
                .sampleAnswerGuideline(q.getSampleAnswerGuideline())
                .build();
    }
}
