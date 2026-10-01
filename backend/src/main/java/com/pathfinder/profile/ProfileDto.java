package com.pathfinder.profile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public class ProfileDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProfileResponse {
        private Long id;
        private Long userId;
        private String email;
        private String fullName;
        private String headline;
        private String biography;
        private String currentDegree;
        private String major;
        private String institution;
        private Integer graduationYear;
        private Double gpa;
        private String preferredDomain;
        private String targetRole;
        private String preferredLocations;
        private String remotePreference;
        private Integer weeklyAvailableHours;
        private Boolean higherStudyInterest;
        private Boolean startupInterest;
        private Double salaryExpectationMin;
        private Double salaryExpectationMax;
        private String githubUrl;
        private String linkedinUrl;
        private String portfolioUrl;
        private String resumeText;
        private List<EducationDto> educations;
        private List<CareerGoalDto> careerGoals;
        private List<ProjectDto> projects;
        private List<AchievementDto> achievements;
        private Instant createdAt;
        private Instant updatedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateProfileRequest {
        private String headline;
        private String biography;
        private String currentDegree;
        private String major;
        private String institution;
        private Integer graduationYear;
        private Double gpa;
        private String preferredDomain;
        private String targetRole;
        private String preferredLocations;
        private String remotePreference;
        private Integer weeklyAvailableHours;
        private Boolean higherStudyInterest;
        private Boolean startupInterest;
        private Double salaryExpectationMin;
        private Double salaryExpectationMax;
        private String githubUrl;
        private String linkedinUrl;
        private String portfolioUrl;
        private String resumeText;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EducationDto {
        private Long id;
        private String institution;
        private String degree;
        private String fieldOfStudy;
        private Integer startYear;
        private Integer endYear;
        private Double gpa;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CareerGoalDto {
        private Long id;
        private String targetRole;
        private String careerDomain;
        private CareerGoal.PriorityLevel priorityLevel;
        private Integer timeframeMonths;
        private CareerGoal.GoalStatus status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectDto {
        private Long id;
        private String title;
        private String description;
        private String techStack;
        private String repoUrl;
        private String liveUrl;
        private Integer complexityScore;
        private Instant completedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AchievementDto {
        private Long id;
        private String title;
        private Achievement.Category category;
        private String issuer;
        private LocalDate dateEarned;
        private String verificationUrl;
    }
}
