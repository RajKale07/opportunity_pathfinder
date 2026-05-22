package com.opportunitypathfinder.service;

import com.opportunitypathfinder.model.UserProfile;
import com.opportunitypathfinder.repository.SkillRepository;
import com.opportunitypathfinder.repository.UserProfileRepository;
import com.opportunitypathfinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AIService {

    private static final Logger log = Logger.getLogger(AIService.class.getName());

    private final UserRepository userRepository;
    private final UserProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final RestTemplate restTemplate;

    @Value("${groq.api.key}")
    private String groqApiKey;

    @Value("${groq.api.url}")
    private String groqApiUrl;

    @Value("${groq.model}")
    private String groqModel;

    public Map<String, Object> chat(String email, List<Map<String, String>> messages) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepository.findByUserId(user.getId()).orElse(null);
        List<String> skills = skillRepository.findByUserId(user.getId())
                .stream().map(s -> s.getSkillName()).collect(Collectors.toList());

        // Build system prompt with user context
        String systemPrompt = buildSystemPrompt(user.getName(), profile, skills);

        // Build messages array: system + conversation history
        List<Map<String, String>> groqMessages = new ArrayList<>();
        groqMessages.add(Map.of("role", "system", "content", systemPrompt));
        groqMessages.addAll(messages);

        // Call Groq
        String reply = callGroq(groqMessages);

        Map<String, Object> result = new HashMap<>();
        result.put("reply", reply);
        result.put("model", groqModel);
        return result;
    }

    private String buildSystemPrompt(String name, UserProfile profile, List<String> skills) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are an AI career assistant for Opportunity Pathfinder, an intelligent career and opportunity platform for Indian students and job seekers.\n\n");
        sb.append("You help users with:\n");
        sb.append("- Career guidance and roadmap planning\n");
        sb.append("- Scholarship and government scheme eligibility\n");
        sb.append("- Resume writing and ATS optimization\n");
        sb.append("- Interview preparation and tips\n");
        sb.append("- Skill gap analysis and learning resources\n");
        sb.append("- Job search strategies\n");
        sb.append("- Government schemes like PMKVY, Mudra Loan, Startup India\n\n");

        sb.append("USER PROFILE:\n");
        sb.append("Name: ").append(name).append("\n");

        if (profile != null) {
            if (profile.getGraduationDegree() != null)
                sb.append("Degree: ").append(profile.getGraduationDegree())
                  .append(profile.getGraduationBranch() != null ? " in " + profile.getGraduationBranch() : "").append("\n");
            if (profile.getGraduationCgpa() != null)
                sb.append("CGPA/Percentage: ").append(profile.getGraduationCgpa()).append("\n");
            if (profile.getCity() != null || profile.getState() != null)
                sb.append("Location: ").append(profile.getCity() != null ? profile.getCity() + ", " : "")
                  .append(profile.getState() != null ? profile.getState() : "").append("\n");
            if (profile.getEmploymentStatus() != null)
                sb.append("Employment Status: ").append(profile.getEmploymentStatus()).append("\n");
            if (profile.getExperience() != null)
                sb.append("Experience: ").append(profile.getExperience()).append("\n");
            if (profile.getAnnualIncome() != null)
                sb.append("Annual Income: ").append(profile.getAnnualIncome()).append("\n");
            if (profile.getCategory() != null)
                sb.append("Category: ").append(profile.getCategory()).append("\n");
        }

        if (!skills.isEmpty())
            sb.append("Skills: ").append(String.join(", ", skills)).append("\n");

        sb.append("\nGUIDELINES:\n");
        sb.append("- Always give practical, actionable advice specific to India\n");
        sb.append("- Reference the user's actual profile data when relevant\n");
        sb.append("- Keep responses concise and well-structured\n");
        sb.append("- Use bullet points for lists\n");
        sb.append("- For Indian government schemes, mention official portals\n");
        sb.append("- Be encouraging and supportive\n");
        sb.append("- If asked about salary, give INR figures relevant to India\n");

        return sb.toString();
    }

    @SuppressWarnings("unchecked")
    private String callGroq(List<Map<String, String>> messages) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("model", groqModel);
            body.put("messages", messages);
            body.put("max_tokens", 1024);
            body.put("temperature", 0.7);

            ResponseEntity<Map> response = restTemplate.exchange(
                    groqApiUrl, HttpMethod.POST,
                    new HttpEntity<>(body, headers), Map.class);

            if (response.getBody() == null) return "Sorry, I couldn't get a response. Please try again.";

            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            if (choices == null || choices.isEmpty()) return "No response received.";

            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            return message != null ? (String) message.get("content") : "No content in response.";

        } catch (Exception e) {
            log.severe("Groq API error: " + e.getMessage());
            return "I'm having trouble connecting right now. Please try again in a moment.";
        }
    }
}
