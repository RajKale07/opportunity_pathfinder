package com.pathfinder.adaptive;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pathfinder.learning.LearningPlan;
import com.pathfinder.profile.StudentProfile;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "adaptation_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdaptationEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    @JsonIgnore
    private StudentProfile studentProfile;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "learning_plan_id")
    private LearningPlan learningPlan;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ActionType actionType;

    @Column(nullable = false, length = 1024)
    private String triggerReason;

    @Column(length = 2048)
    private String beforePlanSummary;

    @Column(length = 2048)
    private String afterPlanSummary;

    private Integer previousTwinVersion;
    private Integer newTwinVersion;

    @Builder.Default
    @Column(nullable = false)
    private Instant timestamp = Instant.now();

    public enum ActionType {
        ADD_PREREQUISITE,
        ACCELERATE,
        SLOW_DOWN,
        REORDER,
        REINFORCE,
        REPLACE,
        REDUCE_WORKLOAD,
        INCREASE_DIFFICULTY
    }
}
