package com.pathfinder.digitaltwin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

public class DigitalTwinDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DigitalTwinStateResponse {
        private Long studentId;
        private String studentName;
        private Integer currentVersion;
        private DigitalTwinFeatureVector features;
        private Double overallReadiness;
        private String readinessTier;
        private String lastTriggerEvent;
        private Instant lastUpdated;
        private List<SnapshotSummary> snapshotHistory;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SnapshotSummary {
        private Long id;
        private Integer version;
        private String triggerEvent;
        private String changeSummary;
        private Double overallReadiness;
        private Instant timestamp;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TimelineEvent {
        private String id;
        private Instant timestamp;
        private String type; // PROFILE, SKILL, TASK, FAILURE, SUCCESS, ADAPTATION, OPPORTUNITY
        private String title;
        private String description;
        private String tag;
        private Integer twinVersion;
    }
}
