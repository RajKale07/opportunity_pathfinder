package com.opportunitypathfinder.controller;

import com.opportunitypathfinder.service.SkillGapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillGapController {

    private final SkillGapService skillGapService;

    @GetMapping("/gap")
    public ResponseEntity<?> getSkillGap(
            @RequestParam(required = false) String role) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(skillGapService.getSkillGap(email, role));
    }
}
