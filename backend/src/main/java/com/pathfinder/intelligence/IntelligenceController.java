package com.pathfinder.intelligence;

import com.pathfinder.adaptive.AdaptivePlanningEngine;
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
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Failure & Success Intelligence", description = "Endpoints for recording failures, successes, root cause analyses, and positive patterns")
public class IntelligenceController {

    private final FailureAnalysisEngine failureAnalysisEngine;
    private final SuccessAnalysisEngine successAnalysisEngine;
    private final AdaptivePlanningEngine adaptivePlanningEngine;

    @GetMapping("/failures")
    @Operation(summary = "Get student's logged failure events and root-cause evidence")
    public ResponseEntity<ApiResponse<List<IntelligenceDto.FailureResponse>>> getFailures(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(failureAnalysisEngine.getStudentFailures(user)));
    }

    @PostMapping("/failures")
    @Operation(summary = "Record a failure event (test, interview, or task) and automatically trigger adaptive replanning")
    public ResponseEntity<ApiResponse<IntelligenceDto.FailureResponse>> recordFailure(
            @AuthenticationPrincipal User user,
            @RequestBody IntelligenceDto.RecordFailureRequest request) {
        FailureEvent failure = failureAnalysisEngine.analyzeAndRecordFailure(user, request);

        // Trigger adaptive replanning in the closed loop
        try {
            adaptivePlanningEngine.adaptOnFailure(user, failure.getId());
        } catch (Exception e) {
            // Logged in adaptive engine
        }

        return ResponseEntity.ok(ApiResponse.ok("Failure recorded and adaptive replanning triggered.",
                failureAnalysisEngine.toResponse(failure)));
    }

    @GetMapping("/successes")
    @Operation(summary = "Get student's logged success events and transferable learnings")
    public ResponseEntity<ApiResponse<List<IntelligenceDto.SuccessResponse>>> getSuccesses(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(successAnalysisEngine.getStudentSuccesses(user)));
    }
}
