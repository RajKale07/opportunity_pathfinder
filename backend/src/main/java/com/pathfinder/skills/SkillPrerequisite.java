package com.pathfinder.skills;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skill_prerequisites")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillPrerequisite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill; // The target skill that depends on a prerequisite

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "prerequisite_skill_id", nullable = false)
    private Skill prerequisiteSkill; // The required baseline skill

    @Builder.Default
    private Double minRequiredProficiency = 60.0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private PrerequisiteType type = PrerequisiteType.MANDATORY;

    public enum PrerequisiteType {
        MANDATORY,
        RECOMMENDED
    }
}
