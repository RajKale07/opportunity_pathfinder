package com.opportunitypathfinder.controller;

import com.opportunitypathfinder.service.SchemeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/schemes")
@RequiredArgsConstructor
public class SchemeController {

    private final SchemeService schemeService;

    @GetMapping
    public ResponseEntity<?> getSchemes(
            @RequestParam(defaultValue = "ALL") String category,
            @RequestParam(defaultValue = "all") String filter) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(schemeService.getSchemes(email, category, filter));
    }
}
