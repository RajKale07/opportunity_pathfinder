package com.pathfinder.opportunity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "opportunities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Opportunity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title; // e.g. "Junior Backend Developer Intern"

    @Column(nullable = false, length = 150)
    private String company; // e.g. "Stripe", "Datadog", "OpenAI"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private OpportunityType type; // INTERNSHIP, FULL_TIME, HACKATHON, RESEARCH, FELLOWSHIP

    @Column(length = 100)
    private String domain; // e.g. "Backend Systems", "Distributed Infrastructure"

    @Column(length = 100)
    private String location;

    @Builder.Default
    private Boolean remote = true;

    @Column(length = 100)
    private String compensation; // e.g. "$45/hr" or "$90,000 - $110,000"

    private Instant deadline;

    @Column(length = 2048)
    private String description;

    @OneToMany(mappedBy = "opportunity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OpportunitySkill> skillRequirements = new ArrayList<>();

    @Builder.Default
    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public enum OpportunityType {
        INTERNSHIP,
        FULL_TIME,
        HACKATHON,
        RESEARCH,
        FELLOWSHIP
    }
}
