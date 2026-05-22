package com.opportunitypathfinder.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.pdf.draw.LineSeparator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ResumePdfService {

    private static final BaseColor DARK       = new BaseColor(15, 15, 15);
    private static final BaseColor ACCENT     = new BaseColor(60, 60, 60);
    private static final BaseColor LIGHT_GRAY = new BaseColor(120, 120, 120);
    private static final BaseColor LINE_COLOR = new BaseColor(220, 220, 220);

    @SuppressWarnings("unchecked")
    public byte[] generatePdf(Map<String, Object> resume) throws DocumentException {
        Document doc = new Document(PageSize.A4, 50, 50, 45, 45);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(doc, out);
        doc.open();

        Map<String, String> personal = (Map<String, String>) resume.get("personal");
        java.util.List<Map<String, String>> education    = (java.util.List<Map<String, String>>) resume.get("education");
        java.util.List<Map<String, String>> experience   = (java.util.List<Map<String, String>>) resume.get("experience");
        java.util.List<String>              skills       = (java.util.List<String>) resume.get("skills");
        java.util.List<Map<String, String>> certs        = (java.util.List<Map<String, String>>) resume.get("certifications");
        java.util.List<Map<String, String>> projects     = (java.util.List<Map<String, String>>) resume.get("projects");

        Font nameFont    = new Font(Font.FontFamily.HELVETICA, 22, Font.BOLD,   DARK);
        Font sectionFont = new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD,   DARK);
        Font bodyFont    = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, ACCENT);
        Font smallFont   = new Font(Font.FontFamily.HELVETICA,  9, Font.NORMAL, LIGHT_GRAY);
        Font boldBody    = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD,   DARK);

        // ── Name ──────────────────────────────────────────────────────────
        String name = personal.getOrDefault("name", "");
        Paragraph namePara = new Paragraph(name, nameFont);
        namePara.setAlignment(Element.ALIGN_LEFT);
        namePara.setSpacingAfter(4);
        doc.add(namePara);

        // ── Contact line ──────────────────────────────────────────────────
        java.util.List<String> contactParts = new ArrayList<>();
        if (!personal.getOrDefault("email", "").isBlank())    contactParts.add(personal.get("email"));
        if (!personal.getOrDefault("phone", "").isBlank())    contactParts.add(personal.get("phone"));
        if (!personal.getOrDefault("location", "").isBlank()) contactParts.add(personal.get("location"));
        if (!personal.getOrDefault("github", "").isBlank())   contactParts.add(personal.get("github"));
        if (!personal.getOrDefault("linkedin", "").isBlank()) contactParts.add(personal.get("linkedin"));

        if (!contactParts.isEmpty()) {
            Paragraph contact = new Paragraph(String.join("  |  ", contactParts), smallFont);
            contact.setSpacingAfter(10);
            doc.add(contact);
        }

        addLine(doc);

        // ── Education ─────────────────────────────────────────────────────
        if (education != null && !education.isEmpty()) {
            addSection(doc, "EDUCATION", sectionFont);
            for (Map<String, String> edu : education) {
                addEntryRow(doc, edu.getOrDefault("degree", ""), edu.getOrDefault("year", ""), boldBody, smallFont);
                String inst = edu.getOrDefault("institution", "");
                String score = edu.getOrDefault("score", "");
                String sub = (inst.isBlank() ? "" : inst) + (score.isBlank() ? "" : "  ·  " + score);
                if (!sub.isBlank()) doc.add(new Paragraph(sub, bodyFont));
                doc.add(Chunk.NEWLINE);
            }
        }

        // ── Experience ────────────────────────────────────────────────────
        if (experience != null && !experience.isEmpty()) {
            addSection(doc, "EXPERIENCE", sectionFont);
            for (Map<String, String> exp : experience) {
                String role    = exp.getOrDefault("role", "");
                String company = exp.getOrDefault("company", "");
                String dur     = exp.getOrDefault("duration", "");
                String title   = role + (company.isBlank() ? "" : "  —  " + company);
                addEntryRow(doc, title, dur, boldBody, smallFont);
                String details = exp.getOrDefault("details", "");
                if (!details.isBlank() && !details.equals(title)) {
                    doc.add(new Paragraph(details, bodyFont));
                }
                doc.add(Chunk.NEWLINE);
            }
        }

        // ── Skills ────────────────────────────────────────────────────────
        if (skills != null && !skills.isEmpty()) {
            addSection(doc, "SKILLS", sectionFont);
            // Group into rows of 5
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < skills.size(); i++) {
                sb.append(capitalize(skills.get(i)));
                if (i < skills.size() - 1) sb.append("   ·   ");
                if ((i + 1) % 6 == 0) { sb.append("\n"); }
            }
            doc.add(new Paragraph(sb.toString(), bodyFont));
            doc.add(Chunk.NEWLINE);
        }

        // ── Certifications ────────────────────────────────────────────────
        if (certs != null && !certs.isEmpty()) {
            addSection(doc, "CERTIFICATIONS", sectionFont);
            for (Map<String, String> cert : certs) {
                String certName = cert.getOrDefault("name", "");
                String issuer   = cert.getOrDefault("issuer", "");
                String date     = cert.getOrDefault("date", "");
                addEntryRow(doc, certName, date, boldBody, smallFont);
                if (!issuer.isBlank()) doc.add(new Paragraph(issuer, bodyFont));
                doc.add(Chunk.NEWLINE);
            }
        }

        // ── Projects ──────────────────────────────────────────────────────
        if (projects != null && !projects.isEmpty()) {
            addSection(doc, "PROJECTS", sectionFont);
            for (Map<String, String> proj : projects) {
                doc.add(new Paragraph("• " + proj.getOrDefault("name", ""), boldBody));
                String desc = proj.getOrDefault("description", "");
                if (!desc.isBlank()) doc.add(new Paragraph("  " + desc, bodyFont));
            }
        }

        doc.close();
        return out.toByteArray();
    }

    private void addSection(Document doc, String title, Font font) throws DocumentException {
        Paragraph p = new Paragraph(title, font);
        p.setSpacingBefore(6);
        p.setSpacingAfter(4);
        doc.add(p);
        addLine(doc);
    }

    private void addLine(Document doc) throws DocumentException {
        com.itextpdf.text.pdf.draw.LineSeparator line = new com.itextpdf.text.pdf.draw.LineSeparator(0.5f, 100, LINE_COLOR, Element.ALIGN_LEFT, -2);
        doc.add(new Chunk(line));
        doc.add(Chunk.NEWLINE);
    }

    private void addEntryRow(Document doc, String left, String right, Font leftFont, Font rightFont)
            throws DocumentException {
        PdfPTable table = new PdfPTable(new float[]{4, 1});
        table.setWidthPercentage(100);
        table.setSpacingBefore(2);

        PdfPCell leftCell = new PdfPCell(new Phrase(left, leftFont));
        leftCell.setBorder(Rectangle.NO_BORDER);
        leftCell.setPadding(0);

        PdfPCell rightCell = new PdfPCell(new Phrase(right, rightFont));
        rightCell.setBorder(Rectangle.NO_BORDER);
        rightCell.setPadding(0);
        rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        table.addCell(leftCell);
        table.addCell(rightCell);
        doc.add(table);
    }

    private String capitalize(String s) {
        if (s == null || s.isBlank()) return s;
        return Character.toUpperCase(s.charAt(0)) + s.substring(1);
    }
}
