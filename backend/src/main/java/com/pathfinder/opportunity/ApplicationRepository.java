package com.pathfinder.opportunity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentProfileIdOrderByAppliedAtDesc(Long studentProfileId);
    Optional<Application> findByStudentProfileIdAndOpportunityId(Long studentProfileId, Long opportunityId);
}
