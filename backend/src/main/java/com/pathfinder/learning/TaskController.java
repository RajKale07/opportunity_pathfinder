package com.pathfinder.learning;

import com.pathfinder.auth.User;
import com.pathfinder.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Learning Tasks & Evidence", description = "Endpoints for updating task lifecycle status and submitting verifiable milestone evidence")
public class TaskController {

    private final LearningRoadmapEngine roadmapEngine;

    @PatchMapping("/{taskId}/status")
    @Operation(summary = "Update task status (NOT_STARTED, IN_PROGRESS, COMPLETED, SKIPPED, FAILED)")
    public ResponseEntity<ApiResponse<LearningDto.LearningTaskDto>> updateStatus(
            @AuthenticationPrincipal User user,
            @PathVariable Long taskId,
            @RequestBody LearningDto.UpdateTaskStatusRequest request) {
        LearningDto.LearningTaskDto updated = roadmapEngine.updateTaskStatus(user, taskId, request.getStatus());
        return ResponseEntity.ok(ApiResponse.ok("Task status updated", updated));
    }

    @PostMapping("/{taskId}/evidence")
    @Operation(summary = "Submit verifiable evidence (e.g. GitHub repo, link, notes) and complete task")
    public ResponseEntity<ApiResponse<LearningDto.LearningTaskDto>> submitEvidence(
            @AuthenticationPrincipal User user,
            @PathVariable Long taskId,
            @RequestBody LearningDto.SubmitEvidenceRequest request) {
        LearningDto.LearningTaskDto updated = roadmapEngine.submitEvidence(user, taskId, request);
        return ResponseEntity.ok(ApiResponse.ok("Evidence submitted and task completed. Skill proficiency updated.", updated));
    }
}
