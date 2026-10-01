package com.pathfinder.digitaltwin;

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
@RequestMapping("/api/digital-twin")
@RequiredArgsConstructor
@Tag(name = "Student Digital Twin", description = "Endpoints for inspecting twin state, feature vectors, version lineage, and timeline")
public class DigitalTwinController {

    private final DigitalTwinEngine digitalTwinEngine;

    @GetMapping("/current")
    @Operation(summary = "Get current versioned state of student digital twin")
    public ResponseEntity<ApiResponse<DigitalTwinDto.DigitalTwinStateResponse>> getCurrentState(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(digitalTwinEngine.getCurrentState(user)));
    }

    @GetMapping("/timeline")
    @Operation(summary = "Get complete chronological evolution timeline of the student")
    public ResponseEntity<ApiResponse<List<DigitalTwinDto.TimelineEvent>>> getTimeline(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(digitalTwinEngine.getTimeline(user)));
    }
}
