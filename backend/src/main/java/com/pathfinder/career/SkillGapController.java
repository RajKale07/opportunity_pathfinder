package com.pathfinder.career;

import com.pathfinder.auth.User;
import com.pathfinder.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/skill-gaps")
@RequiredArgsConstructor
@Tag(name = "Skill Gap Engine", description = "Endpoints for analyzing skill gaps, gap priorities, and prerequisite blockers")
public class SkillGapController {

    private final SkillGapEngine skillGapEngine;

    @GetMapping("/path/{careerPathId}")
    @Operation(summary = "Generate a comprehensive skill gap report for a specific target career path")
    public ResponseEntity<ApiResponse<CareerDto.SkillGapReport>> getSkillGapReport(
            @AuthenticationPrincipal User user,
            @PathVariable Long careerPathId) {
        return ResponseEntity.ok(ApiResponse.ok(skillGapEngine.generateSkillGapReport(user, careerPathId)));
    }
}
