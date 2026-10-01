package com.pathfinder.execution;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pathfinder.learning.LearningTask;
import com.pathfinder.profile.StudentProfile;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "execution_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExecutionRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    @JsonIgnore
    private StudentProfile studentProfile;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "learning_task_id", nullable = false)
    private LearningTask learningTask;

    @Column(nullable = false)
    private Double timeSpentHours;

    @Column(nullable = false)
    private Boolean completedOnTime;

    private Long minutesVarianceFromDeadline; // Negative = early, Positive = delayed

    @Builder.Default
    @Column(nullable = false)
    private Instant recordedAt = Instant.now();
}
