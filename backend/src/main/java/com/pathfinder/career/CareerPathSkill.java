package com.pathfinder.career;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pathfinder.skills.Skill;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "career_path_skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerPathSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "career_path_id", nullable = false)
    @JsonIgnore
    private CareerPath careerPath;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(nullable = false)
    @Builder.Default
    private Double targetProficiency = 75.0; // Required proficiency [0-100]

    @Column(nullable = false)
    @Builder.Default
    private Double weight = 1.0; // Importance in path matching

    @Builder.Default
    private Boolean isCore = true;
}
