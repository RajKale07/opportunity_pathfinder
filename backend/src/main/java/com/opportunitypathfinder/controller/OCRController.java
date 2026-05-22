package com.opportunitypathfinder.controller;

import com.opportunitypathfinder.service.OCRService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/ocr")
@RequiredArgsConstructor
public class OCRController {

    private final OCRService ocrService;

    @PostMapping("/upload")
    public ResponseEntity<?> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "docType", required = false, defaultValue = "") String docType,
            @RequestParam(value = "label", required = false, defaultValue = "") String label) throws IOException {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(ocrService.processDocument(email, file, docType, label));
    }

    @PostMapping("/manual")
    public ResponseEntity<?> saveManual(@RequestBody Map<String, Object> body) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String docType = (String) body.get("docType");
        String label = (String) body.get("label");
        @SuppressWarnings("unchecked")
        Map<String, String> data = (Map<String, String>) body.get("data");
        return ResponseEntity.ok(ocrService.saveManualDocument(email, docType, label, data));
    }

    @GetMapping("/documents")
    public ResponseEntity<?> getDocuments() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(ocrService.getUserDocuments(email));
    }

    @DeleteMapping("/documents/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        ocrService.deleteDocument(email, id);
        return ResponseEntity.ok().build();
    }
}
