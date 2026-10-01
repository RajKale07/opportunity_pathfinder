package com.pathfinder.interview;

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
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
@Tag(name = "Mock Interviews & Assessments", description = "Endpoints for practicing technical questions, evaluating responses, and auto-detecting weaknesses")
public class InterviewController {

    private final InterviewService interviewService;

    @GetMapping("/questions")
    @Operation(summary = "Get interview question bank categorized by technical and behavioral disciplines")
    public ResponseEntity<ApiResponse<List<InterviewDto.QuestionResponse>>> getQuestions() {
        return ResponseEntity.ok(ApiResponse.ok(interviewService.getAllQuestions()));
    }

    @PostMapping("/submit")
    @Operation(summary = "Submit answer for evaluation, scoring, and closed-loop weakness diagnosis")
    public ResponseEntity<ApiResponse<InterviewDto.AssessmentResult>> submitAnswer(
            @AuthenticationPrincipal User user,
            @RequestBody InterviewDto.SubmitAnswerRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Evaluation complete", interviewService.evaluateAnswer(user, request)));
    }

    @GetMapping("/history")
    @Operation(summary = "Get current student's interview assessment history")
    public ResponseEntity<ApiResponse<List<InterviewDto.AssessmentResult>>> getHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(interviewService.getPastAssessments(user)));
    }
}
