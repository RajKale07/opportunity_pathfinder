package com.pathfinder.learning;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pathfinder.career.CareerPath;
import com.pathfinder.profile.StudentProfile;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "learning_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    @JsonIgnore
    private StudentProfile studentProfile;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "career_path_id", nullable = false)
    private CareerPath targetCareerPath;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 2048)
    private String objective;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private PlanStatus status = PlanStatus.ACTIVE;

    @Builder.Default
    private Integer version = 1; // Incremented on adaptive replanning

    @OneToMany(mappedBy = "learningPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("phaseOrder ASC")
    @Builder.Default
    private List<RoadmapPhase> phases = new ArrayList<>();

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

    public enum PlanStatus {
        ACTIVE,
        COMPLETED,
        ARCHIVED,
        ADAPTED
    }
}
