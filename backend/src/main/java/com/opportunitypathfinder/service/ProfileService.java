package com.opportunitypathfinder.service;

import com.opportunitypathfinder.dto.ProfileDto.*;
import com.opportunitypathfinder.model.Document;
import com.opportunitypathfinder.model.User;
import com.opportunitypathfinder.model.UserProfile;
import com.opportunitypathfinder.repository.DocumentRepository;
import com.opportunitypathfinder.repository.UserProfileRepository;
import com.opportunitypathfinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;

    // Called after every document save to keep profile in sync
    public void syncFromDocuments(User user) {
        UserProfile profile = profileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    UserProfile p = new UserProfile();
                    p.setUser(user);
                    p.setFullName(user.getName());
                    return p;
                });

        List<Document> docs = documentRepository.findByUserId(user.getId());
        for (Document doc : docs) {
            String text = doc.getExtractedText();
            if (text == null || text.isBlank()) continue;
            String type = doc.getDocType();

            if ("CLASS_10".equals(type)) {
                if (blank(profile.getTenthPercentage()))
                    extractField(text, "percentage").ifPresent(profile::setTenthPercentage);
            }
            if ("CLASS_12".equals(type)) {
                if (blank(profile.getTwelfthPercentage()))
                    extractField(text, "percentage").ifPresent(profile::setTwelfthPercentage);
            }
            if ("GRADUATION".equals(type)) {
                if (blank(profile.getGraduationCgpa()))    extractField(text, "cgpa").ifPresent(profile::setGraduationCgpa);
                if (blank(profile.getGraduationDegree()))  extractField(text, "degree").ifPresent(profile::setGraduationDegree);
                if (blank(profile.getGraduationBranch()))  extractField(text, "branch").ifPresent(profile::setGraduationBranch);
                if (blank(profile.getGraduationYear()))    extractField(text, "year").ifPresent(profile::setGraduationYear);
            }
            if ("AADHAAR".equals(type)) {
                if (blank(profile.getDob()))    extractField(text, "dob").ifPresent(profile::setDob);
                if (blank(profile.getGender())) extractField(text, "gender").ifPresent(profile::setGender);
            }
            if ("INCOME".equals(type)) {
                if (blank(profile.getAnnualIncome())) extractField(text, "income").ifPresent(profile::setAnnualIncome);
                if (blank(profile.getCategory()))    extractField(text, "category").ifPresent(profile::setCategory);
            }
            if ("RESUME".equals(type)) {
                if (blank(profile.getExperience())) extractField(text, "experience").ifPresent(profile::setExperience);
                if (blank(profile.getGithubUrl()))  extractField(text, "github").ifPresent(profile::setGithubUrl);
            }
            if ("CERTIFICATE".equals(type)) {
                // certificates don't map to profile fields directly, skills are handled separately
            }
        }

        profile.setUpdatedAt(LocalDateTime.now());
        profileRepository.save(profile);
    }

    private boolean blank(String v) { return v == null || v.isBlank(); }

    public ProfileResponse getProfile(String email) {
        User user = getUser(email);
        // Always sync from latest documents before returning
        syncFromDocuments(user);
        UserProfile profile = profileRepository.findByUserId(user.getId()).orElseThrow();
        return toResponse(profile);
    }

    public ProfileResponse updateProfile(String email, ProfileRequest req) {
        User user = getUser(email);
        UserProfile profile = profileRepository.findByUserId(user.getId())
                .orElseGet(() -> { UserProfile p = new UserProfile(); p.setUser(user); return p; });

        profile.setFullName(req.getFullName());
        profile.setPhone(req.getPhone());
        profile.setDob(req.getDob());
        profile.setGender(req.getGender());
        profile.setCity(req.getCity());
        profile.setState(req.getState());
        profile.setCategory(req.getCategory());
        profile.setAnnualIncome(req.getAnnualIncome());
        profile.setEmploymentStatus(req.getEmploymentStatus());
        profile.setTenthPercentage(req.getTenthPercentage());
        profile.setTwelfthPercentage(req.getTwelfthPercentage());
        profile.setGraduationCgpa(req.getGraduationCgpa());
        profile.setGraduationDegree(req.getGraduationDegree());
        profile.setGraduationBranch(req.getGraduationBranch());
        profile.setGraduationYear(req.getGraduationYear());
        profile.setExperience(req.getExperience());
        profile.setGithubUrl(req.getGithubUrl());
        profile.setLinkedinUrl(req.getLinkedinUrl());
        profile.setUpdatedAt(LocalDateTime.now());

        profileRepository.save(profile);
        return toResponse(profile);
    }


    // Parse "key: value" lines from OCR-extracted text
    private java.util.Optional<String> extractField(String text, String key) {
        for (String line : text.split("\n")) {
            String lower = line.toLowerCase();
            if (lower.startsWith(key + ":")) {
                String val = line.substring(line.indexOf(':') + 1).trim();
                if (!val.isBlank()) return java.util.Optional.of(val);
            }
        }
        return java.util.Optional.empty();
    }

    private ProfileResponse toResponse(UserProfile p) {
        ProfileResponse r = new ProfileResponse();
        r.setId(p.getId());
        r.setFullName(p.getFullName());
        r.setPhone(p.getPhone());
        r.setDob(p.getDob());
        r.setGender(p.getGender());
        r.setCity(p.getCity());
        r.setState(p.getState());
        r.setCategory(p.getCategory());
        r.setAnnualIncome(p.getAnnualIncome());
        r.setEmploymentStatus(p.getEmploymentStatus());
        r.setTenthPercentage(p.getTenthPercentage());
        r.setTwelfthPercentage(p.getTwelfthPercentage());
        r.setGraduationCgpa(p.getGraduationCgpa());
        r.setGraduationDegree(p.getGraduationDegree());
        r.setGraduationBranch(p.getGraduationBranch());
        r.setGraduationYear(p.getGraduationYear());
        r.setExperience(p.getExperience());
        r.setGithubUrl(p.getGithubUrl());
        r.setLinkedinUrl(p.getLinkedinUrl());
        r.setCompleteness(calcCompleteness(p));
        return r;
    }

    private int calcCompleteness(UserProfile p) {
        // 18 fields, each worth ~5 points, capped at 100
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
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
