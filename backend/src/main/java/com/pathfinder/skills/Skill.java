package com.pathfinder.skills;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Category category;

    @Column(length = 1024)
    private String description;

    @Builder.Default
    private Integer difficultyLevel = 3; // 1 (Beginner) to 5 (Advanced)

    @Builder.Default
    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public enum Category {
        PROGRAMMING_LANGUAGE,
        FRAMEWORK,
        DATABASE,
        DEVOPS,
        SYSTEM_DESIGN,
        DATA_STRUCTURES_ALGORITHMS,
        SOFT_SKILL
    }
}
