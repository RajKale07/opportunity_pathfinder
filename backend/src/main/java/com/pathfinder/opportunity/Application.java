package com.pathfinder.opportunity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pathfinder.profile.StudentProfile;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    @JsonIgnore
    private StudentProfile studentProfile;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "opportunity_id", nullable = false)
    private Opportunity opportunity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.BOOKMARKED;

    @Column(length = 1024)
    private String notes;

    @Builder.Default
    @Column(nullable = false)
    private Instant appliedAt = Instant.now();

    public enum ApplicationStatus {
        BOOKMARKED,
        APPLIED,
        INTERVIEWING,
        OFFERED,
        REJECTED
    }
}
