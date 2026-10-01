package com.pathfinder.execution;

import com.pathfinder.auth.User;
import com.pathfinder.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/execution")
@RequiredArgsConstructor
@Tag(name = "Execution Monitoring", description = "Endpoints for analyzing task completion behavior, deadline adherence, and learning consistency")
public class ExecutionController {

    private final ExecutionMonitoringEngine executionMonitoringEngine;

    @GetMapping("/summary")
    @Operation(summary = "Get behavioral execution summary, consistency metrics, and velocity")
    public ResponseEntity<ApiResponse<ExecutionDto.ExecutionSummary>> getExecutionSummary(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(executionMonitoringEngine.getExecutionSummary(user)));
    }
}
