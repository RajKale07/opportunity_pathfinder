package com.pathfinder.interview;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewAssessmentRepository extends JpaRepository<InterviewAssessment, Long> {
    List<InterviewAssessment> findByStudentProfileIdOrderByTimestampDesc(Long studentProfileId);
}
