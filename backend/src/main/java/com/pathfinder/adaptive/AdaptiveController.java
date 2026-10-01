package com.pathfinder.adaptive;

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
@RequestMapping("/api/adaptation")
@RequiredArgsConstructor
@Tag(name = "Adaptive Replanning", description = "Endpoints for inspecting plan adaptations, diffs, and triggering replanning actions")
public class AdaptiveController {

    private final AdaptivePlanningEngine adaptivePlanningEngine;

    @GetMapping("/history")
    @Operation(summary = "Get historical record of all adaptive replanning events and plan diffs")
    public ResponseEntity<ApiResponse<List<AdaptiveDto.AdaptationResponse>>> getHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(adaptivePlanningEngine.getAdaptationHistory(user)));
    }

    @PostMapping("/trigger")
    @Operation(summary = "Manually trigger adaptive replanning against a specific failure event")
    public ResponseEntity<ApiResponse<AdaptiveDto.AdaptationResponse>> triggerAdaptation(
            @AuthenticationPrincipal User user,
            @RequestBody AdaptiveDto.TriggerAdaptationRequest request) {
        AdaptiveDto.AdaptationResponse response = adaptivePlanningEngine.adaptOnFailure(user, request.getFailureEventId());
        return ResponseEntity.ok(ApiResponse.ok("Adaptive replanning completed successfully", response));
    }
}
