package com.opportunitypathfinder.ocr;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.io.File;
import java.util.*;
import java.util.regex.*;

@Component
public class OCREngine {

    @Value("${tesseract.data-path}")
    private String tessDataPath;

    @Value("${tesseract.language}")
    private String language;

    private static final List<String> SKILL_KEYWORDS = Arrays.asList(
        "java", "python", "javascript", "typescript", "react", "angular", "vue", "spring", "springboot",
        "node", "nodejs", "express", "mysql", "postgresql", "mongodb", "redis", "docker", "kubernetes",
        "aws", "git", "html", "css", "tailwind", "bootstrap", "c++", "c#", "kotlin", "swift",
        "flutter", "dart", "machine learning", "deep learning", "tensorflow", "pytorch", "sql",
        "linux", "rest api", "microservices", "hibernate", "jpa", "maven", "gradle", "jenkins",
        "figma", "photoshop", "excel", "powerpoint", "word", "php", "ruby", "scala", "go", "rust",
        "android", "ios", "firebase", "graphql", "selenium", "junit", "postman", "jira"
    );

    public String extractText(File file) {
        Tesseract tesseract = new Tesseract();
        tesseract.setDatapath(tessDataPath);
        tesseract.setLanguage(language);
        // Better OCR mode for documents
        tesseract.setPageSegMode(1);
        tesseract.setOcrEngineMode(1);
        try {
            return tesseract.doOCR(file);
        } catch (TesseractException e) {
            return "OCR_FAILED: " + e.getMessage();
        }
    }

    public Map<String, Object> parseExtractedText(String text) {
        Map<String, Object> result = new HashMap<>();
        if (text == null || text.isBlank()) {
            result.put("docType", "OTHER");
            result.put("skills", new ArrayList<>());
            result.put("grades", new ArrayList<>());
            return result;
        }

        String lower = text.toLowerCase();

        // Email
        Matcher emailMatcher = Pattern.compile("[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}").matcher(text);
        result.put("email", emailMatcher.find() ? emailMatcher.group() : null);

        // Phone — Indian formats
        Matcher phoneMatcher = Pattern.compile("(\\+91[\\-\\s]?)?[6-9]\\d{9}").matcher(text.replaceAll("\\s", ""));
        result.put("phone", phoneMatcher.find() ? phoneMatcher.group() : null);

        // Grades — percentage and CGPA
        List<String> grades = new ArrayList<>();
        Matcher percentMatcher = Pattern.compile("(\\d{1,3}\\.?\\d{0,2})\\s*%").matcher(text);
        while (percentMatcher.find()) grades.add(percentMatcher.group().trim());
        Matcher cgpaMatcher = Pattern.compile("(\\d\\.\\d{1,2})\\s*(cgpa|gpa|cpi|sgpa)", Pattern.CASE_INSENSITIVE).matcher(text);
        while (cgpaMatcher.find()) grades.add(cgpaMatcher.group().trim());
        result.put("grades", grades);

        // Skills
        List<String> foundSkills = new ArrayList<>();
        for (String skill : SKILL_KEYWORDS) {
            if (lower.contains(skill)) foundSkills.add(skill);
        }
        result.put("skills", foundSkills);

        // Name — first line heuristic
        String[] lines = text.split("\\n");
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.length() > 3 && trimmed.length() < 40
                    && trimmed.matches("[A-Za-z ]+")
                    && !trimmed.toLowerCase().contains("resume")
                    && !trimmed.toLowerCase().contains("certificate")) {
                result.put("name", trimmed);
                break;
            }
        }

        // Aadhaar specific
        if (lower.contains("aadhaar") || lower.contains("aadhar") || lower.contains("uidai") || lower.contains("unique identification")) {
            // UID number — 12 digits in groups of 4
            Matcher uidMatcher = Pattern.compile("\\d{4}\\s\\d{4}\\s\\d{4}").matcher(text);
            result.put("aadhaarNumber", uidMatcher.find() ? uidMatcher.group() : null);
            // DOB
            Matcher dobMatcher = Pattern.compile("(\\d{2}/\\d{2}/\\d{4}|\\d{2}-\\d{2}-\\d{4})").matcher(text);
            result.put("dob", dobMatcher.find() ? dobMatcher.group() : null);
            // Gender
            if (lower.contains("male")) result.put("gender", lower.contains("female") ? "Female" : "Male");
            else result.put("gender", null);
        }

        // Income / Salary specific
        if (lower.contains("income") || lower.contains("salary") || lower.contains("earnings")) {
            Matcher incomeMatcher = Pattern.compile("(rs\\.?|inr|₹)\\s?[\\d,]+", Pattern.CASE_INSENSITIVE).matcher(text);
            result.put("incomeAmount", incomeMatcher.find() ? incomeMatcher.group() : null);
        }

        // Certificate specific — issuer and cert name
        if (lower.contains("certificate") || lower.contains("certified") || lower.contains("completion")) {
            // Try to find issuer line (line containing "by" or "from" or "issued")
            for (String line : text.split("\\n")) {
                String t = line.trim();
                if (t.toLowerCase().matches(".*(issued by|certified by|offered by|from|by).*") && t.length() < 80) {
                    result.put("certIssuer", t);
                    break;
                }
            }
        }

        // Doc type detection
        String docType = "OTHER";
        if (lower.contains("marksheet") || lower.contains("mark sheet") || lower.contains("marks obtained")
                || lower.contains("examination") || lower.contains("board of") || lower.contains("university"))
            docType = "MARKSHEET";
        else if (lower.contains("certificate of") || lower.contains("certified that") || lower.contains("completion")
                || lower.contains("participation") || lower.contains("awarded"))
            docType = "CERTIFICATE";
        else if (lower.contains("resume") || lower.contains("curriculum vitae") || lower.contains("objective")
                || lower.contains("experience") || lower.contains("projects") || lower.contains("education"))
            docType = "RESUME";
        else if (lower.contains("aadhaar") || lower.contains("aadhar") || lower.contains("unique identification")
                || lower.contains("uidai"))
            docType = "AADHAAR";
        else if (lower.contains("income") || lower.contains("salary") || lower.contains("annual income")
                || lower.contains("earnings"))
            docType = "INCOME";
        result.put("docType", docType);

        return result;
    }
}
