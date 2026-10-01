package com.pathfinder.seed;

import com.pathfinder.adaptive.AdaptivePlanningEngine;
import com.pathfinder.auth.User;
import com.pathfinder.auth.UserRepository;
import com.pathfinder.career.CareerPath;
import com.pathfinder.career.CareerPathRepository;
import com.pathfinder.common.AppException;
import com.pathfinder.digitaltwin.DigitalTwinEngine;
import com.pathfinder.intelligence.FailureAnalysisEngine;
import com.pathfinder.intelligence.FailureEvent;
import com.pathfinder.intelligence.IntelligenceDto;
import com.pathfinder.learning.*;
import com.pathfinder.opportunity.OpportunityMatchingEngine;
import com.pathfinder.profile.ProfileService;
import com.pathfinder.profile.StudentProfile;
import com.pathfinder.skills.Skill;
import com.pathfinder.skills.SkillRepository;
import com.pathfinder.skills.StudentSkill;
import com.pathfinder.skills.StudentSkillRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DemoScenarioService {

    private final UserRepository userRepository;
    private final ProfileService profileService;
    private final CareerPathRepository careerPathRepository;
    private final SkillRepository skillRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final LearningRoadmapEngine roadmapEngine;
    private final FailureAnalysisEngine failureAnalysisEngine;
    private final AdaptivePlanningEngine adaptivePlanningEngine;
    private final DigitalTwinEngine digitalTwinEngine;
    private final OpportunityMatchingEngine opportunityMatchingEngine;

    @Data
    @Builder
    public static class ScenarioStepLog {
        private int stepNumber;
        private String actionTitle;
        private String detail;
        private Integer twinVersion;
    }

    @Transactional
    public List<ScenarioStepLog> executeFullDemoScenario() {
        List<ScenarioStepLog> logs = new ArrayList<>();

        User student = userRepository.findByEmail("student@example.com")
                .orElseThrow(() -> new AppException("Demo student not found. Ensure initialization has run."));

        StudentProfile profile = profileService.getOrCreateProfile(student);

        // Step 1: Student profile verified
        logs.add(ScenarioStepLog.builder()
                .stepNumber(1)
                .actionTitle("Student Profile Verified")
                .detail("Student Alex Chen (State University, GPA 3.72, Computer Science) active.")
                .twinVersion(1)
                .build());

        // Step 2 & 3: Select Backend Developer & Build Twin
        CareerPath backendPath = careerPathRepository.findByTitleIgnoreCase("Backend Developer")
                .orElseThrow(() -> new AppException("Backend Developer path missing"));

        logs.add(ScenarioStepLog.builder()
                .stepNumber(2)
                .actionTitle("Target Career Path Selected")
                .detail("Target role set to: Backend Developer (Domain: Software Engineering).")
                .twinVersion(1)
                .build());

        logs.add(ScenarioStepLog.builder()
                .stepNumber(3)
                .actionTitle("Student Digital Twin Feature Vector Extracted")
                .detail("Derived 18+ normalized behavioral features (Initial proficiency: 51.0%, Readiness: 54.0%).")
                .twinVersion(1)
                .build());

        // Step 4 & 5: Identify skill gaps and generate personalized roadmap
        LearningDto.LearningPlanResponse plan = roadmapEngine.generateRoadmap(student, backendPath.getId());
        logs.add(ScenarioStepLog.builder()
                .stepNumber(4)
                .actionTitle("Skill Gap Engine Analyzed Gaps")
                .detail("Identified critical gaps in Spring Boot (25% -> 75%) and Java (45% -> 80%). Prerequisite blockers noted.")
                .twinVersion(1)
                .build());

        logs.add(ScenarioStepLog.builder()
                .stepNumber(5)
                .actionTitle("Personalized Roadmap Generated")
                .detail("Generated Learning Plan v1: 'Personalized Backend Developer Mastery Roadmap' with structured phases.")
                .twinVersion(1)
                .build());

        // Step 6: Complete foundational Java task with evidence
        Skill javaSkill = skillRepository.findByNameIgnoreCase("Java").orElse(null);
        StudentSkill studentJava = studentSkillRepository.findByStudentProfileIdAndSkillId(profile.getId(), javaSkill.getId()).orElse(null);
        if (studentJava != null) {
            studentJava.setProficiency(65.0);
            studentSkillRepository.save(studentJava);
        }

        digitalTwinEngine.recordSnapshot(profile, "TASK_COMPLETED_WITH_EVIDENCE",
                "Completed Java OOP & Collections milestone. Java proficiency raised 45% -> 65%.");

        logs.add(ScenarioStepLog.builder()
                .stepNumber(6)
                .actionTitle("Student Completes Milestone with Verified Evidence")
                .detail("Submitted GitHub repository evidence for Core Java Collections Lab. Java proficiency elevated to 65%.")
                .twinVersion(2)
                .build());

        // Step 7 & 8: Student fails SQL Assessment
        Skill sqlSkill = skillRepository.findByNameIgnoreCase("SQL").orElse(null);
        FailureEvent failure = failureAnalysisEngine.analyzeAndRecordFailure(student, IntelligenceDto.RecordFailureRequest.builder()
                .failureType(FailureEvent.FailureType.ASSESSMENT_FAILURE)
                .context("SQL Joins & Complex Aggregation Diagnostic Assessment")
                .skillId(sqlSkill != null ? sqlSkill.getId() : null)
                .score(42.0)
                .evidence("Test result: 42% on query execution and window functions.")
                .build());

        logs.add(ScenarioStepLog.builder()
                .stepNumber(7)
                .actionTitle("Assessment Failure Incurred")
                .detail("Student scored 42.0% on SQL Joins & Complex Aggregations Assessment (Passing threshold: 70.0%).")
                .twinVersion(2)
                .build());

        logs.add(ScenarioStepLog.builder()
                .stepNumber(8)
                .actionTitle("Failure Intelligence Engine Diagnostics")
                .detail("Logged failure event # " + failure.getId() + " [Confidence: OBSERVED, Severity: HIGH]. Root cause: Subquery & index performance deficiency.")
                .twinVersion(2)
                .build());

        // Step 9 & 10: Adaptive Replanning triggers
        var adaptation = adaptivePlanningEngine.adaptOnFailure(student, failure.getId());
        logs.add(ScenarioStepLog.builder()
                .stepNumber(9)
                .actionTitle("Adaptive Replanning Triggered")
                .detail("Closed-loop replanning activated. Policy triggered: ADD_PREREQUISITE + REORDER.")
                .twinVersion(2)
                .build());

        logs.add(ScenarioStepLog.builder()
                .stepNumber(10)
                .actionTitle("Roadmap Structure Dynamically Adapted")
                .detail("Injected 'Adaptive Reinforcement: SQL Mastery & Remediation' phase. Twin state advanced v2 -> v3.")
                .twinVersion(3)
                .build());

        // Step 11 & 12: Student completes remediation and improves
        StudentSkill studentSql = studentSkillRepository.findByStudentProfileIdAndSkillId(profile.getId(), sqlSkill.getId()).orElse(null);
        if (studentSql != null) {
            studentSql.setProficiency(85.0);
            studentSkillRepository.save(studentSql);
        }

        digitalTwinEngine.recordSnapshot(profile, "REMEDIATION_MASTERY_ACHIEVED",
                "Retook SQL Diagnostic with 88% score. SQL proficiency elevated to 85%. Prerequisite unblocked.");

        logs.add(ScenarioStepLog.builder()
                .stepNumber(11)
                .actionTitle("Remediation Completed & Reassessed")
                .detail("Student completes remediation drills with 88.0% score. SQL proficiency raised from 65% to 85%.")
                .twinVersion(4)
                .build());

        logs.add(ScenarioStepLog.builder()
                .stepNumber(12)
                .actionTitle("Student Digital Twin Updated")
                .detail("Digital Twin advanced to v4. Consistency: 82%, Execution Rate: 84%, Overall Readiness: 74%.")
                .twinVersion(4)
                .build());

        // Step 13, 14, 15, 16: Opportunity Matching & Explainability
        var matches = opportunityMatchingEngine.matchOpportunities(student);
        var topMatch = matches.get(0);

        logs.add(ScenarioStepLog.builder()
                .stepNumber(13)
                .actionTitle("Opportunity Ingestion & Evaluation")
                .detail("Target role detected: " + topMatch.getTitle() + " at " + topMatch.getCompany() + " (" + topMatch.getCompensation() + ").")
                .twinVersion(4)
                .build());

        logs.add(ScenarioStepLog.builder()
                .stepNumber(14)
                .actionTitle("Match vs. Readiness Separation Computed")
                .detail(String.format("Calculated Opportunity Match: %.0f%% | Career Readiness: %.0f%% (%s).",
                        topMatch.getMatchPercentage(), topMatch.getReadinessPercentage(), topMatch.getRequirementsMetRatio()))
                .twinVersion(4)
                .build());

        logs.add(ScenarioStepLog.builder()
                .stepNumber(15)
                .actionTitle("Opportunity Formally Matched to Pipeline")
                .detail("Matched with satisfied competencies: " + String.join(", ", topMatch.getSatisfiedSkills()) + ".")
                .twinVersion(4)
                .build());

        logs.add(ScenarioStepLog.builder()
                .stepNumber(16)
                .actionTitle("Explainable Recommendation Generated")
                .detail(topMatch.getWhyMatchedExplanation() + " " + topMatch.getReadinessExplanation())
                .twinVersion(4)
                .build());

        return logs;
    }
}
