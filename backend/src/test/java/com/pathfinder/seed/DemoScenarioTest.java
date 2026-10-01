package com.pathfinder.seed;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
public class DemoScenarioTest {

    @Autowired
    private DemoScenarioService demoScenarioService;

    @Test
    @Transactional
    @DisplayName("Verify full 16-step closed loop career intelligence scenario runs cleanly")
    void testExecuteFullDemoScenario() {
        List<DemoScenarioService.ScenarioStepLog> logs = demoScenarioService.executeFullDemoScenario();

        assertNotNull(logs, "Scenario logs should not be null");
        assertEquals(16, logs.size(), "Scenario must execute exactly 16 steps");

        // Verify Step 1
        assertEquals(1, logs.get(0).getStepNumber());
        assertTrue(logs.get(0).getActionTitle().contains("Profile Verified"));

        // Verify Step 7 & 8 (Failure analysis)
        assertEquals(7, logs.get(6).getStepNumber());
        assertTrue(logs.get(6).getActionTitle().contains("Assessment Failure"));

        // Verify Step 9 & 10 (Adaptive replanning)
        assertEquals(9, logs.get(8).getStepNumber());
        assertTrue(logs.get(8).getActionTitle().contains("Adaptive Replanning"));

        // Verify Step 16 (Explainable recommendation)
        assertEquals(16, logs.get(15).getStepNumber());
        assertTrue(logs.get(15).getActionTitle().contains("Explainable Recommendation"));
        assertNotNull(logs.get(15).getDetail());
        assertFalse(logs.get(15).getDetail().isEmpty());
    }
}
