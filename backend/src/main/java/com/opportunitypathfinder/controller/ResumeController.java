package com.opportunitypathfinder.controller;

import com.opportunitypathfinder.service.ResumePdfService;
import com.opportunitypathfinder.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;
    private final ResumePdfService resumePdfService;

    @GetMapping
    public ResponseEntity<?> getResume() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(resumeService.buildResume(email));
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> downloadPdf() {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            Map<String, Object> resume = resumeService.buildResume(email);
            byte[] pdf = resumePdfService.generatePdf(resume);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.attachment().filename("resume.pdf").build());
            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
