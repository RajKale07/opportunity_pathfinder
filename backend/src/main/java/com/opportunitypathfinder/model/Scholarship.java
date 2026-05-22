package com.opportunitypathfinder.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "scholarships")
@Data
public class Scholarship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String provider;
    private String category;        // CENTRAL, STATE, PRIVATE, MINORITY
    private String targetGroup;     // ALL, SC, ST, OBC, EWS, MINORITY, GIRL, DISABLED

    @Column(columnDefinition = "TEXT")
    private String description;

    private String eligibilityDegree;   // ANY, UG, PG, DIPLOMA, CLASS_10, CLASS_12
    private Double minMarksPercent;     // minimum marks required
    private Double maxAnnualIncome;     // max family income in INR
    private String genderRequired;      // ANY, FEMALE, MALE
    private String stateSpecific;       // blank = all India, else state name

    private String amount;              // e.g. "₹50,000/year"
    private String deadline;            // e.g. "31 October 2025"
    private String applyUrl;

    @Column(columnDefinition = "TEXT")
    private String requiredDocuments;   // comma separated

    private boolean active = true;
}
