package com.pathfinder.execution;

import com.pathfinder.auth.User;
import com.pathfinder.learning.LearningTask;
import com.pathfinder.learning.LearningTaskRepository;
import com.pathfinder.profile.ProfileService;
import com.pathfinder.profile.StudentProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExecutionMonitoringEngine {

    private final LearningTaskRepository taskRepository;
    private final ExecutionRecordRepository executionRecordRepository;
    private final ProfileService profileService;

    @Transactional(readOnly = true)
    public ExecutionDto.ExecutionSummary getExecutionSummary(User user) {
        StudentProfile profile = profileService.getOrCreateProfile(user);
        List<LearningTask> allTasks = taskRepository.findByRoadmapPhase_LearningPlan_StudentProfile_Id(profile.getId());
        List<ExecutionRecord> records = executionRecordRepository.findByStudentProfileIdOrderByRecordedAtDesc(profile.getId());

        int totalAssigned = allTasks.size();
        int completed = 0;
        int inProgress = 0;
        int skipped = 0;
        int failed = 0;
        int delayed = 0;
        Instant now = Instant.now();

        for (LearningTask t : allTasks) {
            if (t.getStatus() == LearningTask.TaskStatus.COMPLETED) completed++;
            else if (t.getStatus() == LearningTask.TaskStatus.IN_PROGRESS) inProgress++;
            else if (t.getStatus() == LearningTask.TaskStatus.SKIPPED) skipped++;
            else if (t.getStatus() == LearningTask.TaskStatus.FAILED) failed++;

            // Delayed if past deadline and not completed
            if (t.getDeadline() != null && t.getDeadline().isBefore(now) && t.getStatus() != LearningTask.TaskStatus.COMPLETED) {
                delayed++;
            }
        }

        // Mathematical formulas from Section 8 and Section 15:
        // Execution Rate = (completed_tasks / assigned_tasks) * 100
        double executionRate = totalAssigned == 0 ? 0.0 : round(((double) completed / totalAssigned) * 100.0);

        // Deadline Adherence Rate
        long onTimeCount = records.stream().filter(ExecutionRecord::getCompletedOnTime).count();
        double adherenceRate = records.isEmpty() ? 85.0 : round(((double) onTimeCount / records.size()) * 100.0);

        // Average time spent
        double avgHours = records.isEmpty() ? 4.5 :
                round(records.stream().mapToDouble(ExecutionRecord::getTimeSpentHours).average().orElse(4.0));

        // Consistency score: based on execution rate and low delay penalty
        double delayPenalty = Math.min(30.0, delayed * 5.0);
        double consistency = round(Math.max(10.0, Math.min(100.0, (executionRate * 0.7) + (adherenceRate * 0.3) - delayPenalty + 20.0)));

        // Learning Velocity (tasks completed / estimated active cycles)
        double velocity = round(Math.max(0.5, completed * 0.8));

        List<ExecutionDto.ExecutionRecordDto> recordDtos = records.stream()
                .limit(10)
                .map(r -> ExecutionDto.ExecutionRecordDto.builder()
                        .id(r.getId())
                        .taskId(r.getLearningTask().getId())
                        .taskTitle(r.getLearningTask().getTitle())
                        .timeSpentHours(r.getTimeSpentHours())
                        .completedOnTime(r.getCompletedOnTime())
                        .recordedAt(r.getRecordedAt())
                        .build())
                .collect(Collectors.toList());

        return ExecutionDto.ExecutionSummary.builder()
                .totalAssignedTasks(totalAssigned)
                .completedTasks(completed)
                .inProgressTasks(inProgress)
                .delayedTasks(delayed)
                .skippedTasks(skipped)
                .failedTasks(failed)
                .executionRate(executionRate)
                .deadlineAdherenceRate(adherenceRate)
                .consistencyScore(consistency)
                .learningVelocity(velocity)
                .averageHoursPerTask(avgHours)
                .recentRecords(recordDtos)
                .build();
    }

    private double round(double val) {
        return Math.round(val * 10.0) / 10.0;
    }
}
