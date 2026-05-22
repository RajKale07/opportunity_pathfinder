package com.opportunitypathfinder.service;

import com.opportunitypathfinder.model.Document;
import com.opportunitypathfinder.model.UserProfile;
import com.opportunitypathfinder.repository.DocumentRepository;
import com.opportunitypathfinder.repository.SkillRepository;
import com.opportunitypathfinder.repository.UserProfileRepository;
import com.opportunitypathfinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final UserRepository userRepository;
    private final UserProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final DocumentRepository documentRepository;

    // ── Build Resume Data ──────────────────────────────────────────────────
    public Map<String, Object> buildResume(String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepository.findByUserId(user.getId()).orElse(null);
        List<String> skills = skillRepository.findByUserId(user.getId())
                .stream().map(s -> s.getSkillName()).collect(Collectors.toList());
        List<Document> docs = documentRepository.findByUserId(user.getId());

        // Build sections
        Map<String, Object> resume = new LinkedHashMap<>();

        // Personal
        Map<String, String> personal = new LinkedHashMap<>();
        personal.put("name",     profile != null && profile.getFullName() != null ? profile.getFullName() : user.getName());
        personal.put("email",    user.getEmail());
        personal.put("phone",    profile != null ? nvl(profile.getPhone()) : "");
        personal.put("location", profile != null ? join(profile.getCity(), profile.getState()) : "");
        personal.put("github",   profile != null ? nvl(profile.getGithubUrl()) : "");
        personal.put("linkedin", profile != null ? nvl(profile.getLinkedinUrl()) : "");
        resume.put("personal", personal);

        // Education
        List<Map<String, String>> education = new ArrayList<>();
        if (profile != null) {
            if (profile.getGraduationDegree() != null) {
                Map<String, String> grad = new LinkedHashMap<>();
                grad.put("degree",      profile.getGraduationDegree() + (profile.getGraduationBranch() != null ? " — " + profile.getGraduationBranch() : ""));
                grad.put("institution", extractInstitution(docs, "GRADUATION"));
                grad.put("year",        nvl(profile.getGraduationYear()));
                grad.put("score",       nvl(profile.getGraduationCgpa()));
                education.add(grad);
            }
            if (profile.getTwelfthPercentage() != null) {
                Map<String, String> twelfth = new LinkedHashMap<>();
                twelfth.put("degree",      "12th / Higher Secondary");
                twelfth.put("institution", extractInstitution(docs, "CLASS_12"));
                twelfth.put("year",        extractYear(docs, "CLASS_12"));
                twelfth.put("score",       profile.getTwelfthPercentage());
                education.add(twelfth);
            }
            if (profile.getTenthPercentage() != null) {
                Map<String, String> tenth = new LinkedHashMap<>();
                tenth.put("degree",      "10th / Secondary");
                tenth.put("institution", extractInstitution(docs, "CLASS_10"));
                tenth.put("year",        extractYear(docs, "CLASS_10"));
                tenth.put("score",       profile.getTenthPercentage());
                education.add(tenth);
            }
        }
        resume.put("education", education);

        // Experience
        List<Map<String, String>> experience = new ArrayList<>();
        if (profile != null && profile.getExperience() != null && !profile.getExperience().isBlank()) {
            Map<String, String> exp = new LinkedHashMap<>();
            String expText = profile.getExperience();
            exp.put("role",     extractRole(expText));
            exp.put("company",  extractCompany(expText));
            exp.put("duration", extractDuration(expText));
            exp.put("details",  expText);
            experience.add(exp);
        }
        // Also extract from RESUME doc
        docs.stream().filter(d -> "RESUME".equals(d.getDocType())).findFirst().ifPresent(d -> {
            String text = d.getExtractedText();
            if (text != null) {
                String role    = extractFieldFromText(text, "lastrole");
                String company = extractFieldFromText(text, "lastcompany");
                if (!role.isBlank() || !company.isBlank()) {
                    Map<String, String> exp = new LinkedHashMap<>();
                    exp.put("role",     role);
                    exp.put("company",  company);
                    exp.put("duration", "");
                    exp.put("details",  "");
                    if (experience.isEmpty()) experience.add(exp);
                }
            }
        });
        resume.put("experience", experience);

        // Skills
        resume.put("skills", skills);

        // Certifications from CERTIFICATE docs
        List<Map<String, String>> certs = new ArrayList<>();
        docs.stream().filter(d -> "CERTIFICATE".equals(d.getDocType())).forEach(d -> {
            Map<String, String> cert = new LinkedHashMap<>();
            String text = d.getExtractedText() != null ? d.getExtractedText() : "";
            cert.put("name",   extractFieldFromText(text, "name").isBlank() ? d.getFileName() : extractFieldFromText(text, "name"));
            cert.put("issuer", extractFieldFromText(text, "issuer"));
            cert.put("date",   extractFieldFromText(text, "date"));
            certs.add(cert);
        });
        resume.put("certifications", certs);

        // Projects from docs
        List<Map<String, String>> projects = new ArrayList<>();
        docs.stream().filter(d -> "RESUME".equals(d.getDocType())).findFirst().ifPresent(d -> {
            String text = d.getExtractedText() != null ? d.getExtractedText() : "";
            String proj = extractFieldFromText(text, "projects");
            if (!proj.isBlank()) {
                for (String p : proj.split(",")) {
                    if (!p.trim().isBlank()) {
                        Map<String, String> project = new LinkedHashMap<>();
                        project.put("name", p.trim());
                        project.put("description", "");
                        projects.add(project);
                    }
                }
            }
        });
        resume.put("projects", projects);

        // ATS Analysis
        resume.put("atsAnalysis", analyzeAts(resume, skills, profile));

        return resume;
    }

    // ── ATS Score Calculator ───────────────────────────────────────────────
    private Map<String, Object> analyzeAts(Map<String, Object> resume, List<String> skills, UserProfile profile) {
        int score = 0;
        List<String> suggestions = new ArrayList<>();
        List<Map<String, Object>> checks = new ArrayList<>();

        // Contact info (15pts)
        Map<String, String> personal = (Map<String, String>) resume.get("personal");
        boolean hasContact = !personal.get("email").isBlank() && !personal.get("phone").isBlank();
        score += hasContact ? 15 : 5;
        checks.add(check("Contact Information", hasContact, hasContact ? "Email and phone present" : "Add phone number to profile"));
        if (!hasContact) suggestions.add("Add your phone number to profile");

        // Skills section (20pts)
        boolean hasSkills = skills.size() >= 3;
        score += hasSkills ? 20 : (skills.size() * 4);
        checks.add(check("Skills Section", hasSkills, hasSkills ? skills.size() + " skills listed" : "Add more skills (min 3 recommended)"));
        if (!hasSkills) suggestions.add("Add at least 3 skills — upload your resume or certificates");

        // Education (20pts)
        List<?> education = (List<?>) resume.get("education");
        boolean hasEdu = !education.isEmpty();
        score += hasEdu ? 20 : 0;
        checks.add(check("Education Section", hasEdu, hasEdu ? education.size() + " education entries" : "Add education details to profile"));
        if (!hasEdu) suggestions.add("Add your education details in the Profile section");

        // Experience (20pts)
        List<?> experience = (List<?>) resume.get("experience");
        boolean hasExp = !experience.isEmpty();
        score += hasExp ? 20 : 8;
        checks.add(check("Experience Section", hasExp, hasExp ? "Work experience present" : "Add experience or mention 'Fresher' in profile"));
        if (!hasExp) suggestions.add("Add work experience or internship details to profile");

        // Certifications (10pts)
        List<?> certs = (List<?>) resume.get("certifications");
        boolean hasCerts = !certs.isEmpty();
        score += hasCerts ? 10 : 0;
        checks.add(check("Certifications", hasCerts, hasCerts ? certs.size() + " certifications" : "Add certificates to document vault"));
        if (!hasCerts) suggestions.add("Upload your certificates to the Document Vault");

        // Links (10pts)
        boolean hasLinks = !personal.get("github").isBlank() || !personal.get("linkedin").isBlank();
        score += hasLinks ? 10 : 0;
        checks.add(check("Professional Links", hasLinks, hasLinks ? "GitHub/LinkedIn present" : "Add GitHub or LinkedIn URL to profile"));
        if (!hasLinks) suggestions.add("Add your GitHub or LinkedIn URL to profile");

        // Location (5pts)
        boolean hasLocation = !personal.get("location").isBlank();
        score += hasLocation ? 5 : 0;
        checks.add(check("Location", hasLocation, hasLocation ? personal.get("location") : "Add city/state to profile"));
        if (!hasLocation) suggestions.add("Add your city and state to profile");

        score = Math.min(100, score);

        Map<String, Object> ats = new LinkedHashMap<>();
        ats.put("score",       score);
        ats.put("label",       atsLabel(score));
        ats.put("checks",      checks);
        ats.put("suggestions", suggestions);
        return ats;
    }

    private Map<String, Object> check(String name, boolean passed, String message) {
        Map<String, Object> c = new LinkedHashMap<>();
        c.put("name",    name);
        c.put("passed",  passed);
        c.put("message", message);
        return c;
    }

    private String atsLabel(int score) {
        if (score >= 80) return "Excellent";
        if (score >= 60) return "Good";
        if (score >= 40) return "Fair";
        return "Needs Work";
    }

    // ── Helpers ────────────────────────────────────────────────────────────
    private String nvl(String s) { return s != null ? s : ""; }

    private String join(String a, String b) {
        if (a == null && b == null) return "";
        if (a == null) return b;
        if (b == null) return a;
        return a + ", " + b;
    }

    private String extractInstitution(List<Document> docs, String type) {
        return docs.stream().filter(d -> type.equals(d.getDocType()))
                .findFirst().map(d -> {
                    String text = d.getExtractedText() != null ? d.getExtractedText() : "";
                    String val = extractFieldFromText(text, "university");
                    if (val.isBlank()) val = extractFieldFromText(text, "school");
                    return val;
                }).orElse("");
    }

    private String extractYear(List<Document> docs, String type) {
        return docs.stream().filter(d -> type.equals(d.getDocType()))
                .findFirst().map(d -> extractFieldFromText(
                        d.getExtractedText() != null ? d.getExtractedText() : "", "year"))
                .orElse("");
    }

    private String extractFieldFromText(String text, String key) {
        if (text == null) return "";
        for (String line : text.split("\n")) {
            if (line.toLowerCase().startsWith(key.toLowerCase() + ":")) {
                String val = line.substring(line.indexOf(':') + 1).trim();
                if (!val.isBlank()) return val;
            }
        }
        return "";
    }

    private String extractRole(String exp) {
        if (exp == null) return "";
        String lower = exp.toLowerCase();
        if (lower.contains("fresher")) return "Fresher";
        String[] parts = exp.split("\\s+as\\s+|\\s+at\\s+|,");
        return parts.length > 0 ? parts[0].trim() : exp;
    }

    private String extractCompany(String exp) {
        if (exp == null) return "";
        String[] parts = exp.split("\\s+at\\s+");
        return parts.length > 1 ? parts[1].split(",")[0].trim() : "";
    }

    private String extractDuration(String exp) {
        if (exp == null) return "";
        java.util.regex.Matcher m = java.util.regex.Pattern
                .compile("\\d+\\s*(year|month|yr)", java.util.regex.Pattern.CASE_INSENSITIVE)
                .matcher(exp);
        return m.find() ? m.group() : "";
    }
}
