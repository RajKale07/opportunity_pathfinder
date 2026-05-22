package com.opportunitypathfinder.service;

import com.opportunitypathfinder.dto.AuthDto.*;
import com.opportunitypathfinder.model.User;
import com.opportunitypathfinder.repository.UserRepository;
import com.opportunitypathfinder.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final JavaMailSender mailSender;

    public String register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already registered");

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setOtp(generateOtp());
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        sendOtp(user.getEmail(), user.getOtp());
        return "Registration successful. Check your email for OTP.";
    }

    public String verifyOtp(OtpRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isVerified()) return "Already verified";
        if (!user.getOtp().equals(req.getOtp())) throw new RuntimeException("Invalid OTP");
        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) throw new RuntimeException("OTP expired");

        user.setVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
        return "Email verified successfully";
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!user.isVerified()) throw new RuntimeException("Please verify your email first");
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid credentials");

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getName(), user.getEmail(), user.getRole().name());
    }

    private String generateOtp() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }

    private void sendOtp(String email, String otp) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(email);
        msg.setSubject("Opportunity Pathfinder - Email Verification");
        msg.setText("Your OTP is: " + otp + "\nValid for 10 minutes.");
        mailSender.send(msg);
    }
}
