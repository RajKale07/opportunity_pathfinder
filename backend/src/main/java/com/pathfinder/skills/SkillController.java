package com.pathfinder.skills;

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
@RequestMapping("/api/skills")
@RequiredArgsConstructor
@Tag(name = "Skills & Skill Graph", description = "Endpoints for managing skills, proficiencies, prerequisites, and dependency graphs")
public class SkillController {

    private final SkillGraphService skillGraphService;

    @GetMapping
    @Operation(summary = "Get global skill catalog")
    public ResponseEntity<ApiResponse<List<SkillDto.SkillResponse>>> getAllSkills() {
        return ResponseEntity.ok(ApiResponse.ok(skillGraphService.getAllSkills()));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current student's tracked skills and proficiencies")
    public ResponseEntity<ApiResponse<List<SkillDto.StudentSkillResponse>>> getMySkills(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(skillGraphService.getStudentSkills(user)));
    }

    @PutMapping("/my")
    @Operation(summary = "Update or add skill proficiency for current student")
    public ResponseEntity<ApiResponse<SkillDto.StudentSkillResponse>> updateSkillProficiency(
            @AuthenticationPrincipal User user,
            @RequestBody SkillDto.UpdateStudentSkillRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Skill proficiency updated", skillGraphService.updateSkillProficiency(user, request)));
    }

    @GetMapping("/prerequisites/{skillId}")
    @Operation(summary = "Check if student satisfies prerequisites for target skill")
    public ResponseEntity<ApiResponse<SkillDto.PrerequisiteCheckResult>> checkPrerequisites(
            @AuthenticationPrincipal User user,
            @PathVariable Long skillId) {
        return ResponseEntity.ok(ApiResponse.ok(skillGraphService.checkPrerequisites(user, skillId)));
    }

    @GetMapping("/graph")
    @Operation(summary = "Get complete Skill Graph nodes and edges for student visualizer")
    public ResponseEntity<ApiResponse<SkillDto.SkillGraphData>> getSkillGraph(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(skillGraphService.getFullSkillGraph(user)));
    }
}
