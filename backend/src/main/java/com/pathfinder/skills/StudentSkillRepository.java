package com.pathfinder.skills;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentSkillRepository extends JpaRepository<StudentSkill, Long> {
    List<StudentSkill> findByStudentProfileId(Long profileId);
    Optional<StudentSkill> findByStudentProfileIdAndSkillId(Long profileId, Long skillId);
    Optional<StudentSkill> findByStudentProfileIdAndSkill_NameIgnoreCase(Long profileId, String skillName);
}
