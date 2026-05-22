package com.opportunitypathfinder.controller;

import com.opportunitypathfinder.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "false") boolean remoteOnly,
            @RequestParam(defaultValue = "1") int page) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            return ResponseEntity.ok(jobService.searchJobs(email, query, location, type, remoteOnly, page));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/matched")
    public ResponseEntity<?> getMatchedCount() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            var results = jobService.searchJobs(email, null, null, null, false, 1);
            // Extract count from results
            int count = 0;
            if (results instanceof Map) {
                Map<?, ?> map = (Map<?, ?>) results;
                if (map.containsKey("total")) {
                    count = ((Number) map.get("total")).intValue();
                } else if (map.containsKey("jobs")) {
                    count = ((java.util.List<?>) map.get("jobs")).size();
                }
            }
            return ResponseEntity.ok(Map.of("matched", count));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("matched", 0));
        }
    }
}
