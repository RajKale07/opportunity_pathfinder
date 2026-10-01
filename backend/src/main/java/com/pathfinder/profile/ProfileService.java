package com.pathfinder.profile;

import com.pathfinder.auth.User;
import com.pathfinder.common.AppException;
import com.pathfinder.common.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final StudentProfileRepository profileRepository;
    private final EducationRepository educationRepository;
    private final CareerGoalRepository careerGoalRepository;
    private final ProjectRepository projectRepository;
    private final AchievementRepository achievementRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public StudentProfile getOrCreateProfile(User user) {
        return profileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    StudentProfile profile = StudentProfile.builder()
                            .user(user)
                            .headline("Aspiring Software Professional")
                            .preferredDomain("Backend Development")
                            .targetRole("Backend Developer")
                            .build();
                    StudentProfile saved = profileRepository.save(profile);
                    auditLogService.logEvent("PROFILE_INITIALIZED", user.getId(), "StudentProfile", saved.getId(), "Initialized default student profile");
                    return saved;
                });
    }

    @Transactional(readOnly = true)
    public ProfileDto.ProfileResponse getProfileResponse(User user) {
        StudentProfile profile = getOrCreateProfile(user);
        return toProfileResponse(profile, user);
    }

    @Transactional
    public ProfileDto.ProfileResponse updateProfile(User user, ProfileDto.UpdateProfileRequest request) {
        StudentProfile profile = getOrCreateProfile(user);

        if (request.getHeadline() != null) profile.setHeadline(request.getHeadline());
        if (request.getBiography() != null) profile.setBiography(request.getBiography());
        if (request.getCurrentDegree() != null) profile.setCurrentDegree(request.getCurrentDegree());
        if (request.getMajor() != null) profile.setMajor(request.getMajor());
        if (request.getInstitution() != null) profile.setInstitution(request.getInstitution());
        if (request.getGraduationYear() != null) profile.setGraduationYear(request.getGraduationYear());
        if (request.getGpa() != null) profile.setGpa(request.getGpa());
        if (request.getPreferredDomain() != null) profile.setPreferredDomain(request.getPreferredDomain());
        if (request.getTargetRole() != null) profile.setTargetRole(request.getTargetRole());
        if (request.getPreferredLocations() != null) profile.setPreferredLocations(request.getPreferredLocations());
        if (request.getRemotePreference() != null) profile.setRemotePreference(request.getRemotePreference());
        if (request.getWeeklyAvailableHours() != null) profile.setWeeklyAvailableHours(request.getWeeklyAvailableHours());
        if (request.getHigherStudyInterest() != null) profile.setHigherStudyInterest(request.getHigherStudyInterest());
        if (request.getStartupInterest() != null) profile.setStartupInterest(request.getStartupInterest());
        if (request.getSalaryExpectationMin() != null) profile.setSalaryExpectationMin(request.getSalaryExpectationMin());
        if (request.getSalaryExpectationMax() != null) profile.setSalaryExpectationMax(request.getSalaryExpectationMax());
        if (request.getGithubUrl() != null) profile.setGithubUrl(request.getGithubUrl());
        if (request.getLinkedinUrl() != null) profile.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getPortfolioUrl() != null) profile.setPortfolioUrl(request.getPortfolioUrl());
        if (request.getResumeText() != null) profile.setResumeText(request.getResumeText());

        StudentProfile updated = profileRepository.save(profile);

        auditLogService.logEvent("PROFILE_UPDATED", user.getId(), "StudentProfile", updated.getId(), "Updated profile details and career preferences");

        return toProfileResponse(updated, user);
    }

    @Transactional
    public ProfileDto.ProjectDto addProject(User user, ProfileDto.ProjectDto dto) {
        StudentProfile profile = getOrCreateProfile(user);
        Project project = Project.builder()
                .studentProfile(profile)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .techStack(dto.getTechStack())
                .repoUrl(dto.getRepoUrl())
                .liveUrl(dto.getLiveUrl())
                .complexityScore(dto.getComplexityScore() != null ? dto.getComplexityScore() : 5)
                .completedAt(dto.getCompletedAt())
                .build();
        Project saved = projectRepository.save(project);
        auditLogService.logEvent("PROJECT_ADDED", user.getId(), "Project", saved.getId(), "Added project: " + saved.getTitle());
        return toProjectDto(saved);
    }

    @Transactional
    public ProfileDto.CareerGoalDto addCareerGoal(User user, ProfileDto.CareerGoalDto dto) {
        StudentProfile profile = getOrCreateProfile(user);
        CareerGoal goal = CareerGoal.builder()
                .studentProfile(profile)
                .targetRole(dto.getTargetRole())
                .careerDomain(dto.getCareerDomain())
                .priorityLevel(dto.getPriorityLevel() != null ? dto.getPriorityLevel() : CareerGoal.PriorityLevel.PRIMARY)
                .timeframeMonths(dto.getTimeframeMonths() != null ? dto.getTimeframeMonths() : 12)
                .status(dto.getStatus() != null ? dto.getStatus() : CareerGoal.GoalStatus.ACTIVE)
                .build();
        CareerGoal saved = careerGoalRepository.save(goal);
        auditLogService.logEvent("CAREER_GOAL_ADDED", user.getId(), "CareerGoal", saved.getId(), "Added goal: " + saved.getTargetRole());
        return toCareerGoalDto(saved);
    }

    public ProfileDto.ProfileResponse toProfileResponse(StudentProfile profile, User user) {
        List<Education> educations = educationRepository.findByStudentProfileId(profile.getId());
        List<CareerGoal> goals = careerGoalRepository.findByStudentProfileId(profile.getId());
        List<Project> projects = projectRepository.findByStudentProfileId(profile.getId());
        List<Achievement> achievements = achievementRepository.findByStudentProfileId(profile.getId());

        return ProfileDto.ProfileResponse.builder()
                .id(profile.getId())
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .headline(profile.getHeadline())
                .biography(profile.getBiography())
                .currentDegree(profile.getCurrentDegree())
                .major(profile.getMajor())
                .institution(profile.getInstitution())
                .graduationYear(profile.getGraduationYear())
                .gpa(profile.getGpa())
                .preferredDomain(profile.getPreferredDomain())
                .targetRole(profile.getTargetRole())
                .preferredLocations(profile.getPreferredLocations())
                .remotePreference(profile.getRemotePreference())
                .weeklyAvailableHours(profile.getWeeklyAvailableHours())
                .higherStudyInterest(profile.getHigherStudyInterest())
                .startupInterest(profile.getStartupInterest())
                .salaryExpectationMin(profile.getSalaryExpectationMin())
                .salaryExpectationMax(profile.getSalaryExpectationMax())
                .githubUrl(profile.getGithubUrl())
                .linkedinUrl(profile.getLinkedinUrl())
                .portfolioUrl(profile.getPortfolioUrl())
                .resumeText(profile.getResumeText())
                .educations(educations.stream().map(this::toEducationDto).collect(Collectors.toList()))
                .careerGoals(goals.stream().map(this::toCareerGoalDto).collect(Collectors.toList()))
                .projects(projects.stream().map(this::toProjectDto).collect(Collectors.toList()))
                .achievements(achievements.stream().map(this::toAchievementDto).collect(Collectors.toList()))
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }

    private ProfileDto.EducationDto toEducationDto(Education e) {
        return ProfileDto.EducationDto.builder()
                .id(e.getId())
                .institution(e.getInstitution())
                .degree(e.getDegree())
                .fieldOfStudy(e.getFieldOfStudy())
                .startYear(e.getStartYear())
                .endYear(e.getEndYear())
                .gpa(e.getGpa())
                .build();
    }

    private ProfileDto.CareerGoalDto toCareerGoalDto(CareerGoal g) {
        return ProfileDto.CareerGoalDto.builder()
                .id(g.getId())
                .targetRole(g.getTargetRole())
                .careerDomain(g.getCareerDomain())
                .priorityLevel(g.getPriorityLevel())
                .timeframeMonths(g.getTimeframeMonths())
                .status(g.getStatus())
                .build();
    }

    private ProfileDto.ProjectDto toProjectDto(Project p) {
        return ProfileDto.ProjectDto.builder()
                .id(p.getId())
                .title(p.getTitle())
                .description(p.getDescription())
                .techStack(p.getTechStack())
                .repoUrl(p.getRepoUrl())
                .liveUrl(p.getLiveUrl())
                .complexityScore(p.getComplexityScore())
                .completedAt(p.getCompletedAt())
                .build();
    }

    private ProfileDto.AchievementDto toAchievementDto(Achievement a) {
        return ProfileDto.AchievementDto.builder()
                .id(a.getId())
                .title(a.getTitle())
                .category(a.getCategory())
                .issuer(a.getIssuer())
                .dateEarned(a.getDateEarned())
                .verificationUrl(a.getVerificationUrl())
                .build();
    }
}
