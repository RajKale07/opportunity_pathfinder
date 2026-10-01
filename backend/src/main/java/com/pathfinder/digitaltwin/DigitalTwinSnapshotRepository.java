package com.pathfinder.digitaltwin;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DigitalTwinSnapshotRepository extends JpaRepository<DigitalTwinSnapshot, Long> {
    List<DigitalTwinSnapshot> findByStudentProfileIdOrderByVersionAsc(Long profileId);
    Optional<DigitalTwinSnapshot> findTopByStudentProfileIdOrderByVersionDesc(Long profileId);
}
