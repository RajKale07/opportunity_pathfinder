package com.opportunitypathfinder.controller;

import com.opportunitypathfinder.model.User;
import com.opportunitypathfinder.model.UserProfile;
import com.opportunitypathfinder.repository.DocumentRepository;
import com.opportunitypathfinder.repository.SkillRepository;
import com.opportunitypathfinder.repository.UserProfileRepository;
import com.opportunitypathfinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final SkillRepository skillRepository;
    private final UserProfileRepository profileRepository;

    // Total doc types we expect
    private static final int TOTAL_DOC_TYPES = 8;

    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        int docCount  = documentRepository.findByUserId(user.getId()).size();
        int skillCount = skillRepository.findByUserId(user.getId()).size();

        // Use profile completeness if available, else fallback to doc/skill score
        int profileScore = profileRepository.findByUserId(user.getId())
                .map(p -> {
                    String[] vals = {
                        p.getFullName(), p.getPhone(), p.getDob(), p.getGender(),
                        p.getCity(), p.getState(), p.getCategory(), p.getAnnualIncome(),
                        p.getEmploymentStatus(), p.getTenthPercentage(), p.getTwelfthPercentage(),
                        p.getGraduationCgpa(), p.getGraduationDegree(), p.getGraduationBranch(),
                        p.getGraduationYear(), p.getExperience(), p.getGithubUrl(), p.getLinkedinUrl()
                    };
                    int filled = 0;
                    for (String v : vals) if (v != null && !v.isBlank()) filled++;
                    return Math.min(100, (int) Math.round((filled / 18.0) * 100));
                })
                .orElseGet(() -> {
                    int docScore   = (int) Math.min(50, (docCount  / (double) TOTAL_DOC_TYPES) * 50);
                    int skillScore = (int) Math.min(30, skillCount * 3);
                    return 20 + docScore + skillScore;
                });

        Map<String, Object> res = new HashMap<>();
        res.put("id",           user.getId());
        res.put("name",         user.getName());
        res.put("email",        user.getEmail());
        res.put("role",         user.getRole().name());
        res.put("docCount",     docCount);
        res.put("skillCount",   skillCount);
        res.put("profileScore", profileScore);
        res.put("joinedAt",     user.getCreatedAt().toString());
        return ResponseEntity.ok(res);
    }
}
