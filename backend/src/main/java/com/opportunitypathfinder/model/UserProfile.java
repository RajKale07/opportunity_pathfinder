package com.opportunitypathfinder.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
@Data
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String fullName;
    private String phone;
    private String dob;
    private String gender;
    private String city;
    private String state;
    private String category;
    private String annualIncome;
    private String employmentStatus;

    // Education
    private String tenthPercentage;
    private String twelfthPercentage;
    private String graduationCgpa;
    private String graduationDegree;
    private String graduationBranch;
    private String graduationYear;

    // Career
    private String experience;
    private String githubUrl;
    private String linkedinUrl;

    private LocalDateTime updatedAt = LocalDateTime.now();
}
