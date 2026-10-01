package com.pathfinder.learning;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningTaskRepository extends JpaRepository<LearningTask, Long> {
    List<LearningTask> findByRoadmapPhaseIdOrderByTaskOrderAsc(Long roadmapPhaseId);
    List<LearningTask> findByRoadmapPhase_LearningPlan_StudentProfile_Id(Long studentProfileId);
    List<LearningTask> findByRoadmapPhase_LearningPlan_StudentProfile_IdAndStatus(Long studentProfileId, LearningTask.TaskStatus status);
}
