package com.pathfinder.career;

import com.pathfinder.auth.User;
import com.pathfinder.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/careers")
@RequiredArgsConstructor
@Tag(name = "Career Intelligence", description = "Endpoints for career path catalogs, multi-factor recommendations, and transparent alignment scoring")
public class CareerController {

    private final CareerPathRepository careerPathRepository;
    private final CareerPathSkillRepository careerPathSkillRepository;
    private final CareerRecommendationEngine recommendationEngine;

    @GetMapping
    @Operation(summary = "Get all available career paths with required skill profiles")
    public ResponseEntity<ApiResponse<List<CareerDto.CareerPathSummary>>> getAllCareerPaths() {
        List<CareerDto.CareerPathSummary> list = careerPathRepository.findAll().stream()
                .map(path -> {
                    List<CareerPathSkill> skills = careerPathSkillRepository.findByCareerPathId(path.getId());
                    List<CareerDto.RequiredSkillSummary> skillSummaries = skills.stream()
                            .map(s -> CareerDto.RequiredSkillSummary.builder()
                                    .skillId(s.getSkill().getId())
                                    .skillName(s.getSkill().getName())
                                    .targetProficiency(s.getTargetProficiency())
                                    .weight(s.getWeight())
                                    .isCore(s.getIsCore())
                                    .build())
                            .collect(Collectors.toList());

                    return CareerDto.CareerPathSummary.builder()
                            .id(path.getId())
                            .title(path.getTitle())
                            .domain(path.getDomain())
                            .description(path.getDescription())
                            .avgSalaryRange(path.getAvgSalaryRange())
                            .growthOutlook(path.getGrowthOutlook())
                            .requiredSkills(skillSummaries)
                            .build();
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/recommendations")
    @Operation(summary = "Generate explainable career recommendations ranked by multi-factor alignment")
    public ResponseEntity<ApiResponse<List<CareerDto.CareerRecommendationResponse>>> getRecommendations(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(recommendationEngine.evaluateAllCareerPaths(user)));
    }
}
