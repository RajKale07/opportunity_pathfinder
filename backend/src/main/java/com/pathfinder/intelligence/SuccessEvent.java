package com.pathfinder.intelligence;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pathfinder.profile.StudentProfile;
import com.pathfinder.skills.Skill;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "success_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuccessEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    @JsonIgnore
    private StudentProfile studentProfile;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private SuccessType successType;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 1024)
    private String context;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id")
    private Skill skill;

    private Double score;

    @Column(length = 1024)
    private String contributingFactors; // e.g. "Consistent 30min daily practice + guided labs"

    @Column(length = 1024)
    private String transferableLearnings;

    @Builder.Default
    @Column(nullable = false)
    private Instant timestamp = Instant.now();

    public enum SuccessType {
        PROJECT_COMPLETION,
        ASSESSMENT_MASTERY,
        INTERVIEW_PASSED,
        STREAK_MILESTONE,
        ROADMAP_PHASE_COMPLETED,
        OPPORTUNITY_OFFER
    }
}
