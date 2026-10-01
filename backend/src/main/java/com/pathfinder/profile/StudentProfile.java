package com.pathfinder.profile;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pathfinder.auth.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "student_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    @Column(length = 150)
    private String headline;

    @Column(length = 2048)
    private String biography;

    @Column(length = 100)
    private String currentDegree;

    @Column(length = 100)
    private String major;

    @Column(length = 150)
    private String institution;

    private Integer graduationYear;
    private Double gpa;

    @Column(length = 100)
    private String preferredDomain;

    @Column(length = 100)
    private String targetRole;

    @Column(length = 100)
    private String preferredLocations;

    @Column(length = 50)
    @Builder.Default
    private String remotePreference = "HYBRID";

    @Builder.Default
    private Integer weeklyAvailableHours = 15;

    @Builder.Default
    private Boolean higherStudyInterest = false;

    @Builder.Default
    private Boolean startupInterest = true;

    private Double salaryExpectationMin;
    private Double salaryExpectationMax;

    @Column(length = 255)
    private String githubUrl;

    @Column(length = 255)
    private String linkedinUrl;

    @Column(length = 255)
    private String portfolioUrl;

    @Column(columnDefinition = "TEXT")
    private String resumeText;

    @OneToMany(mappedBy = "studentProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Education> educations = new ArrayList<>();

    @OneToMany(mappedBy = "studentProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CareerGoal> careerGoals = new ArrayList<>();

    @OneToMany(mappedBy = "studentProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Project> projects = new ArrayList<>();

    @OneToMany(mappedBy = "studentProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Achievement> achievements = new ArrayList<>();

    @Builder.Default
    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    @Builder.Default
    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
