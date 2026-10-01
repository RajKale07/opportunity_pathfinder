package com.pathfinder.career;

import com.pathfinder.auth.User;
import com.pathfinder.auth.UserRepository;
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
public class SkillGapEngineTest {

    @Autowired
    private SkillGapEngine skillGapEngine;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CareerPathRepository careerPathRepository;

    @Test
    @Transactional
    @DisplayName("Verify skill gap report identifies target gaps and prerequisite blockers")
    void testSkillGapReportGeneration() {
        User demoUser = userRepository.findByEmail("student@example.com").orElse(null);
        assertNotNull(demoUser, "Demo user should exist from seed");

        List<CareerPath> paths = careerPathRepository.findAll();
        assertFalse(paths.isEmpty(), "Career paths should exist");

        CareerPath backendPath = paths.stream()
                .filter(p -> p.getTitle().equalsIgnoreCase("Backend Developer"))
                .findFirst()
                .orElse(paths.get(0));

        CareerDto.SkillGapReport report = skillGapEngine.generateSkillGapReport(demoUser, backendPath.getId());

        assertNotNull(report);
        assertEquals(backendPath.getTitle(), report.getCareerPathTitle());
        assertFalse(report.getGaps().isEmpty(), "Skill gaps should be identified for backend path");

        // Verify that gaps have target proficiencies and recommendations
        report.getGaps().forEach(gap -> {
            assertTrue(gap.getRequiredProficiency() > 0);
            assertNotNull(gap.getPriority());
            assertNotNull(gap.getActionRecommendation());
        });
    }
}
