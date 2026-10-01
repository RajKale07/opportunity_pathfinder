package com.pathfinder.opportunity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pathfinder.skills.Skill;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "opportunity_skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpportunitySkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opportunity_id", nullable = false)
    @JsonIgnore
    private Opportunity opportunity;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Builder.Default
    private Boolean isRequired = true; // true = Mandatory, false = Preferred

    @Column(nullable = false)
    @Builder.Default
    private Double minProficiency = 60.0;
}
