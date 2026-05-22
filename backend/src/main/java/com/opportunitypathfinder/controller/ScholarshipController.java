package com.opportunitypathfinder.controller;

import com.opportunitypathfinder.service.ScholarshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/scholarships")
@RequiredArgsConstructor
public class ScholarshipController {

    private final ScholarshipService scholarshipService;

    @GetMapping
    public ResponseEntity<?> getRecommendations(
            @RequestParam(defaultValue = "all") String filter) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(scholarshipService.getRecommendations(email, filter));
    }

    @GetMapping("/matched")
    public ResponseEntity<?> getMatchedCount() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            var scholarships = scholarshipService.getRecommendations(email, "eligible");
            int count = 0;
            if (scholarships instanceof List) {
                count = ((List<?>) scholarships).size();
            } else if (scholarships instanceof Map) {
                Map<?, ?> map = (Map<?, ?>) scholarships;
                if (map.containsKey("scholarships")) {
                    count = ((List<?>) map.get("scholarships")).size();
                }
            }
            return ResponseEntity.ok(Map.of("matched", count));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("matched", 0));
        }
    }
}
