package com.pathfinder.adaptive;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdaptationEventRepository extends JpaRepository<AdaptationEvent, Long> {
    List<AdaptationEvent> findByStudentProfileIdOrderByTimestampDesc(Long profileId);
}
