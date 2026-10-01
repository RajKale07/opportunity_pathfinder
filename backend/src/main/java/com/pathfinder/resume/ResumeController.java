package com.pathfinder.resume;

import com.pathfinder.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
@Tag(name = "Resume & Portfolio Analyzer", description = "Endpoints for parsing resumes and project summaries to extract structured skill evidence")
public class ResumeController {

    private final ResumeAnalyzerService resumeAnalyzerService;

    @PostMapping("/analyze")
    @Operation(summary = "Analyze resume or project description text to extract verified skills, patterns, and missing keywords")
    public ResponseEntity<ApiResponse<ResumeDto.AnalysisResult>> analyzeResume(@RequestBody ResumeDto.AnalyzeRequest request) {
        ResumeDto.AnalysisResult result = resumeAnalyzerService.analyzeText(request.getText(), request.getTargetRole());
        return ResponseEntity.ok(ApiResponse.ok("Analysis complete", result));
    }
}
