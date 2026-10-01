package com.pathfinder.skills;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

public class SkillDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillResponse {
        private Long id;
        private String name;
        private Skill.Category category;
        private String description;
        private Integer difficultyLevel;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentSkillResponse {
        private Long id;
        private Long skillId;
        private String skillName;
        private Skill.Category category;
        private Double proficiency;
        private Double confidenceScore;
        private Boolean isVerified;
        private Integer evidenceCount;
        private Instant lastAssessedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateStudentSkillRequest {
        private Long skillId;
        private String skillName;
        private Double proficiency; // 0 - 100
        private Double confidenceScore; // 0 - 100
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrerequisiteCheckResult {
        private Long targetSkillId;
        private String targetSkillName;
        private boolean isUnlocked;
        private List<MissingPrerequisite> missingPrerequisites;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MissingPrerequisite {
        private Long prerequisiteSkillId;
        private String prerequisiteSkillName;
        private Double currentProficiency;
        private Double requiredProficiency;
        private SkillPrerequisite.PrerequisiteType type;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillGraphData {
        private List<GraphNode> nodes;
        private List<GraphEdge> edges;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GraphNode {
        private String id;
        private String label;
        private String category;
        private Double studentProficiency;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GraphEdge {
        private String source;
        private String target;
        private String type;
    }
}
