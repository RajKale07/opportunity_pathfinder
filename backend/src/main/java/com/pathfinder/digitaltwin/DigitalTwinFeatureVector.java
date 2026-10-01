package com.pathfinder.digitaltwin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DigitalTwinFeatureVector {
    private Double skillProficiency;         // Average proficiency across core skills [0-100]
    private Double skillRecency;             // Average recency in days since last practiced/assessed
    private Integer projectCount;            // Total verified projects
    private Double projectQuality;           // Average complexity score of projects [1-10]
    private Double learningCompletionRate;   // completed_learning_items / assigned_learning_items [0-100]
    private Double taskCompletionRate;       // completed_tasks / assigned_tasks [0-100]
    private Double consistencyScore;         // Active study streak & regularity score [0-100]
    private Double academicScore;            // Normalized GPA [0-100]
    private Double interviewScore;           // Average mock interview evaluation score [0-100]
    private Double communicationScore;       // Communication rating [0-100]
    private Double problemSolvingScore;      // DSA & algorithm problem solving rating [0-100]
    private Double careerGoalAlignment;      // Alignment between skills/projects and primary career goal [0-100]
    private Double opportunityAlignment;     // Alignment with active matched opportunities [0-100]
    private Integer failureFrequency;        // Failures logged in current roadmap cycle
    private Double failureRecoveryRate;      // Resolved failures / total recorded failures [0-100]
    private Double learningVelocity;         // Completed tasks per active week
    private Double projectComplexity;        // Max complexity project completed
    private String experienceLevel;          // NOVICE, INTERMEDIATE, ADVANCED, INDUSTRY_READY
}
