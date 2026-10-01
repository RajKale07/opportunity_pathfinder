package com.pathfinder.evaluation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class EvaluationDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EvaluationOverview {
        private RecommendationMetrics recommendation;
        private ExecutionMetrics execution;
        private AdaptiveMetrics adaptive;
        private List<BaselineComparisonRow> baselineComparisons;
        private List<AblationComparisonRow> ablationStudy;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecommendationMetrics {
        private Double precisionAtK; // Precision@3
        private Double recallAtK;    // Recall@3
        private Double f1Score;
        private Double ndcg;
        private Double hitRate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExecutionMetrics {
        private Double taskCompletionRate;
        private Double deadlineAdherenceRate;
        private Double consistencyScore;
        private Double learningVelocity;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdaptiveMetrics {
        private Integer totalAdaptations;
        private Double failureRecoveryRate;
        private Double averageRemediationDays;
        private Double postAdaptationScoreGain;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BaselineComparisonRow {
        private String metric;
        private String baselineName;
        private Double baselineScore;
        private Double pathfinderScore;
        private Double improvementPercentage;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AblationComparisonRow {
        private String configuration;
        private String description;
        private Double matchAccuracy;
        private Double roadmapCompletionRate;
        private Double readinessCorrelation;
    }
}
