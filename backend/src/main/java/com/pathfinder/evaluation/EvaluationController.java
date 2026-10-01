package com.pathfinder.evaluation;

import com.pathfinder.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/evaluation")
@RequiredArgsConstructor
@Tag(name = "Research & Evaluation Framework", description = "Endpoints for academic benchmarks, baseline comparisons, ablation studies, and dataset exports")
public class EvaluationController {

    private final EvaluationFrameworkService evaluationService;

    @GetMapping("/overview")
    @Operation(summary = "Get complete empirical research evaluation metrics and baseline comparisons")
    public ResponseEntity<ApiResponse<EvaluationDto.EvaluationOverview>> getOverview() {
        return ResponseEntity.ok(ApiResponse.ok(evaluationService.getEvaluationOverview()));
    }

    @GetMapping("/export/{datasetName}")
    @Operation(summary = "Export research dataset in CSV format (student_features, skill_progress, execution_history)")
    public ResponseEntity<String> exportCsv(@PathVariable String datasetName) {
        String csvContent = evaluationService.exportDatasetAsCsv(datasetName);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + datasetName + ".csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvContent);
    }
}
