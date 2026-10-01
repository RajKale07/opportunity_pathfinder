package com.pathfinder.opportunity;

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
public class OpportunityMatchingTest {

    @Autowired
    private OpportunityMatchingEngine opportunityMatchingEngine;

    @Autowired
    private UserRepository userRepository;

    @Test
    @Transactional
    @DisplayName("Verify match score and readiness score are evaluated and separated")
    void testMatchVsReadinessDistinction() {
        User demoUser = userRepository.findByEmail("student@example.com").orElse(null);
        assertNotNull(demoUser, "Demo user should exist from seed");

        List<OpportunityDto.OpportunityResponse> matches = opportunityMatchingEngine.matchOpportunities(demoUser);

        assertNotNull(matches);
        assertFalse(matches.isEmpty(), "Matches should be computed for student");

        OpportunityDto.OpportunityResponse top = matches.get(0);
        assertNotNull(top.getMatchPercentage(), "Match percentage must be present");
        assertNotNull(top.getReadinessPercentage(), "Readiness percentage must be present");
        assertNotNull(top.getWhyMatchedExplanation(), "Why matched explanation must be generated");
        assertNotNull(top.getReadinessExplanation(), "Readiness explanation must be generated");

        assertTrue(top.getMatchPercentage() >= 0 && top.getMatchPercentage() <= 100);
        assertTrue(top.getReadinessPercentage() >= 0 && top.getReadinessPercentage() <= 100);
    }
}
