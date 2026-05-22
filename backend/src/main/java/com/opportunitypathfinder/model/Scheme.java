package com.opportunitypathfinder.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "schemes")
@Data
public class Scheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String ministry;
    private String schemeCategory;   // EDUCATION, EMPLOYMENT, FINANCE, HEALTH, HOUSING, AGRICULTURE, SOCIAL

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String benefits;

    // Eligibility criteria
    private String targetGroup;      // ALL, SC, ST, OBC, EWS, MINORITY, FARMER, WOMAN, YOUTH
    private String genderRequired;   // ANY, FEMALE, MALE
    private Double maxAnnualIncome;  // 0 = no limit
    private Integer minAge;
    private Integer maxAge;
    private String employmentStatus; // ANY, UNEMPLOYED, STUDENT, FARMER, SELF_EMPLOYED
    private String stateSpecific;    // blank = all India

    private String applyUrl;
    private String applyMode;        // ONLINE, OFFLINE, BOTH

    @Column(columnDefinition = "TEXT")
    private String requiredDocuments;

    private boolean active = true;
}
