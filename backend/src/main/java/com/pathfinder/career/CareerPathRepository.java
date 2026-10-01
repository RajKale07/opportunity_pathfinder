package com.pathfinder.career;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CareerPathRepository extends JpaRepository<CareerPath, Long> {
    Optional<CareerPath> findByTitleIgnoreCase(String title);
    List<CareerPath> findByDomainIgnoreCase(String domain);
}
