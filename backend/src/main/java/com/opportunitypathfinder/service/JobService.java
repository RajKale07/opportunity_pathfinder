package com.opportunitypathfinder.service;

import com.opportunitypathfinder.model.UserProfile;
import com.opportunitypathfinder.repository.SkillRepository;
import com.opportunitypathfinder.repository.UserProfileRepository;
import com.opportunitypathfinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private static final Logger log = Logger.getLogger(JobService.class.getName());

    private final UserRepository userRepository;
    private final UserProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final RestTemplate restTemplate;

    @Value("${adzuna.app.id}")
    private String adzunaAppId;

    @Value("${adzuna.app.key}")
    private String adzunaAppKey;

    public Map<String, Object> searchJobs(String email, String query, String location,
                                           String type, boolean remoteOnly, int page) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> userSkills = skillRepository.findByUserId(user.getId())
                .stream().map(s -> s.getSkillName().toLowerCase()).collect(Collectors.toList());

        UserProfile profile = profileRepository.findByUserId(user.getId()).orElse(null);

        String searchQuery = buildQuery(query, profile, userSkills);
        String searchLocation = resolveLocation(location, profile);

        List<Map<String, Object>> rawJobs = fetchFromAdzuna(searchQuery, searchLocation, type, remoteOnly, page);

        // If Adzuna returns nothing, try Remotive (no key needed, remote jobs)
        if (rawJobs.isEmpty()) {
            rawJobs = fetchFromRemotive(searchQuery);
        }

        List<Map<String, Object>> enriched = rawJobs.stream()
                .map(job -> enrichJob(job, userSkills, profile))
                .sorted((a, b) -> Integer.compare(
                        (int) b.getOrDefault("matchScore", 0),
                        (int) a.getOrDefault("matchScore", 0)))
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("jobs", enriched);
        result.put("total", enriched.size());
        result.put("query", searchQuery);
        result.put("location", searchLocation);
        result.put("userSkills", userSkills);
        result.put("profileComplete", profile != null);
        return result;
    }

    // ── Adzuna API ─────────────────────────────────────────────────────────
    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> fetchFromAdzuna(String query, String location,
                                                       String type, boolean remoteOnly, int page) {
        try {
            // Adzuna India endpoint
            UriComponentsBuilder builder = UriComponentsBuilder
                    .fromHttpUrl("https://api.adzuna.com/v1/api/jobs/in/search/" + page)
                    .queryParam("app_id", adzunaAppId)
                    .queryParam("app_key", adzunaAppKey)
                    .queryParam("results_per_page", "20")
                    .queryParam("what", query)
                    .queryParam("content-type", "application/json");

            if (location != null && !location.isBlank())
                builder.queryParam("where", location);
            if (remoteOnly)
                builder.queryParam("what_and", "remote");
            if (type != null && !type.isBlank() && type.equals("INTERN"))
                builder.queryParam("what_and", "internship");

            String url = builder.build(false).toUriString();
            log.info("Calling Adzuna: " + url);

            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(new HttpHeaders()), Map.class);

            if (response.getBody() == null) return Collections.emptyList();
            Object results = response.getBody().get("results");
            if (!(results instanceof List)) return Collections.emptyList();

            // Normalize Adzuna response to our format
            List<Map<String, Object>> normalized = new ArrayList<>();
            for (Map<String, Object> r : (List<Map<String, Object>>) results) {
                Map<String, Object> job = new HashMap<>();
                job.put("job_id",                    safeStr(r, "id"));
                job.put("job_title",                 safeStr(r, "title"));
                job.put("employer_name",             safeStr(getNestedStr(r, "company", "display_name")));
                job.put("job_city",                  safeStr(getNestedStr(r, "location", "display_name")));
                job.put("job_country",               "India");
                job.put("job_employment_type",       safeStr(r, "contract_time"));
                job.put("job_is_remote",             safeStr(r, "title").toLowerCase().contains("remote")
                                                     || safeStr(r, "description").toLowerCase().contains("remote work"));
                job.put("job_apply_link",            safeStr(r, "redirect_url"));
                job.put("job_posted_at_datetime_utc",safeStr(r, "created"));
                job.put("job_description",           safeStr(r, "description"));
                job.put("employer_logo",             "");
                job.put("job_min_salary",            r.get("salary_min"));
                job.put("job_max_salary",            r.get("salary_max"));
                job.put("job_salary_currency",       "GBP");
                normalized.add(job);
            }
            log.info("Adzuna returned " + normalized.size() + " jobs");
            return normalized;

        } catch (HttpClientErrorException e) {
            log.severe("Adzuna HTTP error: " + e.getStatusCode() + " — " + e.getResponseBodyAsString());
            return Collections.emptyList();
        } catch (Exception e) {
            log.severe("Adzuna call failed: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    // ── Remotive API (no key, remote jobs only) ────────────────────────────
    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> fetchFromRemotive(String query) {
        try {
            String url = UriComponentsBuilder
                    .fromHttpUrl("https://remotive.com/api/remote-jobs")
                    .queryParam("search", query)
                    .queryParam("limit", "20")
                    .build(false).toUriString();

            log.info("Calling Remotive: " + url);
            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(new HttpHeaders()), Map.class);

            if (response.getBody() == null) return Collections.emptyList();
            Object jobs = response.getBody().get("jobs");
            if (!(jobs instanceof List)) return Collections.emptyList();

            List<Map<String, Object>> normalized = new ArrayList<>();
            for (Map<String, Object> r : (List<Map<String, Object>>) jobs) {
                Map<String, Object> job = new HashMap<>();
                job.put("job_id",                    safeStr(r, "id"));
                job.put("job_title",                 safeStr(r, "title"));
                job.put("employer_name",             safeStr(r, "company_name"));
                job.put("job_city",                  safeStr(r, "candidate_required_location"));
                job.put("job_country",               "Remote");
                job.put("job_employment_type",       safeStr(r, "job_type"));
                job.put("job_is_remote",             true);
                job.put("job_apply_link",            safeStr(r, "url"));
                job.put("job_posted_at_datetime_utc",safeStr(r, "publication_date"));
                job.put("job_description",           stripHtml(safeStr(r, "description")));
                job.put("employer_logo",             safeStr(r, "company_logo"));
                job.put("job_min_salary",            null);
                job.put("job_max_salary",            null);
                job.put("job_salary_currency",       "");
                normalized.add(job);
            }
            log.info("Remotive returned " + normalized.size() + " jobs");
            return normalized;

        } catch (Exception e) {
            log.severe("Remotive call failed: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    // ── Helpers ────────────────────────────────────────────────────────────
    private String buildQuery(String query, UserProfile profile, List<String> skills) {
        if (query != null && !query.isBlank()) return query;
        if (profile != null) {
            if (profile.getGraduationDegree() != null && profile.getGraduationBranch() != null)
                return profile.getGraduationDegree() + " " + profile.getGraduationBranch();
            if (profile.getGraduationDegree() != null)
                return profile.getGraduationDegree();
        }
        if (!skills.isEmpty()) return skills.get(0) + " developer";
        return "software developer";
    }

    private String resolveLocation(String location, UserProfile profile) {
        if (location != null && !location.isBlank()) return location;
        if (profile != null && profile.getCity() != null) return profile.getCity();
        return "";
    }

    private Map<String, Object> enrichJob(Map<String, Object> raw, List<String> userSkills, UserProfile profile) {
        Map<String, Object> job = new HashMap<>();
        job.put("id",          safeStr(raw, "job_id"));
        job.put("title",       safeStr(raw, "job_title"));
        job.put("company",     safeStr(raw, "employer_name"));
        job.put("location",    buildLocation(raw));
        job.put("type",        safeStr(raw, "job_employment_type"));
        job.put("remote",      raw.getOrDefault("job_is_remote", false));
        job.put("applyUrl",    safeStr(raw, "job_apply_link"));
        job.put("postedAt",    safeStr(raw, "job_posted_at_datetime_utc"));
        job.put("logo",        safeStr(raw, "employer_logo"));
        job.put("description", truncate(safeStr(raw, "job_description"), 400));
        job.put("salaryMin",   raw.get("job_min_salary"));
        job.put("salaryMax",   raw.get("job_max_salary"));
        job.put("salaryCurrency", safeStr(raw, "job_salary_currency"));

        String desc = (safeStr(raw, "job_description") + " " + safeStr(raw, "job_title")).toLowerCase();
        List<String> matched = userSkills.stream().filter(desc::contains).collect(Collectors.toList());
        List<String> missing = extractRequiredSkills(desc, userSkills);

        int matchScore = userSkills.isEmpty() ? 50
                : Math.min(100, (int) Math.round((matched.size() / (double) Math.max(userSkills.size(), 1)) * 100));

        job.put("matchedSkills",  matched);
        job.put("missingSkills",  missing);
        job.put("matchScore",     matchScore);
        job.put("matchLabel",     matchLabel(matchScore));
        job.put("fresherFriendly", desc.contains("fresher") || desc.contains("entry level")
                || desc.contains("0-1") || desc.contains("graduate") || desc.contains("junior"));
        return job;
    }

    private List<String> extractRequiredSkills(String desc, List<String> userSkills) {
        List<String> all = Arrays.asList(
            "java", "python", "javascript", "typescript", "react", "angular", "vue", "spring",
            "node", "nodejs", "mysql", "postgresql", "mongodb", "docker", "kubernetes", "aws",
            "git", "html", "css", "tailwind", "kotlin", "swift", "flutter", "machine learning",
            "tensorflow", "sql", "linux", "rest api", "microservices", "hibernate", "redis",
            "graphql", "selenium", "figma", "php", "ruby", "go", "rust", "scala"
        );
        return all.stream()
                .filter(s -> desc.contains(s) && !userSkills.contains(s))
                .limit(5).collect(Collectors.toList());
    }

    private String matchLabel(int score) {
        if (score >= 75) return "Strong Match";
        if (score >= 50) return "Good Match";
        if (score >= 25) return "Partial Match";
        return "Low Match";
    }

    private String buildLocation(Map<String, Object> raw) {
        List<String> parts = Arrays.asList(
            safeStr(raw, "job_city"), safeStr(raw, "job_state"), safeStr(raw, "job_country"));
        return parts.stream().filter(s -> !s.isBlank()).collect(Collectors.joining(", "));
    }

    @SuppressWarnings("unchecked")
    private String getNestedStr(Map<String, Object> map, String key, String subKey) {
        Object val = map.get(key);
        if (val instanceof Map) return safeStr((Map<String, Object>) val, subKey);
        return "";
    }

    private String safeStr(Map<String, Object> map, String key) {
        Object v = map.get(key); return v != null ? v.toString() : "";
    }

    private String safeStr(String s) { return s != null ? s : ""; }

    private String truncate(String s, int max) {
        if (s == null || s.length() <= max) return s;
        return s.substring(0, max) + "...";
    }

    private String stripHtml(String html) {
        if (html == null) return "";
        return html.replaceAll("<[^>]*>", " ").replaceAll("\\s+", " ").trim();
    }
}
