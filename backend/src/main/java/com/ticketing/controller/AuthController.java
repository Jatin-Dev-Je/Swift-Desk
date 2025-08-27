package com.ticketing.controller;

import com.ticketing.dto.LoginRequest;
import com.ticketing.dto.LoginResponse;
import com.ticketing.dto.SignupRequest;
import com.ticketing.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        // JWT tokens are stateless, so logout is handled client-side by removing the token
        return ResponseEntity.ok("Logged out successfully");
    }

    @PostMapping("/signup")
    public ResponseEntity<LoginResponse> signup(@Valid @RequestBody SignupRequest signupRequest) {
        LoginResponse response = authService.signup(signupRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<LoginResponse> getCurrentUser(org.springframework.security.core.Authentication authentication) {
        String username = authentication.getName();
        LoginResponse response = authService.getCurrentUser(username);
        return ResponseEntity.ok(response);
    }
}
