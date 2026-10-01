package com.pathfinder.profile;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "career_goals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerGoal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    @JsonIgnore
    private StudentProfile studentProfile;

    @Column(nullable = false, length = 100)
    private String targetRole;

    @Column(length = 100)
    private String careerDomain;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private PriorityLevel priorityLevel = PriorityLevel.PRIMARY;

    @Builder.Default
    private Integer timeframeMonths = 12;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private GoalStatus status = GoalStatus.ACTIVE;

    @Builder.Default
    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public enum PriorityLevel {
        PRIMARY,
        ALTERNATIVE,
        EXPLORATION
    }

    public enum GoalStatus {
        ACTIVE,
        ACHIEVED,
        REVISED,
        ABANDONED
    }
}
