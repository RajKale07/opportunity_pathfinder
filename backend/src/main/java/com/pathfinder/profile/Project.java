package com.pathfinder.profile;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    @JsonIgnore
    private StudentProfile studentProfile;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 2048)
    private String description;

    @Column(length = 255)
    private String techStack;

    @Column(length = 255)
    private String repoUrl;

    @Column(length = 255)
    private String liveUrl;

    @Builder.Default
    private Integer complexityScore = 5; // Scale 1 - 10

    private Instant completedAt;

    @Builder.Default
    @Column(nullable = false)
    private Instant createdAt = Instant.now();
}
