package com.pathfinder.seed;

import com.pathfinder.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/demo")
@RequiredArgsConstructor
@Tag(name = "Demo & Research Scenario Runner", description = "Endpoints for executing the end-to-end 16-step closed loop scenario required by Section 43")
public class DemoScenarioController {

    private final DemoScenarioService demoScenarioService;

    @PostMapping("/run-scenario")
    @Operation(summary = "Execute the complete 16-step Opportunity Pathfinder closed-loop scenario and replay state evolution")
    public ResponseEntity<ApiResponse<List<DemoScenarioService.ScenarioStepLog>>> runFullScenario() {
        List<DemoScenarioService.ScenarioStepLog> logs = demoScenarioService.executeFullDemoScenario();
        return ResponseEntity.ok(ApiResponse.ok("16-step demonstration scenario executed successfully", logs));
    }
}
