package com.pathfinder.resume;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class ResumeDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnalyzeRequest {
        private String text; // Resume text or project description
        private String targetRole; // e.g. "Backend Developer"
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnalysisResult {
        private Integer wordsAnalyzed;
        private List<String> detectedSkills;
        private List<String> detectedArchitectures;
        private List<String> missingRecommendedKeywords;
        private Double keywordDensityScore;
        private String strengthNarrative;
        private String improvementRecommendations;
    }
}
