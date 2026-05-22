package com.opportunitypathfinder.repository;

import com.opportunitypathfinder.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByUserId(Long userId);
    boolean existsByUserIdAndSkillName(Long userId, String skillName);
}
