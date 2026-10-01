package com.pathfinder.intelligence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuccessEventRepository extends JpaRepository<SuccessEvent, Long> {
    List<SuccessEvent> findByStudentProfileIdOrderByTimestampDesc(Long profileId);
}
