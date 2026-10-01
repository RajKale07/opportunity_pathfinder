package com.pathfinder.learning;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "roadmap_phases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapPhase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learning_plan_id", nullable = false)
    @JsonIgnore
    private LearningPlan learningPlan;

    @Column(nullable = false)
    private Integer phaseOrder;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 1024)
    private String description;

    @Builder.Default
    private Integer durationWeeks = 2;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private PhaseStatus status = PhaseStatus.UPCOMING;

    @OneToMany(mappedBy = "roadmapPhase", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("taskOrder ASC")
    @Builder.Default
    private List<LearningTask> tasks = new ArrayList<>();

    public enum PhaseStatus {
        COMPLETED,
        IN_PROGRESS,
        UPCOMING,
        ADAPTED
    }
}
