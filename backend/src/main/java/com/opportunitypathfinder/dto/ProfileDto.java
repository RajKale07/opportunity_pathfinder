package com.opportunitypathfinder.dto;

import lombok.Data;

public class ProfileDto {

    @Data
    public static class ProfileRequest {
        private String fullName;
        private String phone;
        private String dob;
        private String gender;
        private String city;
        private String state;
        private String category;
        private String annualIncome;
        private String employmentStatus;
        private String tenthPercentage;
        private String twelfthPercentage;
        private String graduationCgpa;
        private String graduationDegree;
        private String graduationBranch;
        private String graduationYear;
        private String experience;
        private String githubUrl;
        private String linkedinUrl;
    }

    @Data
    public static class ProfileResponse {
        private Long id;
        private String fullName;
        private String phone;
        private String dob;
        private String gender;
        private String city;
        private String state;
        private String category;
        private String annualIncome;
        private String employmentStatus;
        private String tenthPercentage;
        private String twelfthPercentage;
        private String graduationCgpa;
        private String graduationDegree;
        private String graduationBranch;
        private String graduationYear;
        private String experience;
        private String githubUrl;
        private String linkedinUrl;
        private int completeness;
    }
}
