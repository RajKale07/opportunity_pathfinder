package com.pathfinder.interview;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

public class InterviewDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionResponse {
        private Long id;
        private String questionText;
        private InterviewQuestion.QuestionType type;
        private Long targetSkillId;
        private String targetSkillName;
        private Integer difficulty;
        private String sampleAnswerGuideline;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubmitAnswerRequest {
        private Long questionId;
        private String answer;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssessmentResult {
        private Long id;
        private Long questionId;
        private String questionText;
        private Double score;
        private String feedback;
        private String detectedWeakness;
        private Instant timestamp;
    }
}
