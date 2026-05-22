package com.opportunitypathfinder.service;

import com.opportunitypathfinder.model.UserProfile;
import com.opportunitypathfinder.repository.SkillRepository;
import com.opportunitypathfinder.repository.UserProfileRepository;
import com.opportunitypathfinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CareerSimulationService {

    private final UserRepository userRepository;
    private final UserProfileRepository profileRepository;
    private final SkillRepository skillRepository;

    // Base salaries (LPA) per role per experience level
    private static final Map<String, int[]> ROLE_SALARIES = Map.of(
        "Backend Developer",     new int[]{5, 8, 14, 22, 35, 50},
        "Frontend Developer",    new int[]{4, 7, 12, 18, 28, 42},
        "Full Stack Developer",  new int[]{6, 9, 16, 25, 38, 55},
        "Data Scientist",        new int[]{7, 11, 18, 28, 42, 60},
        "DevOps Engineer",       new int[]{6, 10, 16, 26, 40, 55},
        "Android Developer",     new int[]{5, 8, 13, 20, 30, 45},
        "UI/UX Designer",        new int[]{4, 6, 10, 16, 24, 35},
        "Cybersecurity Analyst", new int[]{6, 10, 17, 27, 40, 58}
    );

    // Skills that boost salary by role
    private static final Map<String, List<String>> POWER_SKILLS = Map.of(
        "Backend Developer",     List.of("aws", "kubernetes", "microservices", "system design", "kafka"),
        "Frontend Developer",    List.of("typescript", "next.js", "react", "performance", "three.js"),
        "Full Stack Developer",  List.of("aws", "docker", "typescript", "graphql", "system design"),
        "Data Scientist",        List.of("llm", "pytorch", "mlops", "spark", "generative ai"),
        "DevOps Engineer",       List.of("kubernetes", "terraform", "aws", "gitops", "platform engineering"),
        "Android Developer",     List.of("kotlin", "jetpack compose", "kmm", "firebase", "ml kit"),
        "UI/UX Designer",        List.of("figma", "design system", "motion design", "framer", "3d design"),
        "Cybersecurity Analyst", List.of("cloud security", "pentest", "siem", "threat intelligence", "zero trust")
    );

    private static final List<String> ROLES = List.of(
        "Backend Developer", "Frontend Developer", "Full Stack Developer",
        "Data Scientist", "DevOps Engineer", "Android Developer",
        "UI/UX Designer", "Cybersecurity Analyst"
    );

    public Map<String, Object> simulate(String email, String targetRole) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepository.findByUserId(user.getId()).orElse(null);
        List<String> userSkills = skillRepository.findByUserId(user.getId())
                .stream().map(s -> s.getSkillName().toLowerCase()).collect(Collectors.toList());

        // Resolve role
        String role = (targetRole != null && !targetRole.isBlank() && ROLE_SALARIES.containsKey(targetRole))
                ? targetRole : detectBestRole(userSkills, profile);

        // Detect current experience level (0-5)
        int expLevel = detectExperienceLevel(profile, userSkills);

        // Base salary at current level
        int[] salaries = ROLE_SALARIES.getOrDefault(role, ROLE_SALARIES.get("Full Stack Developer"));
        int currentSalary = salaries[expLevel];

        // Power skill boost (each power skill adds 5-10%)
        List<String> powerSkills = POWER_SKILLS.getOrDefault(role, List.of());
        long powerSkillCount = userSkills.stream().filter(sk -> powerSkills.stream().anyMatch(ps -> sk.contains(ps))).count();
        double boostMultiplier = 1.0 + (powerSkillCount * 0.07);
        currentSalary = (int) (currentSalary * boostMultiplier);

        // 5-year salary projection
        List<Map<String, Object>> projection = new ArrayList<>();
        int projSalary = currentSalary;
        String[] yearLabels = {"Now", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"};
        String[] milestones = {
            "Current position",
            "Performance appraisal + skill growth",
            "Promotion or job switch",
            "Senior role eligibility",
            "Lead / Architect track",
            "Top-tier compensation"
        };

        for (int i = 0; i < 6; i++) {
            if (i > 0) {
                // 15-25% growth per year based on skills
                double growthRate = 0.15 + (powerSkillCount * 0.02);
                if (i == 2 || i == 4) growthRate += 0.10; // job switch / promotion years
                projSalary = (int) (projSalary * (1 + growthRate));
                if (expLevel + i < salaries.length)
                    projSalary = Math.max(projSalary, salaries[Math.min(expLevel + i, salaries.length - 1)]);
            }
            Map<String, Object> point = new LinkedHashMap<>();
            point.put("year", yearLabels[i]);
            point.put("salary", projSalary);
            point.put("milestone", milestones[i]);
            projection.add(point);
        }

        // Skills to add for faster growth
        List<String> missingPowerSkills = powerSkills.stream()
                .filter(ps -> userSkills.stream().noneMatch(sk -> sk.contains(ps)))
                .limit(5)
                .collect(Collectors.toList());

        // Scenario comparison: what if user learns top 3 power skills
        List<Map<String, Object>> optimisticProjection = new ArrayList<>();
        int optSalary = (int) (currentSalary * 1.15); // 15% boost from learning power skills
        for (int i = 0; i < 6; i++) {
            if (i > 0) {
                double growthRate = 0.20 + (Math.min(powerSkillCount + 3, 5) * 0.02);
                if (i == 2 || i == 4) growthRate += 0.12;
                optSalary = (int) (optSalary * (1 + growthRate));
            }
            Map<String, Object> point = new LinkedHashMap<>();
            point.put("year", yearLabels[i]);
            point.put("salary", optSalary);
            optimisticProjection.add(point);
        }

        // Role comparison at year 3
        List<Map<String, Object>> roleComparison = ROLES.stream().map(r -> {
            int[] s = ROLE_SALARIES.get(r);
            int base = s[Math.min(expLevel + 2, s.length - 1)];
            Map<String, Object> rc = new LinkedHashMap<>();
            rc.put("role", r);
            rc.put("salary3yr", base);
            rc.put("current", r.equals(role));
            return rc;
        }).sorted((a, b) -> (int) b.get("salary3yr") - (int) a.get("salary3yr"))
          .collect(Collectors.toList());

        // Career insights
        List<String> insights = buildInsights(profile, userSkills, role, powerSkillCount, expLevel);

        Map<String, Object> result = new HashMap<>();
        result.put("role", role);
        result.put("currentSalary", currentSalary);
        result.put("expLevel", expLevel);
        result.put("expLevelLabel", expLevelLabel(expLevel));
        result.put("projection", projection);
        result.put("optimisticProjection", optimisticProjection);
        result.put("roleComparison", roleComparison);
        result.put("missingPowerSkills", missingPowerSkills);
        result.put("powerSkillsHave", powerSkillCount);
        result.put("totalPowerSkills", powerSkills.size());
        result.put("insights", insights);
        result.put("allRoles", ROLES);
        result.put("peakSalary", salaries[salaries.length - 1]);
        return result;
    }

    private String detectBestRole(List<String> skills, UserProfile profile) {
        Map<String, Integer> scores = new LinkedHashMap<>();
        Map<String, List<String>> triggers = Map.of(
            "Data Scientist",        List.of("python", "machine learning", "tensorflow", "pytorch", "ml", "ai"),
            "DevOps Engineer",       List.of("docker", "kubernetes", "aws", "linux", "jenkins", "ci/cd"),
            "Android Developer",     List.of("android", "kotlin", "flutter"),
            "UI/UX Designer",        List.of("figma", "design", "ui", "ux", "photoshop"),
            "Cybersecurity Analyst", List.of("security", "cybersecurity", "ethical hacking", "kali"),
            "Frontend Developer",    List.of("react", "angular", "vue", "html", "css", "javascript"),
            "Backend Developer",     List.of("java", "spring", "python", "node", "mysql", "api"),
            "Full Stack Developer",  List.of("react", "spring", "node", "fullstack", "javascript", "java")
        );
        for (Map.Entry<String, List<String>> e : triggers.entrySet()) {
            int score = (int) skills.stream().filter(sk -> e.getValue().stream().anyMatch(t -> sk.contains(t))).count();
            scores.put(e.getKey(), score);
        }
        return scores.entrySet().stream().max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey).orElse("Full Stack Developer");
    }

    private int detectExperienceLevel(UserProfile profile, List<String> skills) {
        if (profile == null) return 0;
        String exp = profile.getExperience();
        if (exp != null) {
            exp = exp.toLowerCase();
            if (exp.contains("7") || exp.contains("8") || exp.contains("9") || exp.contains("10")) return 5;
            if (exp.contains("5") || exp.contains("6")) return 4;
            if (exp.contains("4")) return 3;
            if (exp.contains("3")) return 3;
            if (exp.contains("2")) return 2;
            if (exp.contains("1")) return 1;
        }
        // Infer from skills count
        if (skills.size() >= 15) return 2;
        if (skills.size() >= 8) return 1;
        return 0;
    }

    private String expLevelLabel(int level) {
        return switch (level) {
            case 0 -> "Fresher";
            case 1 -> "Junior (1-2 yrs)";
            case 2 -> "Mid-Level (2-4 yrs)";
            case 3 -> "Senior (4-6 yrs)";
            case 4 -> "Lead (6-8 yrs)";
            default -> "Principal / Architect";
        };
    }

    private List<String> buildInsights(UserProfile profile, List<String> skills, String role, long powerSkillCount, int expLevel) {
        List<String> insights = new ArrayList<>();
        if (powerSkillCount == 0)
            insights.add("Learning even 1-2 power skills for " + role + " can boost your salary by 15-20%");
        if (expLevel == 0)
            insights.add("Freshers who contribute to open source projects get 30% higher offers on average");
        if (profile != null && profile.getGraduationCgpa() != null) {
            try {
                double cgpa = Double.parseDouble(profile.getGraduationCgpa().replaceAll("[^0-9.]", ""));
                if (cgpa >= 8.0) insights.add("Your strong academic record (CGPA " + profile.getGraduationCgpa() + ") qualifies you for top-tier company hiring");
            } catch (Exception ignored) {}
        }
        if (skills.size() < 5)
            insights.add("Upload your resume or certificates to auto-extract your skills for a more accurate simulation");
        insights.add("Job switching every 2-3 years typically yields 30-50% salary jumps in India's tech market");
        insights.add("Candidates with cloud certifications (AWS/GCP) earn 20-35% more than peers");
        return insights;
    }
}
