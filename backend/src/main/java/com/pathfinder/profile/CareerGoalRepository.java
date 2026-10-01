package com.pathfinder.profile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareerGoalRepository extends JpaRepository<CareerGoal, Long> {
    List<CareerGoal> findByStudentProfileId(Long profileId);
}
