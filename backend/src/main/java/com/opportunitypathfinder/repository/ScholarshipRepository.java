package com.opportunitypathfinder.repository;

import com.opportunitypathfinder.model.Scholarship;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ScholarshipRepository extends JpaRepository<Scholarship, Long> {
    List<Scholarship> findByActiveTrue();
}
