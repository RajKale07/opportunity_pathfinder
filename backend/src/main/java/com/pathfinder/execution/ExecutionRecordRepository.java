package com.pathfinder.execution;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExecutionRecordRepository extends JpaRepository<ExecutionRecord, Long> {
    List<ExecutionRecord> findByStudentProfileIdOrderByRecordedAtDesc(Long studentProfileId);
}
