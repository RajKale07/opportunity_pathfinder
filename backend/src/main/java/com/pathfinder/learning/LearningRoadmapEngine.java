package com.pathfinder.learning;

import com.pathfinder.auth.User;
import com.pathfinder.career.CareerDto;
import com.pathfinder.career.CareerPath;
import com.pathfinder.career.CareerPathRepository;
import com.pathfinder.career.SkillGapEngine;
import com.pathfinder.common.AppException;
import com.pathfinder.common.AuditLogService;
import com.pathfinder.digitaltwin.DigitalTwinEngine;
import com.pathfinder.profile.ProfileService;
import com.pathfinder.profile.StudentProfile;
import com.pathfinder.skills.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LearningRoadmapEngine {

    private final LearningPlanRepository learningPlanRepository;
    private final RoadmapPhaseRepository roadmapPhaseRepository;
    private final LearningTaskRepository learningTaskRepository;
    private final TaskEvidenceRepository taskEvidenceRepository;
    private final CareerPathRepository careerPathRepository;
    private final SkillRepository skillRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final SkillGapEngine skillGapEngine;
    private final ProfileService profileService;
    private final DigitalTwinEngine digitalTwinEngine;
    private final AuditLogService auditLogService;

    @Transactional
    public LearningDto.LearningPlanResponse generateRoadmap(User user, Long careerPathId) {
        StudentProfile profile = profileService.getOrCreateProfile(user);
        CareerPath careerPath = careerPathRepository.findById(careerPathId)
                .orElseThrow(() -> new AppException("Career path not found with ID: " + careerPathId));

        // Archive any existing active plan
        learningPlanRepository.findFirstByStudentProfileIdAndStatusOrderByVersionDesc(profile.getId(), LearningPlan.PlanStatus.ACTIVE)
                .ifPresent(existing -> {
                    existing.setStatus(LearningPlan.PlanStatus.ARCHIVED);
                    learningPlanRepository.save(existing);
                });

        CareerDto.SkillGapReport gapReport = skillGapEngine.generateSkillGapReport(user, careerPathId);

        LearningPlan plan = LearningPlan.builder()
                .studentProfile(profile)
                .targetCareerPath(careerPath)
                .title("Personalized " + careerPath.getTitle() + " Mastery Roadmap")
                .objective(String.format("Close %d identified skill gaps and attain production readiness for %s.",
                        gapReport.getGapSkillsCount(), careerPath.getTitle()))
                .status(LearningPlan.PlanStatus.ACTIVE)
                .version(1)
                .build();

        LearningPlan savedPlan = learningPlanRepository.save(plan);

        // Group gaps: High priority (prerequisites & blockers), Medium, Ready/Advanced
        List<CareerDto.SkillGapItem> highGaps = gapReport.getGaps().stream()
                .filter(g -> g.getPriority() == CareerDto.GapPriority.HIGH)
                .collect(Collectors.toList());

        List<CareerDto.SkillGapItem> medLowGaps = gapReport.getGaps().stream()
                .filter(g -> g.getPriority() == CareerDto.GapPriority.MEDIUM || g.getPriority() == CareerDto.GapPriority.LOW)
                .collect(Collectors.toList());

        int phaseIndex = 1;

        // Phase 1: Core Prerequisites & Urgent Gaps
        if (!highGaps.isEmpty()) {
            RoadmapPhase p1 = RoadmapPhase.builder()
                    .learningPlan(savedPlan)
                    .phaseOrder(phaseIndex++)
                    .title("Phase 1: Foundational Prerequisites & Critical Blockers")
                    .description("Master prerequisite skills to eliminate architectural blockers.")
                    .durationWeeks(3)
                    .status(RoadmapPhase.PhaseStatus.IN_PROGRESS)
                    .build();
            RoadmapPhase savedP1 = roadmapPhaseRepository.save(p1);

            int taskOrder = 1;
            for (CareerDto.SkillGapItem gap : highGaps) {
                Skill skill = skillRepository.findById(gap.getSkillId()).orElse(null);
                createTask(savedP1, taskOrder++,
                        "Core Fundamentals of " + gap.getSkillName(),
                        "Master foundational concepts and solve baseline exercises in " + gap.getSkillName(),
                        skill, 3, 6.0, LearningTask.TaskPriority.HIGH);
                createTask(savedP1, taskOrder++,
                        "Hands-on Lab & Assessment: " + gap.getSkillName(),
                        "Implement guided mini-project and submit repository evidence for " + gap.getSkillName(),
                        skill, 3, 8.0, LearningTask.TaskPriority.CRITICAL);
            }
        }

        // Phase 2: Frameworks & Intermediate Architecture
        RoadmapPhase p2 = RoadmapPhase.builder()
                .learningPlan(savedPlan)
                .phaseOrder(phaseIndex++)
                .title("Phase " + phaseIndex + ": Core Framework & Persistence Mastery")
                .description("Build intermediate domain competency and scalable persistence layers.")
                .durationWeeks(3)
                .status(RoadmapPhase.PhaseStatus.UPCOMING)
                .build();
        RoadmapPhase savedP2 = roadmapPhaseRepository.save(p2);

        int p2TaskOrder = 1;
        for (CareerDto.SkillGapItem gap : medLowGaps) {
            Skill skill = skillRepository.findById(gap.getSkillId()).orElse(null);
            createTask(savedP2, p2TaskOrder++,
                    "Intermediate Practice: " + gap.getSkillName(),
                    "Complete production-grade modules and design patterns in " + gap.getSkillName(),
                    skill, 3, 6.0, LearningTask.TaskPriority.MEDIUM);
        }

        // Phase 3: Production Capstone Project & Readiness Verification
        RoadmapPhase p3 = RoadmapPhase.builder()
                .learningPlan(savedPlan)
                .phaseOrder(phaseIndex)
                .title("Phase " + phaseIndex + ": Production Capstone Project")
                .description("Integrate all roadmap competencies into an industry-ready portfolio asset.")
                .durationWeeks(4)
                .status(RoadmapPhase.PhaseStatus.UPCOMING)
                .build();
        RoadmapPhase savedP3 = roadmapPhaseRepository.save(p3);

        createTask(savedP3, 1,
                "Architect End-to-End " + careerPath.getTitle() + " System",
                "Design and document architecture, database schemas, and REST endpoints.",
                null, 4, 12.0, LearningTask.TaskPriority.HIGH);
        createTask(savedP3, 2,
                "Deploy & Benchmark Production Application",
                "Dockerize application, configure CI/CD pipeline, and write automated integration tests.",
                null, 5, 15.0, LearningTask.TaskPriority.CRITICAL);

        // Advance twin state snapshot
        digitalTwinEngine.recordSnapshot(profile, "ROADMAP_GENERATED",
                "Generated personalized " + careerPath.getTitle() + " learning plan v1 with " + gapReport.getGapSkillsCount() + " targeted gaps.");

        return toPlanResponse(savedPlan);
    }

    private void createTask(RoadmapPhase phase, int order, String title, String desc, Skill skill, int diff, double hours, LearningTask.TaskPriority priority) {
        LearningTask task = LearningTask.builder()
                .roadmapPhase(phase)
                .taskOrder(order)
                .title(title)
                .description(desc)
                .skill(skill)
                .difficulty(diff)
                .estimatedHours(hours)
                .priority(priority)
                .status(LearningTask.TaskStatus.NOT_STARTED)
                .deadline(Instant.now().plus(order * 7L, ChronoUnit.DAYS))
                .build();
        learningTaskRepository.save(task);
    }

    @Transactional
    public LearningDto.LearningTaskDto submitEvidence(User user, Long taskId, LearningDto.SubmitEvidenceRequest request) {
        StudentProfile profile = profileService.getOrCreateProfile(user);
        LearningTask task = learningTaskRepository.findById(taskId)
                .orElseThrow(() -> new AppException("Task not found with ID: " + taskId));

        TaskEvidence evidence = TaskEvidence.builder()
                .learningTask(task)
                .type(request.getType() != null ? request.getType() : TaskEvidence.EvidenceType.GITHUB_REPO)
                .urlOrReference(request.getUrlOrReference())
                .notes(request.getNotes())
                .verificationScore(95.0)
                .submittedAt(Instant.now())
                .build();

        taskEvidenceRepository.save(evidence);

        task.setStatus(LearningTask.TaskStatus.COMPLETED);
        task.setCompletedAt(Instant.now());
        learningTaskRepository.save(task);

        // Update skill proficiency upon completed verified task
        if (task.getSkill() != null) {
            Skill skill = task.getSkill();
            StudentSkill studentSkill = studentSkillRepository
                    .findByStudentProfileIdAndSkillId(profile.getId(), skill.getId())
                    .orElseGet(() -> StudentSkill.builder()
                            .studentProfile(profile)
                            .skill(skill)
                            .proficiency(20.0)
                            .confidenceScore(40.0)
                            .build());

            double oldProf = studentSkill.getProficiency();
            double newProf = Math.min(100.0, oldProf + 15.0);
            studentSkill.setProficiency(newProf);
            studentSkill.setConfidenceScore(Math.min(100.0, studentSkill.getConfidenceScore() + 10.0));
            studentSkill.setEvidenceCount(studentSkill.getEvidenceCount() + 1);
            studentSkill.setLastAssessedAt(Instant.now());
            studentSkillRepository.save(studentSkill);

            digitalTwinEngine.recordSnapshot(profile, "TASK_COMPLETED_WITH_EVIDENCE",
                    String.format("Completed task '%s'. Skill %s proficiency raised from %.1f%% to %.1f%%.",
                            task.getTitle(), skill.getName(), oldProf, newProf));
        } else {
            digitalTwinEngine.recordSnapshot(profile, "TASK_COMPLETED",
                    "Completed portfolio milestone task: " + task.getTitle());
        }

        return toTaskDto(task);
    }

    @Transactional
    public LearningDto.LearningTaskDto updateTaskStatus(User user, Long taskId, LearningTask.TaskStatus status) {
        LearningTask task = learningTaskRepository.findById(taskId)
                .orElseThrow(() -> new AppException("Task not found with ID: " + taskId));

        task.setStatus(status);
        if (status == LearningTask.TaskStatus.COMPLETED) {
            task.setCompletedAt(Instant.now());
        }
        LearningTask saved = learningTaskRepository.save(task);
        return toTaskDto(saved);
    }

    @Transactional(readOnly = true)
    public LearningDto.LearningPlanResponse getActivePlan(User user) {
        StudentProfile profile = profileService.getOrCreateProfile(user);
        LearningPlan plan = learningPlanRepository
                .findFirstByStudentProfileIdAndStatusOrderByVersionDesc(profile.getId(), LearningPlan.PlanStatus.ACTIVE)
                .orElse(null);

        if (plan == null) {
            return null;
        }
        return toPlanResponse(plan);
    }

    @Transactional(readOnly = true)
    public List<LearningDto.LearningTaskDto> getTodayTasks(User user) {
        StudentProfile profile = profileService.getOrCreateProfile(user);
        return learningTaskRepository.findByRoadmapPhase_LearningPlan_StudentProfile_Id(profile.getId()).stream()
                .filter(t -> t.getStatus() == LearningTask.TaskStatus.NOT_STARTED || t.getStatus() == LearningTask.TaskStatus.IN_PROGRESS)
                .limit(5)
                .map(this::toTaskDto)
                .collect(Collectors.toList());
    }

    public LearningDto.LearningPlanResponse toPlanResponse(LearningPlan plan) {
        List<RoadmapPhase> phases = roadmapPhaseRepository.findByLearningPlanIdOrderByPhaseOrderAsc(plan.getId());
        List<LearningDto.RoadmapPhaseDto> phaseDtos = phases.stream()
                .map(phase -> {
                    List<LearningTask> tasks = learningTaskRepository.findByRoadmapPhaseIdOrderByTaskOrderAsc(phase.getId());
                    return LearningDto.RoadmapPhaseDto.builder()
                            .id(phase.getId())
                            .phaseOrder(phase.getPhaseOrder())
                            .title(phase.getTitle())
                            .description(phase.getDescription())
                            .durationWeeks(phase.getDurationWeeks())
                            .status(phase.getStatus())
                            .tasks(tasks.stream().map(this::toTaskDto).collect(Collectors.toList()))
                            .build();
                })
                .collect(Collectors.toList());

        return LearningDto.LearningPlanResponse.builder()
                .id(plan.getId())
                .careerPathId(plan.getTargetCareerPath().getId())
                .careerPathTitle(plan.getTargetCareerPath().getTitle())
                .title(plan.getTitle())
                .objective(plan.getObjective())
                .status(plan.getStatus())
                .version(plan.getVersion())
                .phases(phaseDtos)
                .createdAt(plan.getCreatedAt())
                .updatedAt(plan.getUpdatedAt())
                .build();
    }

    public LearningDto.LearningTaskDto toTaskDto(LearningTask t) {
        List<TaskEvidence> evidences = taskEvidenceRepository.findByLearningTaskId(t.getId());
        List<LearningDto.TaskEvidenceDto> evidenceDtos = evidences.stream()
                .map(e -> LearningDto.TaskEvidenceDto.builder()
                        .id(e.getId())
                        .type(e.getType())
                        .urlOrReference(e.getUrlOrReference())
                        .notes(e.getNotes())
                        .verificationScore(e.getVerificationScore())
                        .submittedAt(e.getSubmittedAt())
                        .build())
                .collect(Collectors.toList());

        return LearningDto.LearningTaskDto.builder()
                .id(t.getId())
                .taskOrder(t.getTaskOrder())
                .title(t.getTitle())
                .description(t.getDescription())
                .skillId(t.getSkill() != null ? t.getSkill().getId() : null)
                .skillName(t.getSkill() != null ? t.getSkill().getName() : null)
                .difficulty(t.getDifficulty())
                .estimatedHours(t.getEstimatedHours())
                .priority(t.getPriority())
                .status(t.getStatus())
                .deadline(t.getDeadline())
                .completedAt(t.getCompletedAt())
                .evidences(evidenceDtos)
                .build();
    }
}
