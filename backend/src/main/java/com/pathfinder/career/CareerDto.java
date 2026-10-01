package com.pathfinder.career;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class CareerDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CareerPathSummary {
        private Long id;
        private String title;
        private String domain;
        private String description;
        private String avgSalaryRange;
        private String growthOutlook;
        private List<RequiredSkillSummary> requiredSkills;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RequiredSkillSummary {
        private Long skillId;
        private String skillName;
        private Double targetProficiency;
        private Double weight;
        private Boolean isCore;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CareerRecommendationResponse {
        private Long careerPathId;
        private String title;
        private String domain;
        private Double overallMatchScore;
        private Double skillAlignment;
        private Double interestAlignment;
        private Double goalAlignment;
        private Double academicAlignment;
        private Double projectAlignment;
        private Double opportunityAlignment;
        private String matchRationale;
        private List<SkillGapItem> topSkillGaps;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillGapReport {
        private Long careerPathId;
        private String careerPathTitle;
        private Integer totalRequiredSkills;
        private Integer readySkillsCount;
        private Integer gapSkillsCount;
        private Double averageGapPercentage;
        private List<SkillGapItem> gaps;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillGapItem {
        private Long skillId;
        private String skillName;
        private Double currentProficiency;
        private Double requiredProficiency;
        private Double gapValue;
        private GapPriority priority; // READY, LOW, MEDIUM, HIGH
        private boolean isPrerequisiteBlocker;
        private String actionRecommendation;
    }

    public enum GapPriority {
        READY,
        LOW,
        MEDIUM,
        HIGH
    }
}
