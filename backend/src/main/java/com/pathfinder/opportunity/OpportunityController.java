package com.pathfinder.opportunity;

import com.pathfinder.auth.User;
import com.pathfinder.common.ApiResponse;
import com.pathfinder.common.AppException;
import com.pathfinder.common.AuditLogService;
import com.pathfinder.profile.ProfileService;
import com.pathfinder.profile.StudentProfile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/opportunities")
@RequiredArgsConstructor
@Tag(name = "Opportunities & Matching", description = "Endpoints for discovering opportunities, inspecting matches, and managing applications")
public class OpportunityController {

    private final OpportunityMatchingEngine matchingEngine;
    private final OpportunityRepository opportunityRepository;
    private final ApplicationRepository applicationRepository;
    private final ProfileService profileService;
    private final AuditLogService auditLogService;

    @GetMapping("/matches")
    @Operation(summary = "Get opportunities ranked by twin match percentage with separate readiness scores")
    public ResponseEntity<ApiResponse<List<OpportunityDto.OpportunityResponse>>> getMatches(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(matchingEngine.matchOpportunities(user)));
    }

    @PostMapping("/{opportunityId}/apply")
    @Operation(summary = "Apply or bookmark an opportunity in the student pipeline")
    public ResponseEntity<ApiResponse<String>> applyOrBookmark(
            @AuthenticationPrincipal User user,
            @PathVariable Long opportunityId,
            @RequestBody OpportunityDto.ApplyRequest request) {
        StudentProfile profile = profileService.getOrCreateProfile(user);
        Opportunity opp = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new AppException("Opportunity not found"));

        Application app = applicationRepository.findByStudentProfileIdAndOpportunityId(profile.getId(), opp.getId())
                .orElseGet(() -> Application.builder()
                        .studentProfile(profile)
                        .opportunity(opp)
                        .build());

        app.setStatus(request.getStatus() != null ? request.getStatus() : Application.ApplicationStatus.APPLIED);
        app.setNotes(request.getNotes());
        app.setAppliedAt(Instant.now());
        applicationRepository.save(app);

        auditLogService.logEvent(
                "OPPORTUNITY_STATUS_CHANGED",
                user.getId(),
                "Application",
                app.getId(),
                String.format("Updated status to %s for %s at %s", app.getStatus(), opp.getTitle(), opp.getCompany())
        );

        return ResponseEntity.ok(ApiResponse.ok("Application updated successfully", "Status: " + app.getStatus()));
    }
}
