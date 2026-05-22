package com.opportunitypathfinder.service;

import com.opportunitypathfinder.repository.SkillRepository;
import com.opportunitypathfinder.repository.UserProfileRepository;
import com.opportunitypathfinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillGapService {

    private final UserRepository userRepository;
    private final UserProfileRepository profileRepository;
    private final SkillRepository skillRepository;

    // ── Free learning resources per skill ─────────────────────────────────
    private static final Map<String, Map<String, String>> RESOURCES = new HashMap<>();
    static {
        r("java",           "Java Full Course",              "https://www.youtube.com/watch?v=eIrMbAQSU34", "YouTube - Telusko",         "Beginner");
        r("python",         "Python for Beginners",          "https://www.youtube.com/watch?v=_uQrJ0TkZlc", "YouTube - Programming with Mosh", "Beginner");
        r("javascript",     "JavaScript Full Course",        "https://www.youtube.com/watch?v=PkZNo7MFNFg", "YouTube - freeCodeCamp",    "Beginner");
        r("typescript",     "TypeScript Tutorial",           "https://www.youtube.com/watch?v=BwuLxPH8IDs", "YouTube - Traversy Media",  "Intermediate");
        r("react",          "React JS Full Course",          "https://www.youtube.com/watch?v=bMknfKXIFA8", "YouTube - freeCodeCamp",    "Intermediate");
        r("angular",        "Angular Crash Course",          "https://www.youtube.com/watch?v=3dHNOWTI7H8", "YouTube - Traversy Media",  "Intermediate");
        r("vue",            "Vue JS Crash Course",           "https://www.youtube.com/watch?v=qZXt1Aom3Cs", "YouTube - Traversy Media",  "Intermediate");
        r("spring",         "Spring Boot Full Course",       "https://www.youtube.com/watch?v=9SGDpanrc8U", "YouTube - Amigoscode",      "Intermediate");
        r("springboot",     "Spring Boot Full Course",       "https://www.youtube.com/watch?v=9SGDpanrc8U", "YouTube - Amigoscode",      "Intermediate");
        r("node",           "Node.js Full Course",           "https://www.youtube.com/watch?v=Oe421EPjeBE", "YouTube - freeCodeCamp",    "Intermediate");
        r("nodejs",         "Node.js Full Course",           "https://www.youtube.com/watch?v=Oe421EPjeBE", "YouTube - freeCodeCamp",    "Intermediate");
        r("mysql",          "MySQL Full Course",             "https://www.youtube.com/watch?v=7S_tz1z_5bA", "YouTube - Programming with Mosh", "Beginner");
        r("postgresql",     "PostgreSQL Tutorial",           "https://www.youtube.com/watch?v=qw--VYLpxG4", "YouTube - freeCodeCamp",    "Beginner");
        r("mongodb",        "MongoDB Full Course",           "https://www.youtube.com/watch?v=ExcRbA7fy_A", "YouTube - freeCodeCamp",    "Beginner");
        r("sql",            "SQL Full Course",               "https://www.youtube.com/watch?v=HXV3zeQKqGY", "YouTube - freeCodeCamp",    "Beginner");
        r("docker",         "Docker Full Course",            "https://www.youtube.com/watch?v=fqMOX6JJhGo", "YouTube - freeCodeCamp",    "Intermediate");
        r("kubernetes",     "Kubernetes Full Course",        "https://www.youtube.com/watch?v=X48VuDVv0do", "YouTube - TechWorld with Nana", "Advanced");
        r("aws",            "AWS Cloud Practitioner",        "https://www.youtube.com/watch?v=SOTamWNgDKc", "YouTube - freeCodeCamp",    "Beginner");
        r("git",            "Git & GitHub Full Course",      "https://www.youtube.com/watch?v=apGV9Kg7ics", "YouTube - Kunal Kushwaha",  "Beginner");
        r("html",           "HTML Full Course",              "https://www.youtube.com/watch?v=pQN-pnXPaVg", "YouTube - freeCodeCamp",    "Beginner");
        r("css",            "CSS Full Course",               "https://www.youtube.com/watch?v=1Rs2ND1ryYc", "YouTube - freeCodeCamp",    "Beginner");
        r("tailwind",       "Tailwind CSS Full Course",      "https://www.youtube.com/watch?v=lCxcTsOHrjo", "YouTube - Traversy Media",  "Beginner");
        r("kotlin",         "Kotlin Full Course",            "https://www.youtube.com/watch?v=F9UC9DY-vIU", "YouTube - freeCodeCamp",    "Intermediate");
        r("flutter",        "Flutter Full Course",           "https://www.youtube.com/watch?v=VPvVD8t02U8", "YouTube - freeCodeCamp",    "Intermediate");
        r("machine learning","ML Full Course",               "https://www.youtube.com/watch?v=GwIo3gDZCVQ", "YouTube - freeCodeCamp",    "Intermediate");
        r("deep learning",  "Deep Learning Specialization",  "https://www.coursera.org/specializations/deep-learning", "Coursera - Andrew Ng", "Advanced");
        r("tensorflow",     "TensorFlow Full Course",        "https://www.youtube.com/watch?v=tPYj3fFJGjk", "YouTube - freeCodeCamp",    "Intermediate");
        r("linux",          "Linux Full Course",             "https://www.youtube.com/watch?v=sWbUDq4S6Y8", "YouTube - freeCodeCamp",    "Beginner");
        r("rest api",       "REST API Design",               "https://www.youtube.com/watch?v=lsMQRaeKNDk", "YouTube - freeCodeCamp",    "Intermediate");
        r("microservices",  "Microservices Full Course",     "https://www.youtube.com/watch?v=lTAcCNbJ7KE", "YouTube - freeCodeCamp",    "Advanced");
        r("redis",          "Redis Full Course",             "https://www.youtube.com/watch?v=jgpVdJB2sKQ", "YouTube - freeCodeCamp",    "Intermediate");
        r("graphql",        "GraphQL Full Course",           "https://www.youtube.com/watch?v=ed8SzALpx1Q", "YouTube - freeCodeCamp",    "Intermediate");
        r("figma",          "Figma Full Course",             "https://www.youtube.com/watch?v=FTFaQWZBqQ8", "YouTube - freeCodeCamp",    "Beginner");
        r("go",             "Go Full Course",                "https://www.youtube.com/watch?v=un6ZyFkqFKo", "YouTube - freeCodeCamp",    "Intermediate");
        r("rust",           "Rust Full Course",              "https://www.youtube.com/watch?v=BpPEoZW5IiY", "YouTube - freeCodeCamp",    "Advanced");
        r("scala",          "Scala Full Course",             "https://www.youtube.com/watch?v=-8V6bMjThNo", "YouTube - freeCodeCamp",    "Advanced");
        r("selenium",       "Selenium Full Course",          "https://www.youtube.com/watch?v=j7VZsCCnptM", "YouTube - freeCodeCamp",    "Intermediate");
        r("php",            "PHP Full Course",               "https://www.youtube.com/watch?v=OK_JCtrrv-c", "YouTube - freeCodeCamp",    "Beginner");
        r("ruby",           "Ruby Full Course",              "https://www.youtube.com/watch?v=t_ispmWmdjY", "YouTube - freeCodeCamp",    "Beginner");
        r("android",        "Android Development Course",    "https://www.youtube.com/watch?v=fis26HvvDII", "YouTube - freeCodeCamp",    "Intermediate");
        r("firebase",       "Firebase Full Course",          "https://www.youtube.com/watch?v=9kRgVxULbag", "YouTube - freeCodeCamp",    "Beginner");
        r("hibernate",      "Hibernate Full Course",         "https://www.youtube.com/watch?v=0uLqdBDIAiA", "YouTube - Telusko",         "Intermediate");
        r("maven",          "Maven Tutorial",                "https://www.youtube.com/watch?v=al7bRZzz4oU", "YouTube - Telusko",         "Beginner");
        r("postman",        "Postman Full Course",           "https://www.youtube.com/watch?v=VywxIQ2ZXw4", "YouTube - freeCodeCamp",    "Beginner");
        r("system design",  "System Design Full Course",     "https://www.youtube.com/watch?v=m8Icp_Cid5o", "YouTube - freeCodeCamp",    "Advanced");
    }

    private static void r(String skill, String title, String url, String platform, String level) {
        RESOURCES.put(skill, Map.of("title", title, "url", url, "platform", platform, "level", level));
    }

    // ── Career path skill requirements ────────────────────────────────────
    private static final Map<String, Map<String, List<String>>> PATH_SKILLS = new HashMap<>();
    static {
        PATH_SKILLS.put("Backend Developer", Map.of(
            "CRITICAL",   List.of("java", "spring", "mysql", "rest api", "git"),
            "IMPORTANT",  List.of("docker", "postgresql", "redis", "hibernate", "linux"),
            "NICE",       List.of("kubernetes", "aws", "microservices", "graphql", "kafka")
        ));
        PATH_SKILLS.put("Frontend Developer", Map.of(
            "CRITICAL",   List.of("html", "css", "javascript", "react", "git"),
            "IMPORTANT",  List.of("typescript", "tailwind", "figma", "rest api"),
            "NICE",       List.of("vue", "angular", "webpack", "testing", "aws")
        ));
        PATH_SKILLS.put("Full Stack Developer", Map.of(
            "CRITICAL",   List.of("javascript", "react", "node", "mysql", "git"),
            "IMPORTANT",  List.of("typescript", "docker", "rest api", "mongodb", "linux"),
            "NICE",       List.of("aws", "kubernetes", "graphql", "redis", "microservices")
        ));
        PATH_SKILLS.put("Data Scientist", Map.of(
            "CRITICAL",   List.of("python", "machine learning", "sql", "tensorflow"),
            "IMPORTANT",  List.of("deep learning", "docker", "git", "aws"),
            "NICE",       List.of("scala", "spark", "kubernetes", "graphql")
        ));
        PATH_SKILLS.put("DevOps Engineer", Map.of(
            "CRITICAL",   List.of("linux", "docker", "git", "aws"),
            "IMPORTANT",  List.of("kubernetes", "python", "bash", "jenkins"),
            "NICE",       List.of("terraform", "ansible", "prometheus", "go")
        ));
        PATH_SKILLS.put("Android Developer", Map.of(
            "CRITICAL",   List.of("kotlin", "android", "java", "git"),
            "IMPORTANT",  List.of("firebase", "rest api", "mysql"),
            "NICE",       List.of("flutter", "aws", "testing")
        ));
        PATH_SKILLS.put("UI/UX Designer", Map.of(
            "CRITICAL",   List.of("figma", "html", "css"),
            "IMPORTANT",  List.of("javascript", "photoshop", "git"),
            "NICE",       List.of("react", "tailwind", "vue")
        ));
        PATH_SKILLS.put("Cybersecurity Analyst", Map.of(
            "CRITICAL",   List.of("linux", "python", "networking", "git"),
            "IMPORTANT",  List.of("aws", "docker", "sql"),
            "NICE",       List.of("kubernetes", "go", "rust")
        ));
    }

    // ── Main Method ────────────────────────────────────────────────────────
    public Map<String, Object> getSkillGap(String email, String targetRole) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        var profile = profileRepository.findByUserId(user.getId()).orElse(null);

        List<String> userSkills = skillRepository.findByUserId(user.getId())
                .stream().map(s -> s.getSkillName().toLowerCase()).collect(Collectors.toList());

        // Resolve target role
        String role = resolveRole(targetRole, profile, userSkills);
        Map<String, List<String>> required = PATH_SKILLS.getOrDefault(role, PATH_SKILLS.get("Full Stack Developer"));

        List<String> critical  = required.get("CRITICAL");
        List<String> important = required.get("IMPORTANT");
        List<String> nice      = required.get("NICE");

        // Categorize gaps
        List<Map<String, Object>> criticalGap  = buildGapList(critical,  userSkills, "CRITICAL");
        List<Map<String, Object>> importantGap = buildGapList(important, userSkills, "IMPORTANT");
        List<Map<String, Object>> niceGap      = buildGapList(nice,      userSkills, "NICE");

        // Skills user has that are relevant
        List<String> allRequired = new ArrayList<>();
        allRequired.addAll(critical); allRequired.addAll(important); allRequired.addAll(nice);
        List<String> relevantSkills = userSkills.stream()
                .filter(s -> allRequired.contains(s.toLowerCase()))
                .collect(Collectors.toList());
        List<String> otherSkills = userSkills.stream()
                .filter(s -> !allRequired.contains(s.toLowerCase()))
                .collect(Collectors.toList());

        // Overall readiness score
        int totalRequired = critical.size() + important.size();
        int totalHave = (int) critical.stream().filter(s -> userSkills.contains(s.toLowerCase())).count()
                      + (int) important.stream().filter(s -> userSkills.contains(s.toLowerCase())).count();
        int readiness = totalRequired > 0 ? Math.min(100, (int) Math.round((totalHave / (double) totalRequired) * 100)) : 0;

        // Category breakdown
        Map<String, Object> breakdown = new LinkedHashMap<>();
        breakdown.put("critical",  Map.of(
            "total", critical.size(),
            "have",  (int) critical.stream().filter(s -> userSkills.contains(s.toLowerCase())).count(),
            "pct",   pct(critical, userSkills)
        ));
        breakdown.put("important", Map.of(
            "total", important.size(),
            "have",  (int) important.stream().filter(s -> userSkills.contains(s.toLowerCase())).count(),
            "pct",   pct(important, userSkills)
        ));
        breakdown.put("nice", Map.of(
            "total", nice.size(),
            "have",  (int) nice.stream().filter(s -> userSkills.contains(s.toLowerCase())).count(),
            "pct",   pct(nice, userSkills)
        ));

        Map<String, Object> result = new HashMap<>();
        result.put("role",           role);
        result.put("readiness",      readiness);
        result.put("criticalGap",    criticalGap);
        result.put("importantGap",   importantGap);
        result.put("niceGap",        niceGap);
        result.put("relevantSkills", relevantSkills);
        result.put("otherSkills",    otherSkills);
        result.put("breakdown",      breakdown);
        result.put("allRoles",       new ArrayList<>(PATH_SKILLS.keySet()));
        result.put("profileComplete",profile != null);
        result.put("totalSkills",    userSkills.size());
        return result;
    }

    private List<Map<String, Object>> buildGapList(List<String> required,
                                                    List<String> userSkills, String priority) {
        return required.stream().map(skill -> {
            boolean have = userSkills.contains(skill.toLowerCase());
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("skill",    skill);
            item.put("have",     have);
            item.put("priority", priority);
            Map<String, String> res = RESOURCES.get(skill.toLowerCase());
            if (!have && res != null) {
                item.put("resource", res);
            }
            return item;
        }).collect(Collectors.toList());
    }

    private int pct(List<String> required, List<String> userSkills) {
        if (required.isEmpty()) return 100;
        long have = required.stream().filter(s -> userSkills.contains(s.toLowerCase())).count();
        return (int) Math.round((have / (double) required.size()) * 100);
    }

    private String resolveRole(String targetRole, Object profile, List<String> userSkills) {
        if (targetRole != null && !targetRole.isBlank() && PATH_SKILLS.containsKey(targetRole))
            return targetRole;
        // Default to Full Stack if no match
        return "Full Stack Developer";
    }
}
