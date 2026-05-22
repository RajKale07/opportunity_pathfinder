package com.opportunitypathfinder.controller;

import com.opportunitypathfinder.dto.ProfileDto.*;
import com.opportunitypathfinder.model.Skill;
import com.opportunitypathfinder.model.User;
import com.opportunitypathfinder.repository.SkillRepository;
import com.opportunitypathfinder.repository.UserRepository;
import com.opportunitypathfinder.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(profileService.getProfile(email));
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(@RequestBody ProfileRequest req) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(profileService.updateProfile(email, req));
    }

    @GetMapping("/skills")
    public ResponseEntity<?> getSkills() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        List<Map<String, Object>> skills = skillRepository.findByUserId(user.getId()).stream()
                .map(s -> Map.<String, Object>of("id", s.getId(), "name", s.getSkillName(), "source", s.getSource()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(skills);
    }

    @PostMapping("/skills")
    public ResponseEntity<?> addSkill(@RequestBody Map<String, String> body) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        String skillName = body.get("name").trim();
        if (skillName.isBlank()) return ResponseEntity.badRequest().body(Map.of("message", "Skill name required"));
        boolean exists = skillRepository.existsByUserIdAndSkillName(user.getId(), skillName);
        if (exists) return ResponseEntity.badRequest().body(Map.of("message", "Skill already exists"));
        Skill skill = new Skill();
        skill.setUser(user);
        skill.setSkillName(skillName);
        skill.setSource("MANUAL");
        skillRepository.save(skill);
        return ResponseEntity.ok(Map.of("id", skill.getId(), "name", skill.getSkillName(), "source", skill.getSource()));
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<?> deleteSkill(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        skillRepository.findById(id).ifPresent(s -> {
            if (s.getUser().getId().equals(user.getId())) skillRepository.delete(s);
        });
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }
}
