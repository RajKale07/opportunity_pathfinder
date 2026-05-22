package com.opportunitypathfinder.controller;

import com.opportunitypathfinder.service.CareerRoadmapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/career")
@RequiredArgsConstructor
public class CareerRoadmapController {

    private final CareerRoadmapService careerRoadmapService;

    @GetMapping("/roadmap")
    public ResponseEntity<?> getRoadmap(
            @RequestParam(required = false) String role) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(careerRoadmapService.getRoadmap(email, role));
    }
}
