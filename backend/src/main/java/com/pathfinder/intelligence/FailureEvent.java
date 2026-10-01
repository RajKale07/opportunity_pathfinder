package com.pathfinder.intelligence;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pathfinder.profile.StudentProfile;
import com.pathfinder.skills.Skill;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "failure_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FailureEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    @JsonIgnore
    private StudentProfile studentProfile;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private FailureType failureType;

    @Column(nullable = false, length = 200)
    private String context; // e.g. "SQL Joins & Aggregations Assessment"

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id")
    private Skill skill;

    private Double score; // e.g. 42.0

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private Severity severity = Severity.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private ConfidenceCategory confidence = ConfidenceCategory.OBSERVED;

    @Column(length = 1024)
    private String observedFactor;

    @Column(length = 1024)
    private String likelyContributingFactor;

    @Column(length = 1024)
    private String evidence;

    @Column(length = 1024)
    private String recommendedRecoveryAction;

    @Builder.Default
    private Boolean isResolved = false;

    @Builder.Default
    @Column(nullable = false)
    private Instant timestamp = Instant.now();

    public enum FailureType {
        TASK_FAILURE,
        ASSESSMENT_FAILURE,
        INTERVIEW_FAILURE,
        PROJECT_FAILURE,
        DEADLINE_BREACH,
        OPPORTUNITY_REJECTION
    }

    public enum Severity {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }

    public enum ConfidenceCategory {
        OBSERVED,
        LIKELY,
        UNKNOWN
    }
}
