package com.pathfinder.resume;

import com.pathfinder.skills.Skill;
import com.pathfinder.skills.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeAnalyzerService {

    private final SkillRepository skillRepository;

    private static final List<String> ARCHITECTURAL_PATTERNS = List.of(
            "REST API", "Microservices", "MVC", "Event-Driven", "GraphQL", "Caching", "Redis",
            "CI/CD", "Docker", "Kubernetes", "Authentication", "JWT", "OAuth2", "Unit Testing",
            "ORM", "JPA", "Hibernate", "Indexes", "Normalization", "Kafka", "RabbitMQ"
    );

    public ResumeDto.AnalysisResult analyzeText(String text, String targetRole) {
        if (text == null || text.isBlank()) {
            return ResumeDto.AnalysisResult.builder()
                    .wordsAnalyzed(0)
                    .detectedSkills(List.of())
                    .detectedArchitectures(List.of())
                    .missingRecommendedKeywords(List.of("Java", "Spring Boot", "SQL", "Git", "REST APIs"))
                    .keywordDensityScore(0.0)
                    .strengthNarrative("No content provided to analyze.")
                    .improvementRecommendations("Paste your resume or project description to extract verified competencies.")
                    .build();
        }

        String lowerText = text.toLowerCase();
        int wordCount = text.split("\\s+").length;

        // Match against database skills catalog
        List<Skill> catalog = skillRepository.findAll();
        List<String> detectedSkills = catalog.stream()
                .filter(s -> Pattern.compile("\\b" + Pattern.quote(s.getName().toLowerCase()) + "\\b").matcher(lowerText).find())
                .map(Skill::getName)
                .collect(Collectors.toList());

        // Match against architectural keywords
        List<String> detectedArch = ARCHITECTURAL_PATTERNS.stream()
                .filter(p -> lowerText.contains(p.toLowerCase()))
                .collect(Collectors.toList());

        // Target keywords for backend roles
        List<String> targetKeywords = List.of("Java", "Spring Boot", "SQL", "Git", "Docker", "REST API", "PostgreSQL", "System Design");
        List<String> missing = targetKeywords.stream()
                .filter(k -> !detectedSkills.contains(k) && !detectedArch.contains(k))
                .collect(Collectors.toList());

        double density = Math.min(100.0, Math.round(((detectedSkills.size() + detectedArch.size()) * 12.5) * 10.0) / 10.0);

        String narrative = String.format("Found %d verified skill markers and %d architectural patterns across %d words.",
                detectedSkills.size(), detectedArch.size(), wordCount);

        String recommendations = missing.isEmpty() ?
                "Excellent technical coverage. Ensure each skill is supported by quantified project outcomes (e.g. latency reduced by X%)." :
                "Strengthen profile by explicitly citing: " + String.join(", ", missing) + " with measurable implementation details.";

        return ResumeDto.AnalysisResult.builder()
                .wordsAnalyzed(wordCount)
                .detectedSkills(detectedSkills)
                .detectedArchitectures(detectedArch)
                .missingRecommendedKeywords(missing)
                .keywordDensityScore(density)
                .strengthNarrative(narrative)
                .improvementRecommendations(recommendations)
                .build();
    }
}
