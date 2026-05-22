package com.opportunitypathfinder.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDto {

    @Data
    public static class RegisterRequest {
        @NotBlank private String name;
        @Email @NotBlank private String email;
        @Size(min = 6) private String password;
    }

    @Data
    public static class LoginRequest {
        @Email @NotBlank private String email;
        @NotBlank private String password;
    }

    @Data
    public static class OtpRequest {
        @Email @NotBlank private String email;
        @NotBlank private String otp;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String name;
        private String email;
        private String role;

        public AuthResponse(String token, String name, String email, String role) {
            this.token = token;
            this.name = name;
            this.email = email;
            this.role = role;
        }
    }
}
