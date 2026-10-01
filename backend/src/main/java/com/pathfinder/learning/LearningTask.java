package com.pathfinder.learning;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pathfinder.skills.Skill;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "learning_tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roadmap_phase_id", nullable = false)
    @JsonIgnore
    private RoadmapPhase roadmapPhase;

    @Column(nullable = false)
    private Integer taskOrder;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 2048)
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id")
    private Skill skill;

    @Builder.Default
    private Integer difficulty = 2; // 1 to 5

    @Builder.Default
    private Double estimatedHours = 4.0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private TaskPriority priority = TaskPriority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private TaskStatus status = TaskStatus.NOT_STARTED;

    private Instant deadline;
    private Instant completedAt;

    @OneToMany(mappedBy = "learningTask", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TaskEvidence> evidences = new ArrayList<>();

    @Builder.Default
    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public enum TaskPriority {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }

    public enum TaskStatus {
        NOT_STARTED,
        IN_PROGRESS,
        COMPLETED,
        SKIPPED,
        FAILED
    }
}
