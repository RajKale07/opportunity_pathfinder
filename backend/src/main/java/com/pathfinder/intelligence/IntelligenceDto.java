package com.pathfinder.intelligence;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

public class IntelligenceDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecordFailureRequest {
        private FailureEvent.FailureType failureType;
        private String context;
        private Long skillId;
        private Double score;
        private String evidence;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FailureResponse {
        private Long id;
        private FailureEvent.FailureType failureType;
        private String context;
        private Long skillId;
        private String skillName;
        private Double score;
        private FailureEvent.Severity severity;
        private FailureEvent.ConfidenceCategory confidence;
        private String observedFactor;
        private String likelyContributingFactor;
        private String evidence;
        private String recommendedRecoveryAction;
        private Boolean isResolved;
        private Instant timestamp;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SuccessResponse {
        private Long id;
        private SuccessEvent.SuccessType successType;
        private String title;
        private String context;
        private Long skillId;
        private String skillName;
        private Double score;
        private String contributingFactors;
        private String transferableLearnings;
        private Instant timestamp;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IntelligenceTimelineResponse {
        private List<FailureResponse> failures;
        private List<SuccessResponse> successes;
    }
}
