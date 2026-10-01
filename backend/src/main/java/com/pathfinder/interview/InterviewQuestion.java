package com.pathfinder.interview;

import com.pathfinder.skills.Skill;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "interview_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1024)
    private String questionText;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private QuestionType type;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id")
    private Skill targetSkill;

    @Builder.Default
    private Integer difficulty = 3; // 1 to 5

    @Column(length = 2048)
    private String sampleAnswerGuideline;

    public enum QuestionType {
        TECHNICAL,
        SYSTEM_DESIGN,
        BEHAVIORAL,
        ALGORITHMIC
    }
}
