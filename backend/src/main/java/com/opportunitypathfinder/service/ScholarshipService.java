package com.opportunitypathfinder.service;

import com.opportunitypathfinder.model.Scholarship;
import com.opportunitypathfinder.model.UserProfile;
import com.opportunitypathfinder.repository.ScholarshipRepository;
import com.opportunitypathfinder.repository.UserProfileRepository;
import com.opportunitypathfinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScholarshipService {

    private static final Logger log = Logger.getLogger(ScholarshipService.class.getName());

    private final ScholarshipRepository scholarshipRepository;
    private final UserProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    public Map<String, Object> getRecommendations(String email, String filter) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepository.findByUserId(user.getId()).orElse(null);

        // Seeded scholarships
        List<Scholarship> seeded = scholarshipRepository.findByActiveTrue();

        // Live scholarships from MyScheme API
        List<Scholarship> live = fetchLiveScholarships(profile);

        // Merge — avoid duplicates by name
        Set<String> seededNames = seeded.stream().map(Scholarship::getName).collect(Collectors.toSet());
        List<Scholarship> all = new ArrayList<>(seeded);
        live.stream().filter(s -> !seededNames.contains(s.getName())).forEach(all::add);

        List<Map<String, Object>> results = all.stream()
                .map(s -> evaluate(s, profile))
                .filter(r -> {
                    if ("eligible".equals(filter)) return (boolean) r.get("eligible");
                    if ("high".equals(filter)) return (int) r.get("approvalProbability") >= 70;
                    return true;
                })
                .sorted((a, b) -> Integer.compare(
                        (int) b.get("approvalProbability"),
                        (int) a.get("approvalProbability")))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("scholarships", results);
        response.put("total", results.size());
        response.put("profileComplete", profile != null);
        response.put("profileSummary", buildProfileSummary(profile));
        return response;
    }

    // ── MyScheme API — live government scholarships ────────────────────────
    @SuppressWarnings("unchecked")
    private List<Scholarship> fetchLiveScholarships(UserProfile profile) {
        try {
            UriComponentsBuilder builder = UriComponentsBuilder
                    .fromHttpUrl("https://api.myscheme.gov.in/search/v4/schemes")
                    .queryParam("lang", "en")
                    .queryParam("q", "scholarship")
                    .queryParam("from", "0")
                    .queryParam("size", "30");

            // Filter by state if available
            if (profile != null && profile.getState() != null && !profile.getState().isBlank())
                builder.queryParam("state", profile.getState());

            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/json");
            headers.set("User-Agent", "OpportunityPathfinder/1.0");

            ResponseEntity<Map> response = restTemplate.exchange(
                    builder.build(false).toUriString(),
                    HttpMethod.GET, new HttpEntity<>(headers), Map.class);

            if (response.getBody() == null) return Collections.emptyList();

            // Navigate: data -> hits -> hits[]
            Object dataObj = response.getBody().get("data");
            if (!(dataObj instanceof Map)) return Collections.emptyList();
            Object hitsObj = ((Map<?, ?>) dataObj).get("hits");
            if (!(hitsObj instanceof Map)) return Collections.emptyList();
            Object hitsArr = ((Map<?, ?>) hitsObj).get("hits");
            if (!(hitsArr instanceof List)) return Collections.emptyList();

            List<Scholarship> result = new ArrayList<>();
            for (Map<String, Object> hit : (List<Map<String, Object>>) hitsArr) {
                try {
                    Map<String, Object> src = (Map<String, Object>) hit.get("_source");
                    if (src == null) continue;

                    String schemeName = safeStr(src, "schemeName");
                    if (schemeName.isBlank()) continue;

                    // Only include scholarship-type schemes
                    String tags = safeStr(src, "tags").toLowerCase();
                    String desc = safeStr(src, "briefDescription").toLowerCase();
                    if (!tags.contains("scholarship") && !desc.contains("scholarship")
                            && !schemeName.toLowerCase().contains("scholarship")) continue;

                    Scholarship s = new Scholarship();
                    s.setName(schemeName);
                    s.setProvider(safeStr(src, "nodalMinistryName"));
                    s.setCategory("CENTRAL");
                    s.setDescription(safeStr(src, "briefDescription"));
                    s.setAmount(safeStr(src, "benefitTypes"));
                    s.setApplyUrl("https://www.myscheme.gov.in/schemes/" + safeStr(src, "schemeId"));
                    s.setDeadline("Check portal");
                    s.setRequiredDocuments("Aadhaar,Income Certificate,Marksheet,Bank Passbook");

                    // Parse target group from tags/description
                    s.setTargetGroup(parseTargetGroup(tags + " " + desc));
                    s.setGenderRequired(parseGender(tags + " " + desc));
                    s.setEligibilityDegree("ANY");
                    s.setMinMarksPercent(0.0);
                    s.setMaxAnnualIncome(parseIncomeCeiling(desc));
                    s.setStateSpecific(safeStr(src, "state"));
                    s.setActive(true);
                    result.add(s);
                } catch (Exception ignored) {}
            }
            log.info("MyScheme returned " + result.size() + " live scholarships");
            return result;

        } catch (Exception e) {
            log.warning("MyScheme API failed: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    private String parseTargetGroup(String text) {
        if (text.contains(" sc ") || text.contains("scheduled caste")) return "SC";
        if (text.contains(" st ") || text.contains("scheduled tribe")) return "ST";
        if (text.contains("obc") || text.contains("other backward")) return "OBC";
        if (text.contains("ews") || text.contains("economically weaker")) return "EWS";
        if (text.contains("minority")) return "MINORITY";
        if (text.contains("disabled") || text.contains("differently abled")) return "DISABLED";
        return "ALL";
    }

    private String parseGender(String text) {
        if (text.contains("girl") || text.contains("women") || text.contains("female")) return "FEMALE";
        return "ANY";
    }

    private double parseIncomeCeiling(String desc) {
        // Look for patterns like "2.5 lakh", "250000", "8 lakh"
        try {
            java.util.regex.Matcher m = java.util.regex.Pattern
                    .compile("(\\d+(?:\\.\\d+)?)\\s*lakh", java.util.regex.Pattern.CASE_INSENSITIVE)
                    .matcher(desc);
            if (m.find()) return Double.parseDouble(m.group(1)) * 100000;
        } catch (Exception ignored) {}
        return 0;
    }

    private String safeStr(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v != null ? v.toString() : "";
    }

    // ── Eligibility Engine ─────────────────────────────────────────────────
    private Map<String, Object> evaluate(Scholarship s, UserProfile profile) {
        Map<String, Object> result = new HashMap<>();
        result.put("id",          s.getId());
        result.put("name",        s.getName());
        result.put("provider",    s.getProvider());
        result.put("category",    s.getCategory());
        result.put("targetGroup", s.getTargetGroup());
        result.put("description", s.getDescription());
        result.put("amount",      s.getAmount());
        result.put("deadline",    s.getDeadline());
        result.put("applyUrl",    s.getApplyUrl());
        result.put("requiredDocuments", s.getRequiredDocuments() != null
                ? Arrays.asList(s.getRequiredDocuments().split(",")) : List.of());

        List<String> reasons = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        int score = 0, maxScore = 0;

        if (profile == null) {
            result.put("eligible", false);
            result.put("approvalProbability", 0);
            result.put("matchReasons", List.of());
            result.put("missingCriteria", List.of("Complete your profile to check eligibility"));
            return result;
        }

        // Category (30pts)
        maxScore += 30;
        String userCategory = profile.getCategory() != null ? profile.getCategory().toUpperCase() : "";
        String target = s.getTargetGroup().toUpperCase();
        if ("ALL".equals(target)) {
            score += 30; reasons.add("Open to all categories");
        } else if (target.equals(userCategory)) {
            score += 30; reasons.add("Category match: " + profile.getCategory());
        } else if ("EWS".equals(target) && ("GENERAL".equals(userCategory) || "EWS".equals(userCategory))) {
            score += 30; reasons.add("EWS category eligible");
        } else if ("MINORITY".equals(target)) {
            score += 15; missing.add("Minority community certificate required");
        } else if ("DISABLED".equals(target)) {
            score += 10; missing.add("Disability certificate required");
        } else {
            missing.add("Category required: " + s.getTargetGroup());
        }

        // Gender (15pts)
        maxScore += 15;
        String reqGender = s.getGenderRequired() != null ? s.getGenderRequired().toUpperCase() : "ANY";
        String userGender = profile.getGender() != null ? profile.getGender().toUpperCase() : "";
        if ("ANY".equals(reqGender)) {
            score += 15;
        } else if (reqGender.equals(userGender) || userGender.startsWith(reqGender)) {
            score += 15; reasons.add("Gender eligible: " + profile.getGender());
        } else if (userGender.isBlank()) {
            score += 8; missing.add("Add gender to profile");
        } else {
            missing.add("This scholarship is for " + s.getGenderRequired() + " only");
        }

        // Marks (25pts)
        maxScore += 25;
        double userMarks = extractMarks(profile);
        double minMarks = s.getMinMarksPercent() != null ? s.getMinMarksPercent() : 0;
        if (minMarks == 0) {
            score += 25; reasons.add("No minimum marks required");
        } else if (userMarks > 0) {
            if (userMarks >= minMarks) {
                score += 25; reasons.add("Marks eligible: " + (int) userMarks + "% ≥ " + (int) minMarks + "%");
            } else {
                score += (int) ((userMarks / minMarks) * 15);
                missing.add("Marks below required: " + (int) userMarks + "% < " + (int) minMarks + "%");
            }
        } else {
            score += 10; missing.add("Add your marks/percentage to profile");
        }

        // Income (20pts)
        maxScore += 20;
        double maxIncome = s.getMaxAnnualIncome() != null ? s.getMaxAnnualIncome() : 0;
        if (maxIncome == 0) {
            score += 20; reasons.add("No income restriction");
        } else {
            double userIncome = extractIncome(profile);
            if (userIncome > 0) {
                if (userIncome <= maxIncome) {
                    score += 20; reasons.add("Income eligible: ₹" + formatIncome(userIncome) + " ≤ ₹" + formatIncome(maxIncome));
                } else {
                    missing.add("Income exceeds limit: ₹" + formatIncome(userIncome) + " > ₹" + formatIncome(maxIncome));
                }
            } else {
                score += 8; missing.add("Add annual income to profile");
            }
        }

        // State (10pts)
        maxScore += 10;
        String stateReq = s.getStateSpecific();
        if (stateReq == null || stateReq.isBlank()) {
            score += 10;
        } else if (profile.getState() != null && profile.getState().equalsIgnoreCase(stateReq)) {
            score += 10; reasons.add("State eligible: " + profile.getState());
        } else if (profile.getState() == null || profile.getState().isBlank()) {
            score += 4; missing.add("Add your state — this scholarship is for " + stateReq + " residents");
        } else {
            missing.add("State restricted to " + stateReq);
        }

        int probability = maxScore > 0 ? Math.min(98, (int) Math.round((score / (double) maxScore) * 100)) : 0;
        boolean eligible = probability >= 50 && missing.stream().noneMatch(m ->
                m.contains("Category required") || m.contains("only") || m.contains("restricted to") || m.contains("exceeds"));

        result.put("eligible",            eligible);
        result.put("approvalProbability", probability);
        result.put("matchReasons",        reasons);
        result.put("missingCriteria",     missing);
        return result;
    }

    private double extractMarks(UserProfile p) {
        if (p.getGraduationCgpa() != null && !p.getGraduationCgpa().isBlank()) {
            try {
                double val = Double.parseDouble(p.getGraduationCgpa().replaceAll("[^0-9.]", ""));
                return val <= 10 ? val * 9.5 : val;
            } catch (NumberFormatException ignored) {}
        }
        if (p.getTwelfthPercentage() != null && !p.getTwelfthPercentage().isBlank()) {
            try { return Double.parseDouble(p.getTwelfthPercentage().replaceAll("[^0-9.]", "")); }
            catch (NumberFormatException ignored) {}
        }
        if (p.getTenthPercentage() != null && !p.getTenthPercentage().isBlank()) {
            try { return Double.parseDouble(p.getTenthPercentage().replaceAll("[^0-9.]", "")); }
            catch (NumberFormatException ignored) {}
        }
        return 0;
    }

    private double extractIncome(UserProfile p) {
        if (p.getAnnualIncome() == null || p.getAnnualIncome().isBlank()) return 0;
        try {
            String raw = p.getAnnualIncome().replaceAll("[^0-9]", "");
            return raw.isBlank() ? 0 : Double.parseDouble(raw);
        } catch (NumberFormatException e) { return 0; }
    }

    private String formatIncome(double income) {
        if (income >= 100000) return String.format("%.1fL", income / 100000);
        return String.format("%.0f", income);
    }

    private Map<String, String> buildProfileSummary(UserProfile p) {
        Map<String, String> s = new HashMap<>();
        if (p == null) return s;
        s.put("category", p.getCategory() != null ? p.getCategory() : "Not set");
        s.put("gender",   p.getGender()   != null ? p.getGender()   : "Not set");
        s.put("state",    p.getState()    != null ? p.getState()    : "Not set");
        s.put("income",   p.getAnnualIncome() != null ? p.getAnnualIncome() : "Not set");
        s.put("marks",    bestMarks(p));
        return s;
    }

    private String bestMarks(UserProfile p) {
        if (p.getGraduationCgpa()     != null && !p.getGraduationCgpa().isBlank())     return p.getGraduationCgpa();
        if (p.getTwelfthPercentage()  != null && !p.getTwelfthPercentage().isBlank())  return p.getTwelfthPercentage();
        if (p.getTenthPercentage()    != null && !p.getTenthPercentage().isBlank())    return p.getTenthPercentage();
        return "Not set";
    }
}
