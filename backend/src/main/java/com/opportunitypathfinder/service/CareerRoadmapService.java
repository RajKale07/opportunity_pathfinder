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
public class CareerRoadmapService {

    private final UserRepository userRepository;
    private final UserProfileRepository profileRepository;
    private final SkillRepository skillRepository;

    // ── Career Path Definitions ────────────────────────────────────────────
    private static final Map<String, Map<String, Object>> CAREER_PATHS = new LinkedHashMap<>();

    static {
        // Backend Developer
        CAREER_PATHS.put("Backend Developer", Map.of(
            "icon", "⚙️",
            "description", "Build server-side applications, APIs, and databases",
            "triggers", List.of("java", "spring", "python", "node", "backend", "api", "mysql", "postgresql"),
            "degreeTriggers", List.of("b.tech", "bca", "b.sc", "computer science", "information technology"),
            "steps", List.of(
                step("Learn Core Programming", "Master Java or Python fundamentals, OOP concepts",
                    List.of("java", "python", "oop"), "₹0", "0-6 months", "FOUNDATION"),
                step("Database & SQL", "Learn MySQL/PostgreSQL, write complex queries, understand normalization",
                    List.of("mysql", "postgresql", "sql"), "₹0", "3-6 months", "FOUNDATION"),
                step("Build REST APIs", "Spring Boot or Node.js, REST principles, Postman testing",
                    List.of("spring", "springboot", "rest api", "postman"), "₹3-6 LPA", "6-12 months", "JUNIOR"),
                step("Version Control & Tools", "Git, GitHub, Maven/Gradle, basic Linux commands",
                    List.of("git", "linux", "maven"), "₹4-8 LPA", "6-12 months", "JUNIOR"),
                step("Junior Backend Developer", "First job — work on real projects, learn code review",
                    List.of("hibernate", "jpa", "junit"), "₹4-8 LPA", "1-2 years", "JUNIOR"),
                step("Intermediate Developer", "Microservices, Docker, Redis caching, system design basics",
                    List.of("docker", "microservices", "redis"), "₹8-15 LPA", "2-4 years", "MID"),
                step("Senior Backend Developer", "Architecture decisions, mentoring, cloud deployment (AWS/GCP)",
                    List.of("aws", "kubernetes", "system design"), "₹15-30 LPA", "4-7 years", "SENIOR"),
                step("Tech Lead / Architect", "Lead teams, design scalable systems, drive technical strategy",
                    List.of("system design", "leadership", "cloud"), "₹25-50 LPA", "7+ years", "LEAD")
            ),
            "trendingSkills", List.of("Kotlin", "GraphQL", "Kafka", "AWS Lambda", "System Design", "Redis"),
            "avgSalaryFresher", "₹4-6 LPA",
            "avgSalarySenior", "₹20-35 LPA"
        ));

        // Frontend Developer
        CAREER_PATHS.put("Frontend Developer", Map.of(
            "icon", "🎨",
            "description", "Build user interfaces and web experiences",
            "triggers", List.of("react", "angular", "vue", "html", "css", "javascript", "typescript", "frontend"),
            "degreeTriggers", List.of("b.tech", "bca", "b.sc", "computer science"),
            "steps", List.of(
                step("HTML, CSS & JavaScript", "Master web fundamentals, responsive design, DOM manipulation",
                    List.of("html", "css", "javascript"), "₹0", "0-4 months", "FOUNDATION"),
                step("Modern JavaScript (ES6+)", "Arrow functions, promises, async/await, modules",
                    List.of("javascript", "typescript"), "₹0", "2-4 months", "FOUNDATION"),
                step("React.js / Angular", "Component-based UI, state management, hooks, routing",
                    List.of("react", "angular", "vue"), "₹3-6 LPA", "4-8 months", "JUNIOR"),
                step("CSS Frameworks & Tools", "Tailwind CSS, Bootstrap, Figma basics, Git",
                    List.of("tailwind", "bootstrap", "figma", "git"), "₹4-7 LPA", "6-10 months", "JUNIOR"),
                step("Junior Frontend Developer", "First job — build real UIs, learn performance optimization",
                    List.of("webpack", "jest", "testing"), "₹4-8 LPA", "1-2 years", "JUNIOR"),
                step("Intermediate Frontend", "TypeScript, state management (Redux/Zustand), API integration",
                    List.of("typescript", "redux"), "₹8-15 LPA", "2-4 years", "MID"),
                step("Senior Frontend Developer", "Architecture, performance, accessibility, mentoring",
                    List.of("performance", "accessibility", "micro-frontend"), "₹15-28 LPA", "4-7 years", "SENIOR"),
                step("Frontend Architect / Lead", "Design systems, cross-team collaboration, tech decisions",
                    List.of("design system", "leadership"), "₹25-45 LPA", "7+ years", "LEAD")
            ),
            "trendingSkills", List.of("Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "WebAssembly", "Three.js"),
            "avgSalaryFresher", "₹3-6 LPA",
            "avgSalarySenior", "₹18-30 LPA"
        ));

        // Full Stack Developer
        CAREER_PATHS.put("Full Stack Developer", Map.of(
            "icon", "🔧",
            "description", "Build both frontend and backend of web applications",
            "triggers", List.of("react", "spring", "node", "fullstack", "full stack", "javascript", "java"),
            "degreeTriggers", List.of("b.tech", "bca", "mca", "computer science"),
            "steps", List.of(
                step("Frontend Basics", "HTML, CSS, JavaScript, React fundamentals",
                    List.of("html", "css", "javascript", "react"), "₹0", "0-6 months", "FOUNDATION"),
                step("Backend Basics", "Java/Node.js, REST APIs, basic database operations",
                    List.of("java", "node", "mysql", "rest api"), "₹0", "3-6 months", "FOUNDATION"),
                step("Full Stack Project", "Build a complete app — frontend + backend + database",
                    List.of("git", "postman", "deployment"), "₹4-7 LPA", "6-12 months", "JUNIOR"),
                step("Junior Full Stack Developer", "First job — work on both layers, learn DevOps basics",
                    List.of("docker", "linux", "aws"), "₹5-9 LPA", "1-2 years", "JUNIOR"),
                step("Intermediate Full Stack", "Microservices, cloud, CI/CD pipelines, system design",
                    List.of("microservices", "docker", "kubernetes"), "₹9-18 LPA", "2-4 years", "MID"),
                step("Senior Full Stack Developer", "Lead features end-to-end, architecture, code review",
                    List.of("system design", "aws", "leadership"), "₹18-35 LPA", "4-7 years", "SENIOR"),
                step("Tech Lead", "Own entire product stack, mentor team, drive technical roadmap",
                    List.of("leadership", "architecture"), "₹30-55 LPA", "7+ years", "LEAD")
            ),
            "trendingSkills", List.of("Next.js", "TypeScript", "Docker", "AWS", "GraphQL", "Prisma"),
            "avgSalaryFresher", "₹5-8 LPA",
            "avgSalarySenior", "₹22-40 LPA"
        ));

        // Data Scientist
        CAREER_PATHS.put("Data Scientist", Map.of(
            "icon", "📊",
            "description", "Extract insights from data using ML and statistical analysis",
            "triggers", List.of("python", "machine learning", "deep learning", "tensorflow", "pytorch", "data", "ml", "ai"),
            "degreeTriggers", List.of("b.tech", "b.sc", "statistics", "mathematics", "data science"),
            "steps", List.of(
                step("Python & Statistics", "Python programming, NumPy, Pandas, basic statistics",
                    List.of("python", "sql"), "₹0", "0-4 months", "FOUNDATION"),
                step("Data Analysis & Visualization", "Matplotlib, Seaborn, EDA, data cleaning",
                    List.of("python", "sql", "excel"), "₹0", "2-5 months", "FOUNDATION"),
                step("Machine Learning Basics", "Scikit-learn, regression, classification, clustering",
                    List.of("machine learning", "python"), "₹4-7 LPA", "4-8 months", "JUNIOR"),
                step("Deep Learning", "TensorFlow/PyTorch, neural networks, CNNs, NLP basics",
                    List.of("tensorflow", "pytorch", "deep learning"), "₹6-10 LPA", "6-12 months", "JUNIOR"),
                step("Junior Data Scientist", "First job — work on real datasets, model deployment",
                    List.of("mlflow", "docker", "aws"), "₹6-12 LPA", "1-2 years", "JUNIOR"),
                step("Data Scientist", "Advanced ML, A/B testing, feature engineering, production models",
                    List.of("spark", "airflow", "mlops"), "₹12-22 LPA", "2-5 years", "MID"),
                step("Senior Data Scientist", "Research, novel model development, cross-team impact",
                    List.of("research", "llm", "generative ai"), "₹22-45 LPA", "5+ years", "SENIOR")
            ),
            "trendingSkills", List.of("LLMs", "Generative AI", "MLOps", "Apache Spark", "Hugging Face", "Vector DBs"),
            "avgSalaryFresher", "₹6-10 LPA",
            "avgSalarySenior", "₹25-50 LPA"
        ));

        // DevOps Engineer
        CAREER_PATHS.put("DevOps Engineer", Map.of(
            "icon", "🚀",
            "description", "Automate infrastructure, CI/CD pipelines, and cloud operations",
            "triggers", List.of("docker", "kubernetes", "aws", "linux", "devops", "jenkins", "ci/cd"),
            "degreeTriggers", List.of("b.tech", "bca", "computer science", "information technology"),
            "steps", List.of(
                step("Linux & Networking", "Linux commands, shell scripting, networking basics",
                    List.of("linux", "bash"), "₹0", "0-4 months", "FOUNDATION"),
                step("Version Control & CI/CD", "Git, Jenkins/GitHub Actions, automated testing pipelines",
                    List.of("git", "jenkins"), "₹0", "2-5 months", "FOUNDATION"),
                step("Containerization", "Docker, Docker Compose, container orchestration concepts",
                    List.of("docker"), "₹4-7 LPA", "3-6 months", "JUNIOR"),
                step("Cloud Platforms", "AWS/Azure/GCP fundamentals, EC2, S3, IAM, VPC",
                    List.of("aws"), "₹5-9 LPA", "4-8 months", "JUNIOR"),
                step("Junior DevOps Engineer", "First job — manage deployments, monitor systems",
                    List.of("kubernetes", "terraform"), "₹5-10 LPA", "1-2 years", "JUNIOR"),
                step("DevOps Engineer", "Kubernetes, Terraform, monitoring (Prometheus/Grafana), security",
                    List.of("kubernetes", "terraform", "prometheus"), "₹10-20 LPA", "2-5 years", "MID"),
                step("Senior DevOps / SRE", "Platform engineering, reliability, cost optimization",
                    List.of("sre", "platform engineering"), "₹20-40 LPA", "5+ years", "SENIOR")
            ),
            "trendingSkills", List.of("Kubernetes", "Terraform", "GitOps", "eBPF", "Platform Engineering", "ArgoCD"),
            "avgSalaryFresher", "₹5-8 LPA",
            "avgSalarySenior", "₹20-40 LPA"
        ));

        // Android Developer
        CAREER_PATHS.put("Android Developer", Map.of(
            "icon", "📱",
            "description", "Build native Android applications for mobile devices",
            "triggers", List.of("android", "kotlin", "java", "mobile", "flutter", "dart"),
            "degreeTriggers", List.of("b.tech", "bca", "computer science"),
            "steps", List.of(
                step("Java / Kotlin Basics", "OOP, Kotlin syntax, Android Studio setup",
                    List.of("java", "kotlin"), "₹0", "0-4 months", "FOUNDATION"),
                step("Android Fundamentals", "Activities, Fragments, Layouts, RecyclerView",
                    List.of("android"), "₹0", "3-6 months", "FOUNDATION"),
                step("APIs & Data", "Retrofit, Room DB, LiveData, ViewModel (MVVM)",
                    List.of("kotlin", "android"), "₹3-6 LPA", "4-8 months", "JUNIOR"),
                step("Junior Android Developer", "First job — build and ship real apps",
                    List.of("firebase", "git"), "₹4-8 LPA", "1-2 years", "JUNIOR"),
                step("Android Developer", "Jetpack Compose, performance, Play Store publishing",
                    List.of("kotlin", "jetpack compose"), "₹8-16 LPA", "2-4 years", "MID"),
                step("Senior Android Developer", "Architecture, SDK development, team leadership",
                    List.of("kotlin", "architecture"), "₹16-30 LPA", "4+ years", "SENIOR")
            ),
            "trendingSkills", List.of("Jetpack Compose", "Kotlin Coroutines", "KMM", "Flutter", "Firebase", "ML Kit"),
            "avgSalaryFresher", "₹4-7 LPA",
            "avgSalarySenior", "₹18-32 LPA"
        ));

        // UI/UX Designer
        CAREER_PATHS.put("UI/UX Designer", Map.of(
            "icon", "✏️",
            "description", "Design user interfaces and experiences for digital products",
            "triggers", List.of("figma", "design", "ui", "ux", "photoshop", "illustrator"),
            "degreeTriggers", List.of("b.des", "b.sc", "bca", "design", "fine arts"),
            "steps", List.of(
                step("Design Fundamentals", "Color theory, typography, layout, visual hierarchy",
                    List.of("figma", "photoshop"), "₹0", "0-3 months", "FOUNDATION"),
                step("UI Design Tools", "Figma, Adobe XD — wireframes, mockups, prototypes",
                    List.of("figma"), "₹0", "2-5 months", "FOUNDATION"),
                step("UX Research", "User research, personas, user journeys, usability testing",
                    List.of("figma"), "₹3-5 LPA", "3-6 months", "JUNIOR"),
                step("Junior UI/UX Designer", "First job — design real product screens, collaborate with devs",
                    List.of("figma", "prototyping"), "₹3-6 LPA", "1-2 years", "JUNIOR"),
                step("UI/UX Designer", "Design systems, component libraries, A/B testing",
                    List.of("design system", "figma"), "₹6-14 LPA", "2-4 years", "MID"),
                step("Senior Designer / Design Lead", "Lead design strategy, mentor designers, product thinking",
                    List.of("leadership", "product design"), "₹14-28 LPA", "4+ years", "SENIOR")
            ),
            "trendingSkills", List.of("Figma AI", "Motion Design", "3D Design", "Design Systems", "Framer", "Spline"),
            "avgSalaryFresher", "₹3-5 LPA",
            "avgSalarySenior", "₹15-28 LPA"
        ));

        // Cybersecurity
        CAREER_PATHS.put("Cybersecurity Analyst", Map.of(
            "icon", "🔒",
            "description", "Protect systems and networks from cyber threats",
            "triggers", List.of("security", "cybersecurity", "ethical hacking", "linux", "networking"),
            "degreeTriggers", List.of("b.tech", "bca", "computer science", "information technology"),
            "steps", List.of(
                step("Networking & Linux", "TCP/IP, OSI model, Linux administration, firewalls",
                    List.of("linux", "networking"), "₹0", "0-4 months", "FOUNDATION"),
                step("Security Fundamentals", "CIA triad, encryption, authentication, OWASP Top 10",
                    List.of("security"), "₹0", "2-5 months", "FOUNDATION"),
                step("Ethical Hacking Basics", "Kali Linux, Nmap, Metasploit, vulnerability scanning",
                    List.of("linux", "security"), "₹4-7 LPA", "4-8 months", "JUNIOR"),
                step("Certifications", "CompTIA Security+, CEH, or eJPT certification",
                    List.of("security"), "₹5-9 LPA", "6-12 months", "JUNIOR"),
                step("Junior Security Analyst", "SOC analyst, incident response, log analysis",
                    List.of("siem", "splunk"), "₹5-10 LPA", "1-2 years", "JUNIOR"),
                step("Security Engineer", "Penetration testing, red team/blue team, cloud security",
                    List.of("aws security", "pentest"), "₹10-22 LPA", "2-5 years", "MID"),
                step("Senior Security Engineer", "Security architecture, threat modeling, CISO track",
                    List.of("architecture", "compliance"), "₹22-45 LPA", "5+ years", "SENIOR")
            ),
            "trendingSkills", List.of("Cloud Security", "Zero Trust", "SIEM", "Threat Intelligence", "Bug Bounty", "SOAR"),
            "avgSalaryFresher", "₹5-8 LPA",
            "avgSalarySenior", "₹22-45 LPA"
        ));
    }

    private static Map<String, Object> step(String title, String description,
                                             List<String> skillsNeeded, String salaryRange,
                                             String duration, String level) {
        Map<String, Object> s = new LinkedHashMap<>();
        s.put("title", title);
        s.put("description", description);
        s.put("skillsNeeded", skillsNeeded);
        s.put("salaryRange", salaryRange);
        s.put("duration", duration);
        s.put("level", level);
        return s;
    }

    // ── Main Method ────────────────────────────────────────────────────────
    public Map<String, Object> getRoadmap(String email, String targetRole) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepository.findByUserId(user.getId()).orElse(null);
        List<String> userSkills = skillRepository.findByUserId(user.getId())
                .stream().map(s -> s.getSkillName().toLowerCase()).collect(Collectors.toList());

        // Determine which career path to show
        String resolvedRole = resolveCareerPath(targetRole, profile, userSkills);
        Map<String, Object> path = CAREER_PATHS.get(resolvedRole);

        if (path == null) {
            resolvedRole = "Full Stack Developer";
            path = CAREER_PATHS.get(resolvedRole);
        }

        // Enrich steps with user's current skill status
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> rawSteps = (List<Map<String, Object>>) path.get("steps");
        List<Map<String, Object>> enrichedSteps = enrichSteps(rawSteps, userSkills);

        // Determine current step index
        int currentStep = detectCurrentStep(enrichedSteps, userSkills);

        // Skill gap — all skills needed across remaining steps that user doesn't have
        List<String> allNeeded = rawSteps.stream()
                .flatMap(s -> ((List<String>) s.get("skillsNeeded")).stream())
                .distinct()
                .filter(sk -> !userSkills.contains(sk.toLowerCase()))
                .collect(Collectors.toList());

        // All available career paths for switching
        List<Map<String, Object>> allPaths = CAREER_PATHS.entrySet().stream()
                .map(e -> Map.<String, Object>of(
                        "name", e.getKey(),
                        "icon", e.getValue().get("icon"),
                        "description", e.getValue().get("description"),
                        "avgSalaryFresher", e.getValue().get("avgSalaryFresher"),
                        "avgSalarySenior", e.getValue().get("avgSalarySenior")
                ))
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("role",            resolvedRole);
        result.put("icon",            path.get("icon"));
        result.put("description",     path.get("description"));
        result.put("steps",           enrichedSteps);
        result.put("currentStep",     currentStep);
        result.put("skillGap",        allNeeded);
        result.put("userSkills",      userSkills);
        result.put("trendingSkills",  path.get("trendingSkills"));
        result.put("avgSalaryFresher",path.get("avgSalaryFresher"));
        result.put("avgSalarySenior", path.get("avgSalarySenior"));
        result.put("allPaths",        allPaths);
        result.put("profileComplete", profile != null);
        return result;
    }

    private String resolveCareerPath(String targetRole, UserProfile profile, List<String> userSkills) {
        // If user explicitly chose a role
        if (targetRole != null && !targetRole.isBlank() && CAREER_PATHS.containsKey(targetRole))
            return targetRole;

        // Score each path by skill match
        String bestPath = "Full Stack Developer";
        int bestScore = -1;

        for (Map.Entry<String, Map<String, Object>> entry : CAREER_PATHS.entrySet()) {
            @SuppressWarnings("unchecked")
            List<String> triggers = (List<String>) entry.getValue().get("triggers");
            @SuppressWarnings("unchecked")
            List<String> degreeTriggers = (List<String>) entry.getValue().get("degreeTriggers");

            int score = 0;
            for (String skill : userSkills)
                if (triggers.contains(skill.toLowerCase())) score += 3;

            if (profile != null) {
                String degree = (profile.getGraduationDegree() != null ? profile.getGraduationDegree() : "").toLowerCase();
                String branch = (profile.getGraduationBranch() != null ? profile.getGraduationBranch() : "").toLowerCase();
                for (String dt : degreeTriggers)
                    if (degree.contains(dt) || branch.contains(dt)) score += 2;
            }

            if (score > bestScore) { bestScore = score; bestPath = entry.getKey(); }
        }
        return bestPath;
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> enrichSteps(List<Map<String, Object>> steps, List<String> userSkills) {
        return steps.stream().map(step -> {
            Map<String, Object> enriched = new LinkedHashMap<>(step);
            List<String> needed = (List<String>) step.get("skillsNeeded");
            List<String> have   = needed.stream().filter(sk -> userSkills.contains(sk.toLowerCase())).collect(Collectors.toList());
            List<String> missing = needed.stream().filter(sk -> !userSkills.contains(sk.toLowerCase())).collect(Collectors.toList());
            int pct = needed.isEmpty() ? 100 : (int) Math.round((have.size() / (double) needed.size()) * 100);
            enriched.put("skillsHave",    have);
            enriched.put("skillsMissing", missing);
            enriched.put("completionPct", pct);
            return enriched;
        }).collect(Collectors.toList());
    }

    @SuppressWarnings("unchecked")
    private int detectCurrentStep(List<Map<String, Object>> steps, List<String> userSkills) {
        for (int i = steps.size() - 1; i >= 0; i--) {
            int pct = (int) steps.get(i).get("completionPct");
            if (pct >= 50) return i;
        }
        return 0;
    }
}
