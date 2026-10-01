package com.pathfinder.opportunity;

import com.pathfinder.auth.Role;
import com.pathfinder.auth.User;
import com.pathfinder.profile.ProfileService;
import com.pathfinder.profile.StudentProfile;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
public class ReadinessAssessmentTest {

    @Autowired
    private ReadinessAssessmentEngine readinessAssessmentEngine;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private com.pathfinder.auth.UserRepository userRepository;

    @Test
    @Transactional
    @DisplayName("Verify 10-dimensional radar assessment produces comprehensive dimension scores")
    void test10DimensionalReadinessEvaluation() {
        User user = userRepository.findByEmail("student@example.com").orElse(null);
        assertNotNull(user, "Seeded student should exist");

        StudentProfile profile = profileService.getOrCreateProfile(user);
        profile.setGpa(3.8);
        profile.setGithubUrl("https://github.com/testcadet");

        OpportunityDto.ReadinessProfileResponse response = readinessAssessmentEngine.evaluateReadinessProfile(user);

        assertNotNull(response);
        assertEquals(10, response.getDimensions().size(), "Must evaluate across exactly 10 dimensions");
        assertTrue(response.getOverallReadinessScore() >= 0.0 && response.getOverallReadinessScore() <= 100.0);
        assertNotNull(response.getSummaryNarrative());
    }
}
