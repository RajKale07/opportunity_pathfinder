package com.pathfinder.auth;

import com.pathfinder.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user registration, authentication, and token management")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user (Student, Researcher, or Admin)")
    public ResponseEntity<ApiResponse<AuthDto.AuthResponse>> register(@Valid @RequestBody AuthDto.RegisterRequest request) {
        AuthDto.AuthResponse response = authService.register(request);
        return new ResponseEntity<>(ApiResponse.ok("Registration successful", response), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and receive JWT bearer token")
    public ResponseEntity<ApiResponse<AuthDto.AuthResponse>> login(@Valid @RequestBody AuthDto.LoginRequest request) {
        AuthDto.AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Get currently authenticated user details")
    public ResponseEntity<ApiResponse<AuthDto.UserSummary>> getCurrentUser(@AuthenticationPrincipal User user) {
        AuthDto.UserSummary summary = authService.getCurrentUserSummary(user);
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }
}
