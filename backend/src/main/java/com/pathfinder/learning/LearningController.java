package com.pathfinder.learning;

import com.pathfinder.auth.User;
import com.pathfinder.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning")
@RequiredArgsConstructor
@Tag(name = "Learning Roadmap", description = "Endpoints for generating and inspecting personalized learning roadmaps and phases")
public class LearningController {

    private final LearningRoadmapEngine roadmapEngine;

    @GetMapping("/active")
    @Operation(summary = "Get current student's active personalized learning roadmap")
    public ResponseEntity<ApiResponse<LearningDto.LearningPlanResponse>> getActivePlan(@AuthenticationPrincipal User user) {
        LearningDto.LearningPlanResponse plan = roadmapEngine.getActivePlan(user);
        return ResponseEntity.ok(ApiResponse.ok(plan));
    }

    @PostMapping("/generate/{careerPathId}")
    @Operation(summary = "Generate a new personalized learning roadmap for a target career path")
    public ResponseEntity<ApiResponse<LearningDto.LearningPlanResponse>> generateRoadmap(
            @AuthenticationPrincipal User user,
            @PathVariable Long careerPathId) {
        LearningDto.LearningPlanResponse plan = roadmapEngine.generateRoadmap(user, careerPathId);
        return ResponseEntity.ok(ApiResponse.ok("Personalized roadmap generated successfully", plan));
    }

    @GetMapping("/today")
    @Operation(summary = "Get prioritized daily tasks from current roadmap")
    public ResponseEntity<ApiResponse<List<LearningDto.LearningTaskDto>>> getTodayTasks(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(roadmapEngine.getTodayTasks(user)));
    }
}
