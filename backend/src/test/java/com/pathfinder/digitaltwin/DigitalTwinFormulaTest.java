package com.pathfinder.digitaltwin;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class DigitalTwinFormulaTest {

    @Test
    @DisplayName("Verify composite readiness formula calculation")
    void testCompositeReadinessCalculation() {
        DigitalTwinFeatureVector features = DigitalTwinFeatureVector.builder()
                .skillProficiency(80.0)
                .projectCount(3)
                .problemSolvingScore(70.0)
                .consistencyScore(85.0)
                .interviewScore(65.0)
                .academicScore(75.0)
                .build();

        // Formula: 0.30*Skill + 0.20*Project + 0.15*ProblemSolving + 0.15*Consistency + 0.10*Interview + 0.10*Academic
        // Skill: 0.30 * 80 = 24.0
        // Project: 0.20 * min(100, 3*25) = 0.20 * 75 = 15.0
        // Problem Solving: 0.15 * 70 = 10.5
        // Consistency: 0.15 * 85 = 12.75
        // Interview: 0.10 * 65 = 6.5
        // Academic: 0.10 * 75 = 7.5
        // Total expected = 24 + 15 + 10.5 + 12.75 + 6.5 + 7.5 = 76.25 -> rounded to 76.3

        double expected = 76.3;
        DigitalTwinEngine engine = new DigitalTwinEngine(null, null, null, null, null, null);
        double actual = engine.calculateCompositeReadiness(features);

        assertEquals(expected, actual, 0.1, "Readiness score must strictly match documented mathematical formula");
    }
}
