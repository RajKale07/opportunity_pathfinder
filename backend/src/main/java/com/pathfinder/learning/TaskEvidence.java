package com.pathfinder.learning;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "task_evidences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskEvidence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learning_task_id", nullable = false)
    @JsonIgnore
    private LearningTask learningTask;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private EvidenceType type;

    @Column(nullable = false, length = 255)
    private String urlOrReference;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Builder.Default
    private Double verificationScore = 100.0; // 0 to 100

    @Builder.Default
    @Column(nullable = false)
    private Instant submittedAt = Instant.now();

    public enum EvidenceType {
        GITHUB_REPO,
        PROJECT_LINK,
        NOTES,
        CERTIFICATE,
        ASSESSMENT_RESULT,
        CODE_SNIPPET
    }
}
