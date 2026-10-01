package com.pathfinder.auth;

import com.pathfinder.common.AppException;
import com.pathfinder.common.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuditLogService auditLogService;

    @Transactional
    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new AppException("An account with this email already exists", HttpStatus.CONFLICT);
        }

        Role assignedRole = request.getRole() != null ? request.getRole() : Role.ROLE_STUDENT;

        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .fullName(request.getFullName().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(assignedRole)
                .build();

        User savedUser = userRepository.save(user);

        auditLogService.logEvent(
                "USER_REGISTERED",
                savedUser.getId(),
                "User",
                savedUser.getId(),
                "User registered with role: " + savedUser.getRole()
        );

        String token = tokenProvider.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole());

        return AuthDto.AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(toUserSummary(savedUser))
                .build();
    }

    @Transactional(readOnly = true)
    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new AppException("Invalid email or password", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AppException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        auditLogService.logEvent(
                "USER_LOGGED_IN",
                user.getId(),
                "User",
                user.getId(),
                "User logged in successfully"
        );

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());

        return AuthDto.AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(toUserSummary(user))
                .build();
    }

    @Transactional(readOnly = true)
    public AuthDto.UserSummary getCurrentUserSummary(User user) {
        return toUserSummary(user);
    }

    private AuthDto.UserSummary toUserSummary(User user) {
        return AuthDto.UserSummary.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }
}
