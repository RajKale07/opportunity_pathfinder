package com.pathfinder.intelligence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FailureEventRepository extends JpaRepository<FailureEvent, Long> {
    List<FailureEvent> findByStudentProfileIdOrderByTimestampDesc(Long profileId);
    List<FailureEvent> findByStudentProfileIdAndIsResolvedFalse(Long profileId);
}
