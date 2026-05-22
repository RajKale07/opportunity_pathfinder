package com.opportunitypathfinder.service;

import com.opportunitypathfinder.model.Document;
import com.opportunitypathfinder.model.Skill;
import com.opportunitypathfinder.model.User;
import com.opportunitypathfinder.ocr.OCREngine;
import com.opportunitypathfinder.repository.DocumentRepository;
import com.opportunitypathfinder.repository.SkillRepository;
import com.opportunitypathfinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@Service
public class OCRService {

    private final OCREngine ocrEngine;
    private final DocumentRepository documentRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final ProfileService profileService;

    public OCRService(OCREngine ocrEngine, DocumentRepository documentRepository,
                      SkillRepository skillRepository, UserRepository userRepository,
                      @Lazy ProfileService profileService) {
        this.ocrEngine = ocrEngine;
        this.documentRepository = documentRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.profileService = profileService;
    }

    @Value("${file.upload-dir}")
    private String uploadDir;

    public Map<String, Object> saveManualDocument(String email, String docType, String label, Map<String, String> data) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StringBuilder sb = new StringBuilder();
        if (data != null) data.forEach((k, v) -> { if (v != null && !v.isBlank()) sb.append(k).append(": ").append(v).append("\n"); });

        Document doc = new Document();
        doc.setUser(user);
        doc.setFileName(label);
        doc.setFilePath("");
        doc.setDocType(docType);
        doc.setExtractedText(sb.toString());
        documentRepository.save(doc);
        profileService.syncFromDocuments(user);

        Map<String, Object> result = new HashMap<>();
        result.put("id", doc.getId());
        result.put("fileName", label);
        result.put("docType", docType);
        result.put("uploadedAt", doc.getUploadedAt().toString());
        return result;
    }

    public Map<String, Object> processDocument(String email, MultipartFile file, String docType, String label) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Save file with clean label-based name
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);
        String ext = file.getOriginalFilename() != null && file.getOriginalFilename().contains(".")
                ? file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")) : ".jpg";
        String cleanLabel = label != null && !label.isBlank() ? label : docType;
        String fileName = cleanLabel + ext; // e.g. "10th Marksheet.jpg"
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // OCR extraction
        String extractedText = ocrEngine.extractText(filePath.toFile());
        Map<String, Object> parsed = ocrEngine.parseExtractedText(extractedText);

        // Save document
        Document doc = new Document();
        doc.setUser(user);
        doc.setFileName(cleanLabel + ext);
        doc.setFilePath(filePath.toString());
        doc.setDocType(docType != null && !docType.isBlank() ? docType : (String) parsed.get("docType"));
        doc.setExtractedText(extractedText);
        documentRepository.save(doc);
        profileService.syncFromDocuments(user);

        // Save extracted skills
        @SuppressWarnings("unchecked")
        List<String> skills = (List<String>) parsed.get("skills");
        for (String skill : skills) {
            if (!skillRepository.existsByUserIdAndSkillName(user.getId(), skill)) {
                Skill s = new Skill();
                s.setUser(user);
                s.setSkillName(skill);
                skillRepository.save(s);
            }
        }

        Map<String, Object> response = new HashMap<>(parsed);
        response.put("documentId", doc.getId());
        response.put("fileName", cleanLabel + ext);
        response.put("extractedText", extractedText.length() > 500 ? extractedText.substring(0, 500) + "..." : extractedText);
        return response;
    }

    public List<Map<String, Object>> getUserDocuments(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Map<String, Object>> result = new ArrayList<>();
        for (Document doc : documentRepository.findByUserId(user.getId())) {
            Map<String, Object> m = new HashMap<>();
            m.put("id", doc.getId());
            m.put("fileName", doc.getFileName());
            m.put("docType", doc.getDocType());
            m.put("uploadedAt", doc.getUploadedAt() != null ? doc.getUploadedAt().toString() : "");
            result.add(m);
        }
        return result;
    }

    public void deleteDocument(String email, Long docId) {
        Document doc = documentRepository.findById(docId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!doc.getUser().getId().equals(user.getId()))
            throw new RuntimeException("Unauthorized");
        try {
            if (doc.getFilePath() != null && !doc.getFilePath().isBlank())
                Files.deleteIfExists(Paths.get(doc.getFilePath()));
        } catch (IOException ignored) {}
        documentRepository.delete(doc);
    }
}
