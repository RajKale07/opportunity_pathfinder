package com.pathfinder.learning;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapPhaseRepository extends JpaRepository<RoadmapPhase, Long> {
    List<RoadmapPhase> findByLearningPlanIdOrderByPhaseOrderAsc(Long learningPlanId);
}
