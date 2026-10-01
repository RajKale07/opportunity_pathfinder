package com.pathfinder.profile;

import com.pathfinder.auth.User;
import com.pathfinder.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Tag(name = "Student Profile", description = "Endpoints for managing student academic background, goals, projects, and achievements")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    @Operation(summary = "Get current student's full profile")
    public ResponseEntity<ApiResponse<ProfileDto.ProfileResponse>> getProfile(@AuthenticationPrincipal User user) {
        ProfileDto.ProfileResponse response = profileService.getProfileResponse(user);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping
    @Operation(summary = "Update student profile details and preferences")
    public ResponseEntity<ApiResponse<ProfileDto.ProfileResponse>> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody ProfileDto.UpdateProfileRequest request) {
        ProfileDto.ProfileResponse response = profileService.updateProfile(user, request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", response));
    }

    @PostMapping("/projects")
    @Operation(summary = "Add a portfolio project with complexity and tech stack")
    public ResponseEntity<ApiResponse<ProfileDto.ProjectDto>> addProject(
            @AuthenticationPrincipal User user,
            @RequestBody ProfileDto.ProjectDto dto) {
        ProfileDto.ProjectDto response = profileService.addProject(user, dto);
        return ResponseEntity.ok(ApiResponse.ok("Project added successfully", response));
    }

    @PostMapping("/career-goals")
    @Operation(summary = "Add a career goal (Primary, Alternative, or Exploration path)")
    public ResponseEntity<ApiResponse<ProfileDto.CareerGoalDto>> addCareerGoal(
            @AuthenticationPrincipal User user,
            @RequestBody ProfileDto.CareerGoalDto dto) {
        ProfileDto.CareerGoalDto response = profileService.addCareerGoal(user, dto);
        return ResponseEntity.ok(ApiResponse.ok("Career goal added successfully", response));
    }
}
