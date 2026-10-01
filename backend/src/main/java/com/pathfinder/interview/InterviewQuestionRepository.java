package com.pathfinder.interview;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, Long> {
    List<InterviewQuestion> findByType(InterviewQuestion.QuestionType type);
    List<InterviewQuestion> findByTargetSkillId(Long skillId);
}
