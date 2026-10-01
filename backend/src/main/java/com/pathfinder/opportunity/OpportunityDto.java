package com.pathfinder.opportunity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

public class OpportunityDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OpportunityResponse {
        private Long id;
        private String title;
        private String company;
        private Opportunity.OpportunityType type;
        private String domain;
        private String location;
        private Boolean remote;
        private String compensation;
        private Instant deadline;
        private String description;
        private Double matchPercentage;
        private Double readinessPercentage;
        private String requirementsMetRatio;
        private List<String> satisfiedSkills;
        private List<String> missingSkills;
        private String whyMatchedExplanation;
        private String readinessExplanation;
        private Application.ApplicationStatus applicationStatus;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApplyRequest {
        private String notes;
        private Application.ApplicationStatus status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReadinessProfileResponse {
        private Double overallReadinessScore;
        private String readinessTier;
        private List<DimensionScore> dimensions;
        private List<String> keyStrengths;
        private List<String> keyBlockers;
        private String summaryNarrative;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DimensionScore {
        private String dimensionName;
        private Double score; // 0 - 100
        private String benchmark;
        private String evidenceSummary;
    }
}
