package com.pathfinder.learning;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

public class LearningDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LearningPlanResponse {
        private Long id;
        private Long careerPathId;
        private String careerPathTitle;
        private String title;
        private String objective;
        private LearningPlan.PlanStatus status;
        private Integer version;
        private List<RoadmapPhaseDto> phases;
        private Instant createdAt;
        private Instant updatedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoadmapPhaseDto {
        private Long id;
        private Integer phaseOrder;
        private String title;
        private String description;
        private Integer durationWeeks;
        private RoadmapPhase.PhaseStatus status;
        private List<LearningTaskDto> tasks;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LearningTaskDto {
        private Long id;
        private Integer taskOrder;
        private String title;
        private String description;
        private Long skillId;
        private String skillName;
        private Integer difficulty;
        private Double estimatedHours;
        private LearningTask.TaskPriority priority;
        private LearningTask.TaskStatus status;
        private Instant deadline;
        private Instant completedAt;
        private List<TaskEvidenceDto> evidences;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TaskEvidenceDto {
        private Long id;
        private TaskEvidence.EvidenceType type;
        private String urlOrReference;
        private String notes;
        private Double verificationScore;
        private Instant submittedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubmitEvidenceRequest {
        private TaskEvidence.EvidenceType type;
        private String urlOrReference;
        private String notes;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateTaskStatusRequest {
        private LearningTask.TaskStatus status;
    }
}
