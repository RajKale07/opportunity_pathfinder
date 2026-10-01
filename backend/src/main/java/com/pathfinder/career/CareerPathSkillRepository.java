package com.pathfinder.career;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareerPathSkillRepository extends JpaRepository<CareerPathSkill, Long> {
    List<CareerPathSkill> findByCareerPathId(Long careerPathId);
}
