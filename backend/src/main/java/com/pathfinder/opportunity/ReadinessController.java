package com.pathfinder.opportunity;

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
@RequestMapping("/api/readiness")
@RequiredArgsConstructor
@Tag(name = "Career Readiness Assessment", description = "Endpoints for 10-dimensional radar readiness profiles and gap diagnosis")
public class ReadinessController {

    private final ReadinessAssessmentEngine readinessAssessmentEngine;

    @GetMapping("/profile")
    @Operation(summary = "Get current student's 10-dimension readiness radar profile and strengths/blockers")
    public ResponseEntity<ApiResponse<OpportunityDto.ReadinessProfileResponse>> getReadinessProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(readinessAssessmentEngine.evaluateReadinessProfile(user)));
    }
}
