package com.opportunitypathfinder.service;

import com.opportunitypathfinder.model.Scheme;
import com.opportunitypathfinder.model.UserProfile;
import com.opportunitypathfinder.repository.SchemeRepository;
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
public class SchemeService {

    private static final Logger log = Logger.getLogger(SchemeService.class.getName());

    private final SchemeRepository schemeRepository;
    private final UserProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    public Map<String, Object> getSchemes(String email, String category, String filter) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepository.findByUserId(user.getId()).orElse(null);

        // Seeded schemes
        List<Scheme> seeded = schemeRepository.findByActiveTrue();

        // Live schemes from MyScheme API
        List<Scheme> live = fetchLiveSchemes(profile, category);

        // Merge — avoid duplicates by name
        Set<String> seededNames = seeded.stream().map(Scheme::getName).collect(Collectors.toSet());
        List<Scheme> all = new ArrayList<>(seeded);
        live.stream().filter(s -> !seededNames.contains(s.getName())).forEach(all::add);

        // Filter by category
        if (category != null && !category.isBlank() && !"ALL".equals(category)) {
            all = all.stream()
                    .filter(s -> category.equalsIgnoreCase(s.getSchemeCategory()))
                    .collect(Collectors.toList());
        }

        List<Map<String, Object>> results = all.stream()
                .map(s -> evaluate(s, profile))
                .filter(r -> {
                    if ("eligible".equals(filter)) return (boolean) r.get("eligible");
                    if ("high".equals(filter))     return (int) r.get("matchScore") >= 70;
                    return true;
                })
                .sorted((a, b) -> Integer.compare(
                        (int) b.get("matchScore"), (int) a.get("matchScore")))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("schemes", results);
        response.put("total", results.size());
        response.put("profileComplete", profile != null);
        response.put("profileSummary", buildProfileSummary(profile));
        return response;
    }

    // ── MyScheme API ───────────────────────────────────────────────────────
    @SuppressWarnings("unchecked")
    private List<Scheme> fetchLiveSchemes(UserProfile profile, String category) {
        try {
            String query = (category != null && !category.isBlank() && !"ALL".equals(category))
                    ? category.toLowerCase() : "government scheme";

            UriComponentsBuilder builder = UriComponentsBuilder
                    .fromHttpUrl("https://api.myscheme.gov.in/search/v4/schemes")
                    .queryParam("lang", "en")
                    .queryParam("q", query)
                    .queryParam("from", "0")
                    .queryParam("size", "40");

            if (profile != null && profile.getState() != null && !profile.getState().isBlank())
                builder.queryParam("state", profile.getState());

            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/json");
            headers.set("User-Agent", "OpportunityPathfinder/1.0");

            ResponseEntity<Map> response = restTemplate.exchange(
                    builder.build(false).toUriString(),
                    HttpMethod.GET, new HttpEntity<>(headers), Map.class);

            if (response.getBody() == null) return Collections.emptyList();

            Object dataObj = response.getBody().get("data");
            if (!(dataObj instanceof Map)) return Collections.emptyList();
            Object hitsObj = ((Map<?, ?>) dataObj).get("hits");
            if (!(hitsObj instanceof Map)) return Collections.emptyList();
            Object hitsArr = ((Map<?, ?>) hitsObj).get("hits");
            if (!(hitsArr instanceof List)) return Collections.emptyList();

            List<Scheme> result = new ArrayList<>();
            for (Map<String, Object> hit : (List<Map<String, Object>>) hitsArr) {
                try {
                    Map<String, Object> src = (Map<String, Object>) hit.get("_source");
                    if (src == null) continue;
                    String name = safeStr(src, "schemeName");
                    if (name.isBlank()) continue;

                    Scheme s = new Scheme();
                    s.setName(name);
                    s.setMinistry(safeStr(src, "nodalMinistryName"));
                    s.setSchemeCategory(mapCategory(safeStr(src, "tags") + " " + safeStr(src, "briefDescription")));
                    s.setDescription(safeStr(src, "briefDescription"));
                    s.setBenefits(safeStr(src, "benefitTypes"));
                    s.setApplyUrl("https://www.myscheme.gov.in/schemes/" + safeStr(src, "schemeId"));
                    s.setApplyMode("ONLINE");
                    s.setRequiredDocuments("Aadhaar,Bank Passbook,Income Certificate");
                    s.setTargetGroup(parseTargetGroup(safeStr(src, "tags") + " " + safeStr(src, "briefDescription")));
                    s.setGenderRequired(parseGender(safeStr(src, "tags") + " " + safeStr(src, "briefDescription")));
                    s.setMaxAnnualIncome(parseIncomeCeiling(safeStr(src, "briefDescription")));
                    s.setMinAge(0);
                    s.setMaxAge(100);
                    s.setEmploymentStatus("ANY");
                    s.setStateSpecific(safeStr(src, "state"));
                    s.setActive(true);
                    result.add(s);
                } catch (Exception ignored) {}
            }
            log.info("MyScheme returned " + result.size() + " live schemes");
            return result;
        } catch (Exception e) {
            log.warning("MyScheme API failed: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    // ── Eligibility Engine ─────────────────────────────────────────────────
    private Map<String, Object> evaluate(Scheme s, UserProfile profile) {
        Map<String, Object> result = new HashMap<>();
        result.put("id",             s.getId());
        result.put("name",           s.getName());
        result.put("ministry",       s.getMinistry());
        result.put("category",       s.getSchemeCategory());
        result.put("description",    s.getDescription());
        result.put("benefits",       s.getBenefits());
        result.put("targetGroup",    s.getTargetGroup());
        result.put("applyUrl",       s.getApplyUrl());
        result.put("applyMode",      s.getApplyMode());
        result.put("requiredDocuments", s.getRequiredDocuments() != null
                ? Arrays.asList(s.getRequiredDocuments().split(",")) : List.of());

        if (profile == null) {
            result.put("eligible", false);
            result.put("matchScore", 0);
            result.put("matchReasons", List.of());
            result.put("missingCriteria", List.of("Complete your profile to check eligibility"));
            return result;
        }

        List<String> reasons = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        int score = 0, maxScore = 0;

        // Target group (30pts)
        maxScore += 30;
        String userCat = profile.getCategory() != null ? profile.getCategory().toUpperCase() : "";
        String target  = s.getTargetGroup().toUpperCase();
        if ("ALL".equals(target)) {
            score += 30; reasons.add("Open to everyone");
        } else if (target.equals(userCat)) {
            score += 30; reasons.add("Category eligible: " + profile.getCategory());
        } else if ("EWS".equals(target) && ("GENERAL".equals(userCat) || "EWS".equals(userCat))) {
            score += 30; reasons.add("EWS eligible");
        } else if ("FARMER".equals(target)) {
            if ("FARMER".equalsIgnoreCase(profile.getEmploymentStatus())) { score += 30; reasons.add("Farmer eligible"); }
            else missing.add("This scheme is for farmers only");
        } else if ("YOUTH".equals(target)) {
            score += 20; reasons.add("Youth scheme");
        } else if ("WOMAN".equals(target)) {
            if ("FEMALE".equalsIgnoreCase(profile.getGender())) { score += 30; reasons.add("Women eligible"); }
            else missing.add("This scheme is for women only");
        } else {
            missing.add("Target group required: " + s.getTargetGroup());
        }

        // Gender (10pts)
        maxScore += 10;
        String reqG = s.getGenderRequired() != null ? s.getGenderRequired().toUpperCase() : "ANY";
        String userG = profile.getGender() != null ? profile.getGender().toUpperCase() : "";
        if ("ANY".equals(reqG)) {
            score += 10;
        } else if (reqG.equals(userG) || userG.startsWith(reqG)) {
            score += 10; reasons.add("Gender eligible");
        } else if (userG.isBlank()) {
            score += 5; missing.add("Add gender to profile");
        } else {
            missing.add("Scheme is for " + s.getGenderRequired() + " only");
        }

        // Income (25pts)
        maxScore += 25;
        double maxInc = s.getMaxAnnualIncome() != null ? s.getMaxAnnualIncome() : 0;
        if (maxInc == 0) {
            score += 25; reasons.add("No income restriction");
        } else {
            double userInc = extractIncome(profile);
            if (userInc > 0) {
                if (userInc <= maxInc) {
                    score += 25; reasons.add("Income eligible: ₹" + fmt(userInc) + " ≤ ₹" + fmt(maxInc));
                } else {
                    missing.add("Income exceeds limit: ₹" + fmt(userInc) + " > ₹" + fmt(maxInc));
                }
            } else {
                score += 10; missing.add("Add annual income to profile");
            }
        }

        // Employment status (20pts)
        maxScore += 20;
        String reqEmp  = s.getEmploymentStatus() != null ? s.getEmploymentStatus().toUpperCase() : "ANY";
        String userEmp = profile.getEmploymentStatus() != null ? profile.getEmploymentStatus().toUpperCase() : "";
        if ("ANY".equals(reqEmp)) {
            score += 20;
        } else if (reqEmp.equals(userEmp) || userEmp.contains(reqEmp)) {
            score += 20; reasons.add("Employment status eligible: " + profile.getEmploymentStatus());
        } else if (userEmp.isBlank()) {
            score += 8; missing.add("Add employment status to profile");
        } else {
            score += 5; missing.add("Scheme targets " + s.getEmploymentStatus() + " individuals");
        }

        // State (15pts)
        maxScore += 15;
        String stateReq = s.getStateSpecific();
        if (stateReq == null || stateReq.isBlank()) {
            score += 15; reasons.add("Available across India");
        } else if (profile.getState() != null && profile.getState().equalsIgnoreCase(stateReq)) {
            score += 15; reasons.add("State eligible: " + profile.getState());
        } else if (profile.getState() == null || profile.getState().isBlank()) {
            score += 5; missing.add("Add your state — scheme is for " + stateReq);
        } else {
            missing.add("State restricted to " + stateReq);
        }

        int matchScore = maxScore > 0 ? Math.min(98, (int) Math.round((score / (double) maxScore) * 100)) : 0;
        boolean eligible = matchScore >= 50 && missing.stream().noneMatch(m ->
                m.contains("only") || m.contains("restricted") || m.contains("exceeds") || m.contains("farmers only"));

        result.put("eligible",       eligible);
        result.put("matchScore",     matchScore);
        result.put("matchReasons",   reasons);
        result.put("missingCriteria",missing);
        return result;
    }

    // ── Helpers ────────────────────────────────────────────────────────────
    private String mapCategory(String text) {
        text = text.toLowerCase();
        if (text.contains("education") || text.contains("scholarship") || text.contains("student")) return "EDUCATION";
        if (text.contains("health") || text.contains("medical") || text.contains("hospital"))       return "HEALTH";
        if (text.contains("housing") || text.contains("home") || text.contains("awas"))             return "HOUSING";
        if (text.contains("loan") || text.contains("finance") || text.contains("credit") || text.contains("bank")) return "FINANCE";
        if (text.contains("skill") || text.contains("employment") || text.contains("job") || text.contains("training")) return "EMPLOYMENT";
        if (text.contains("farm") || text.contains("agriculture") || text.contains("kisan"))        return "AGRICULTURE";
        return "SOCIAL";
    }

    private String parseTargetGroup(String text) {
        text = text.toLowerCase();
        if (text.contains("scheduled caste") || text.contains(" sc "))  return "SC";
        if (text.contains("scheduled tribe") || text.contains(" st "))  return "ST";
        if (text.contains("obc") || text.contains("other backward"))    return "OBC";
        if (text.contains("ews") || text.contains("economically weaker")) return "EWS";
        if (text.contains("minority"))                                   return "MINORITY";
        if (text.contains("farmer") || text.contains("kisan"))          return "FARMER";
        if (text.contains("women") || text.contains("girl"))            return "WOMAN";
        if (text.contains("disabled") || text.contains("differently"))  return "DISABLED";
        return "ALL";
    }

    private String parseGender(String text) {
        text = text.toLowerCase();
        if (text.contains("girl") || text.contains("women") || text.contains("female")) return "FEMALE";
        return "ANY";
    }

    private double parseIncomeCeiling(String desc) {
        try {
            java.util.regex.Matcher m = java.util.regex.Pattern
                    .compile("(\\d+(?:\\.\\d+)?)\\s*lakh", java.util.regex.Pattern.CASE_INSENSITIVE)
                    .matcher(desc);
            if (m.find()) return Double.parseDouble(m.group(1)) * 100000;
        } catch (Exception ignored) {}
        return 0;
    }

    private double extractIncome(UserProfile p) {
        if (p.getAnnualIncome() == null || p.getAnnualIncome().isBlank()) return 0;
        try {
            String raw = p.getAnnualIncome().replaceAll("[^0-9]", "");
            return raw.isBlank() ? 0 : Double.parseDouble(raw);
        } catch (NumberFormatException e) { return 0; }
    }

    private String fmt(double income) {
        if (income >= 100000) return String.format("%.1fL", income / 100000);
        return String.format("%.0f", income);
    }

    private Map<String, String> buildProfileSummary(UserProfile p) {
        Map<String, String> s = new HashMap<>();
        if (p == null) return s;
        s.put("category",   p.getCategory()         != null ? p.getCategory()         : "Not set");
        s.put("income",     p.getAnnualIncome()      != null ? p.getAnnualIncome()     : "Not set");
        s.put("employment", p.getEmploymentStatus()  != null ? p.getEmploymentStatus() : "Not set");
        s.put("state",      p.getState()             != null ? p.getState()            : "Not set");
        return s;
    }

    private String safeStr(Map<String, Object> map, String key) {
        Object v = map.get(key); return v != null ? v.toString() : "";
    }
}
