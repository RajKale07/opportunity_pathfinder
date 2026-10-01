package com.pathfinder.adaptive;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

public class AdaptiveDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TriggerAdaptationRequest {
        private Long failureEventId;
        private Long skillId;
        private String reason;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdaptationResponse {
        private Long id;
        private Long planId;
        private String actionType;
        private String triggerReason;
        private String beforePlanSummary;
        private String afterPlanSummary;
        private Integer previousTwinVersion;
        private Integer newTwinVersion;
        private Instant timestamp;
    }
}
