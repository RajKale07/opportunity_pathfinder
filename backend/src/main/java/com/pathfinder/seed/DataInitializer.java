package com.pathfinder.seed;

import com.pathfinder.auth.Role;
import com.pathfinder.auth.User;
import com.pathfinder.auth.UserRepository;
import com.pathfinder.career.CareerPath;
import com.pathfinder.career.CareerPathRepository;
import com.pathfinder.career.CareerPathSkill;
import com.pathfinder.career.CareerPathSkillRepository;
import com.pathfinder.digitaltwin.DigitalTwinEngine;
import com.pathfinder.interview.InterviewQuestion;
import com.pathfinder.interview.InterviewQuestionRepository;
import com.pathfinder.opportunity.Opportunity;
import com.pathfinder.opportunity.OpportunityRepository;
import com.pathfinder.opportunity.OpportunitySkill;
import com.pathfinder.opportunity.OpportunitySkillRepository;
import com.pathfinder.profile.*;
import com.pathfinder.skills.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SkillRepository skillRepository;
    private final SkillPrerequisiteRepository prerequisiteRepository;
    private final CareerPathRepository careerPathRepository;
    private final CareerPathSkillRepository careerPathSkillRepository;
    private final StudentProfileRepository profileRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final ProjectRepository projectRepository;
    private final CareerGoalRepository careerGoalRepository;
    private final OpportunityRepository opportunityRepository;
    private final OpportunitySkillRepository opportunitySkillRepository;
    private final InterviewQuestionRepository questionRepository;
    private final DigitalTwinEngine digitalTwinEngine;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already initialized with seed data.");
            return;
        }

        log.info("Initializing Opportunity Pathfinder baseline skills, career paths, and demo student...");

        // 1. Seed Skills
        Map<String, Skill> skills = seedSkills();

        // 2. Seed Prerequisites
        seedPrerequisites(skills);

        // 3. Seed Career Paths
        Map<String, CareerPath> careerPaths = seedCareerPaths(skills);

        // 4. Seed Opportunities
        seedOpportunities(skills);

        // 5. Seed Interview Questions
        seedInterviewQuestions(skills);

        // 6. Seed Demo Student (as defined in Section 42)
        seedDemoStudent(skills, careerPaths);

        log.info("Opportunity Pathfinder initialization complete.");
    }

    private Map<String, Skill> seedSkills() {
        Map<String, Skill> map = new HashMap<>();
        map.put("Java", saveSkill("Java", Skill.Category.PROGRAMMING_LANGUAGE, "Core Java, OOP, Collections, Multithreading, Generics", 3));
        map.put("Python", saveSkill("Python", Skill.Category.PROGRAMMING_LANGUAGE, "Python 3, Functional programming, Data structures, Standard library", 2));
        map.put("C++", saveSkill("C++", Skill.Category.PROGRAMMING_LANGUAGE, "C++17, STL, Pointers, Memory management", 4));
        map.put("Spring Boot", saveSkill("Spring Boot", Skill.Category.FRAMEWORK, "Spring Web, Dependency Injection, Auto-configuration, Actuator", 3));
        map.put("SQL", saveSkill("SQL", Skill.Category.DATABASE, "Relational modeling, Joins, Group By, Subqueries, Indexing", 3));
        map.put("PostgreSQL", saveSkill("PostgreSQL", Skill.Category.DATABASE, "ACID transactions, JSONB, CTEs, Execution plans", 3));
        map.put("System Design", saveSkill("System Design", Skill.Category.SYSTEM_DESIGN, "Scalability, Caching, Load balancing, Partitioning, CAP theorem", 4));
        map.put("DSA", saveSkill("DSA", Skill.Category.DATA_STRUCTURES_ALGORITHMS, "Arrays, Trees, Graphs, Dynamic Programming, Complexity analysis", 4));
        map.put("Git", saveSkill("Git", Skill.Category.DEVOPS, "Branching, Rebasing, Conflict resolution, CI triggers", 2));
        map.put("Docker", saveSkill("Docker", Skill.Category.DEVOPS, "Containerization, Dockerfile multi-stage builds, Compose", 3));
        map.put("REST APIs", saveSkill("REST APIs", Skill.Category.FRAMEWORK, "HTTP verbs, Status codes, Idempotency, OpenAPI specification", 2));
        return map;
    }

    private Skill saveSkill(String name, Skill.Category cat, String desc, int diff) {
        return skillRepository.save(Skill.builder().name(name).category(cat).description(desc).difficultyLevel(diff).build());
    }

    private void seedPrerequisites(Map<String, Skill> s) {
        prerequisiteRepository.save(SkillPrerequisite.builder().skill(s.get("Spring Boot")).prerequisiteSkill(s.get("Java")).minRequiredProficiency(60.0).type(SkillPrerequisite.PrerequisiteType.MANDATORY).build());
        prerequisiteRepository.save(SkillPrerequisite.builder().skill(s.get("Spring Boot")).prerequisiteSkill(s.get("REST APIs")).minRequiredProficiency(50.0).type(SkillPrerequisite.PrerequisiteType.RECOMMENDED).build());
        prerequisiteRepository.save(SkillPrerequisite.builder().skill(s.get("PostgreSQL")).prerequisiteSkill(s.get("SQL")).minRequiredProficiency(65.0).type(SkillPrerequisite.PrerequisiteType.MANDATORY).build());
        prerequisiteRepository.save(SkillPrerequisite.builder().skill(s.get("System Design")).prerequisiteSkill(s.get("DSA")).minRequiredProficiency(55.0).type(SkillPrerequisite.PrerequisiteType.MANDATORY).build());
    }

    private Map<String, CareerPath> seedCareerPaths(Map<String, Skill> s) {
        Map<String, CareerPath> map = new HashMap<>();

        // Backend Developer
        CareerPath backend = careerPathRepository.save(CareerPath.builder()
                .title("Backend Developer")
                .domain("Software Engineering")
                .description("Design, build, and maintain high-performance server-side architectures, REST APIs, and transactional databases.")
                .avgSalaryRange("$85,000 - $130,000")
                .growthOutlook("High (+22% YoY)")
                .build());
        addPathSkill(backend, s.get("Java"), 80.0, 1.5, true);
        addPathSkill(backend, s.get("Spring Boot"), 75.0, 1.5, true);
        addPathSkill(backend, s.get("SQL"), 70.0, 1.2, true);
        addPathSkill(backend, s.get("Git"), 65.0, 0.8, true);
        addPathSkill(backend, s.get("System Design"), 60.0, 1.0, true);
        addPathSkill(backend, s.get("Docker"), 55.0, 0.8, false);
        map.put("Backend Developer", backend);

        // Data Engineer
        CareerPath dataEng = careerPathRepository.save(CareerPath.builder()
                .title("Data Engineer")
                .domain("Data Systems")
                .description("Architect scalable data pipelines, streaming architectures, and analytics infrastructure.")
                .avgSalaryRange("$90,000 - $140,000")
                .growthOutlook("Very High (+28% YoY)")
                .build());
        addPathSkill(dataEng, s.get("Python"), 80.0, 1.5, true);
        addPathSkill(dataEng, s.get("SQL"), 85.0, 1.5, true);
        addPathSkill(dataEng, s.get("PostgreSQL"), 75.0, 1.2, true);
        addPathSkill(dataEng, s.get("Docker"), 65.0, 1.0, false);
        map.put("Data Engineer", dataEng);

        // ML Engineer
        CareerPath mlEng = careerPathRepository.save(CareerPath.builder()
                .title("ML Engineer")
                .domain("Artificial Intelligence")
                .description("Build production machine learning pipelines, model serving microservices, and neural inference systems.")
                .avgSalaryRange("$105,000 - $160,000")
                .growthOutlook("Exceptional (+36% YoY)")
                .build());
        addPathSkill(mlEng, s.get("Python"), 90.0, 1.5, true);
        addPathSkill(mlEng, s.get("DSA"), 75.0, 1.2, true);
        addPathSkill(mlEng, s.get("SQL"), 65.0, 1.0, false);
        addPathSkill(mlEng, s.get("Docker"), 70.0, 1.0, false);
        map.put("ML Engineer", mlEng);

        return map;
    }

    private void addPathSkill(CareerPath p, Skill s, double target, double weight, boolean isCore) {
        careerPathSkillRepository.save(CareerPathSkill.builder()
                .careerPath(p)
                .skill(s)
                .targetProficiency(target)
                .weight(weight)
                .isCore(isCore)
                .build());
    }

    private void seedOpportunities(Map<String, Skill> s) {
        Opportunity o1 = opportunityRepository.save(Opportunity.builder()
                .title("Backend Engineering Intern")
                .company("Stripe")
                .type(Opportunity.OpportunityType.INTERNSHIP)
                .domain("Backend Systems")
                .location("San Francisco, CA / Remote")
                .remote(true)
                .compensation("$52/hour + Housing Stipend")
                .deadline(Instant.now().plus(45, ChronoUnit.DAYS))
                .description("Join Stripe Payments Core to design scalable idempotent transaction workflows handling billions in global volume.")
                .build());
        addOppSkill(o1, s.get("Java"), true, 65.0);
        addOppSkill(o1, s.get("Spring Boot"), true, 60.0);
        addOppSkill(o1, s.get("SQL"), true, 65.0);
        addOppSkill(o1, s.get("Git"), true, 60.0);
        addOppSkill(o1, s.get("Docker"), false, 50.0);

        Opportunity o2 = opportunityRepository.save(Opportunity.builder()
                .title("Junior Infrastructure & Backend Associate")
                .company("Datadog")
                .type(Opportunity.OpportunityType.FULL_TIME)
                .domain("Cloud Infrastructure")
                .location("New York, NY / Remote")
                .remote(true)
                .compensation("$95,000 - $115,000")
                .deadline(Instant.now().plus(60, ChronoUnit.DAYS))
                .description("Scale telemetry ingestion pipelines handling petabytes of live distributed tracing data.")
                .build());
        addOppSkill(o2, s.get("Java"), true, 70.0);
        addOppSkill(o2, s.get("SQL"), true, 70.0);
        addOppSkill(o2, s.get("System Design"), true, 55.0);
        addOppSkill(o2, s.get("Docker"), true, 60.0);

        Opportunity o3 = opportunityRepository.save(Opportunity.builder()
                .title("Research Fellow in Distributed Systems")
                .company("Berkeley RISELab")
                .type(Opportunity.OpportunityType.RESEARCH)
                .domain("Systems Research")
                .location("Berkeley, CA")
                .remote(false)
                .compensation("$38,000 Annual Stipend")
                .deadline(Instant.now().plus(90, ChronoUnit.DAYS))
                .description("Conduct open-source systems research on distributed consensus algorithms and fault-tolerant storage.")
                .build());
        addOppSkill(o3, s.get("C++"), true, 70.0);
        addOppSkill(o3, s.get("DSA"), true, 75.0);
        addOppSkill(o3, s.get("System Design"), true, 60.0);
    }

    private void addOppSkill(Opportunity o, Skill s, boolean required, double minProf) {
        opportunitySkillRepository.save(OpportunitySkill.builder()
                .opportunity(o)
                .skill(s)
                .isRequired(required)
                .minProficiency(minProf)
                .build());
    }

    private void seedInterviewQuestions(Map<String, Skill> s) {
        questionRepository.save(InterviewQuestion.builder()
                .questionText("Explain how the Spring Boot @Transactional annotation works and describe when a transaction might silently fail to roll back.")
                .type(InterviewQuestion.QuestionType.TECHNICAL)
                .targetSkill(s.get("Spring Boot"))
                .difficulty(3)
                .sampleAnswerGuideline("Discuss proxy interception (CGLIB/JDK dynamic proxies), self-invocation bypassing proxy, and unchecked vs checked exception rollback rules.")
                .build());

        questionRepository.save(InterviewQuestion.builder()
                .questionText("Explain the difference between INNER JOIN, LEFT JOIN, and CROSS JOIN. How do database B-Tree indexes accelerate join performance?")
                .type(InterviewQuestion.QuestionType.TECHNICAL)
                .targetSkill(s.get("SQL"))
                .difficulty(3)
                .sampleAnswerGuideline("Explain matching criteria, handling of null non-matches, Cartesian product, and index lookups avoiding full-table scans.")
                .build());

        questionRepository.save(InterviewQuestion.builder()
                .questionText("Design an idempotent payment processing API endpoint. How do you prevent double charging when network timeouts occur?")
                .type(InterviewQuestion.QuestionType.SYSTEM_DESIGN)
                .targetSkill(s.get("System Design"))
                .difficulty(4)
                .sampleAnswerGuideline("Explain client-generated idempotency keys, atomic distributed locks/database unique constraints, and transaction status caching.")
                .build());
    }

    private void seedDemoStudent(Map<String, Skill> s, Map<String, CareerPath> paths) {
        User studentUser = userRepository.save(User.builder()
                .email("student@example.com")
                .fullName("Alex Chen")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(Role.ROLE_STUDENT)
                .build());

        // Admin User
        userRepository.save(User.builder()
                .email("admin@pathfinder.ai")
                .fullName("System Administrator")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(Role.ROLE_ADMIN)
                .build());

        // Researcher User
        userRepository.save(User.builder()
                .email("researcher@pathfinder.ai")
                .fullName("Dr. Elena Vance")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(Role.ROLE_RESEARCHER)
                .build());

        StudentProfile profile = profileRepository.save(StudentProfile.builder()
                .user(studentUser)
                .headline("Computer Science Student | Aspiring Backend Architect")
                .biography("Junior studying Computer Science with passion for distributed architectures, clean database design, and microservices.")
                .currentDegree("B.S. in Computer Science")
                .major("Computer Science")
                .institution("State University")
                .graduationYear(2027)
                .gpa(3.72)
                .preferredDomain("Backend Development")
                .targetRole("Backend Developer")
                .preferredLocations("Remote, San Francisco, New York")
                .remotePreference("HYBRID")
                .weeklyAvailableHours(18)
                .higherStudyInterest(false)
                .startupInterest(true)
                .salaryExpectationMin(90000.0)
                .salaryExpectationMax(120000.0)
                .githubUrl("https://github.com/alexchen-dev")
                .linkedinUrl("https://linkedin.com/in/alexchen-dev")
                .portfolioUrl("https://alexchen.dev")
                .resumeText("Education: B.S. Computer Science. Technical Skills: Java, Python, C++, SQL, Git, REST APIs. Projects: Distributed Queue, Task Manager.")
                .build());

        // Skills from Section 42:
        // C++: 70, Python: 72, Java: 45, SQL: 65, DSA: 55, Spring Boot: 25
        saveStudentSkill(profile, s.get("C++"), 70.0, 75.0);
        saveStudentSkill(profile, s.get("Python"), 72.0, 75.0);
        saveStudentSkill(profile, s.get("Java"), 45.0, 50.0);
        saveStudentSkill(profile, s.get("SQL"), 65.0, 65.0);
        saveStudentSkill(profile, s.get("DSA"), 55.0, 60.0);
        saveStudentSkill(profile, s.get("Spring Boot"), 25.0, 30.0);
        saveStudentSkill(profile, s.get("Git"), 75.0, 80.0);

        // Projects
        projectRepository.save(Project.builder()
                .studentProfile(profile)
                .title("Distributed Task Queue")
                .description("Lightweight in-memory task broker supporting worker heartbeats, retry backoffs, and concurrent execution.")
                .techStack("Java, ThreadPoolExecutor, REST APIs")
                .repoUrl("https://github.com/alexchen-dev/distributed-task-queue")
                .complexityScore(7)
                .completedAt(Instant.now().minus(30, ChronoUnit.DAYS))
                .build());

        projectRepository.save(Project.builder()
                .studentProfile(profile)
                .title("Inventory Management REST Service")
                .description("CRUD service with relational database schema, JWT auth tokens, and unit test suites.")
                .techStack("Python, Flask, PostgreSQL")
                .repoUrl("https://github.com/alexchen-dev/inventory-service")
                .complexityScore(6)
                .completedAt(Instant.now().minus(60, ChronoUnit.DAYS))
                .build());

        projectRepository.save(Project.builder()
                .studentProfile(profile)
                .title("Graph Pathfinding Visualizer")
                .description("Interactive visualizer for Dijkstra and A* search algorithms with performance profiling.")
                .techStack("C++, SFML, Algorithms")
                .repoUrl("https://github.com/alexchen-dev/pathfinding-visualizer")
                .complexityScore(6)
                .completedAt(Instant.now().minus(90, ChronoUnit.DAYS))
                .build());

        // Career Goals
        careerGoalRepository.save(CareerGoal.builder()
                .studentProfile(profile)
                .targetRole("Backend Developer")
                .careerDomain("Software Engineering")
                .priorityLevel(CareerGoal.PriorityLevel.PRIMARY)
                .timeframeMonths(12)
                .status(CareerGoal.GoalStatus.ACTIVE)
                .build());

        careerGoalRepository.save(CareerGoal.builder()
                .studentProfile(profile)
                .targetRole("Data Engineer")
                .careerDomain("Data Systems")
                .priorityLevel(CareerGoal.PriorityLevel.ALTERNATIVE)
                .timeframeMonths(18)
                .status(CareerGoal.GoalStatus.ACTIVE)
                .build());

        careerGoalRepository.save(CareerGoal.builder()
                .studentProfile(profile)
                .targetRole("ML Engineer")
                .careerDomain("Artificial Intelligence")
                .priorityLevel(CareerGoal.PriorityLevel.EXPLORATION)
                .timeframeMonths(24)
                .status(CareerGoal.GoalStatus.ACTIVE)
                .build());

        // Initialize Digital Twin Version 1
        digitalTwinEngine.recordSnapshot(profile, "INITIAL_PROVISIONING",
                "Created initial student digital twin v1 based on academic background and baseline skills.");
    }

    private void saveStudentSkill(StudentProfile profile, Skill skill, double prof, double conf) {
        studentSkillRepository.save(StudentSkill.builder()
                .studentProfile(profile)
                .skill(skill)
                .proficiency(prof)
                .confidenceScore(conf)
                .isVerified(true)
                .evidenceCount(2)
                .lastAssessedAt(Instant.now().minus(14, ChronoUnit.DAYS))
                .build());
    }
}
