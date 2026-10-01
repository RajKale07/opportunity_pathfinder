package com.pathfinder.digitaltwin;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pathfinder.profile.StudentProfile;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "digital_twin_snapshots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DigitalTwinSnapshot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    @JsonIgnore
    private StudentProfile studentProfile;

    @Column(nullable = false)
    private Integer version; // e.g. 1, 2, 3...

    @Column(nullable = false, length = 100)
    private String triggerEvent; // e.g. INITIAL_PROFILE, SKILL_UPDATED, FAILURE_RECORDED, ADAPTATION_APPLIED

    @Column(length = 2048)
    private String changeSummary;

    @Column(columnDefinition = "TEXT")
    private String featureVectorJson;

    private Double overallReadiness; // Composite readiness score [0 - 100]

    @Builder.Default
    @Column(nullable = false)
    private Instant snapshotTimestamp = Instant.now();
}
