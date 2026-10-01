package com.pathfinder.execution;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

public class ExecutionDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExecutionSummary {
        private Integer totalAssignedTasks;
        private Integer completedTasks;
        private Integer inProgressTasks;
        private Integer delayedTasks;
        private Integer skippedTasks;
        private Integer failedTasks;
        private Double executionRate;         // % completed
        private Double deadlineAdherenceRate; // % on-time
        private Double consistencyScore;      // 0-100 score
        private Double learningVelocity;      // tasks/week
        private Double averageHoursPerTask;
        private List<ExecutionRecordDto> recentRecords;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExecutionRecordDto {
        private Long id;
        private Long taskId;
        private String taskTitle;
        private Double timeSpentHours;
        private Boolean completedOnTime;
        private Instant recordedAt;
    }
}
