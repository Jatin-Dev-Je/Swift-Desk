package com.ticketing.service;

import com.ticketing.config.JwtUtil;
import com.ticketing.dto.LoginRequest;
import com.ticketing.dto.LoginResponse;
import com.ticketing.dto.SignupRequest;
import com.ticketing.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    public LoginResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);
        
        User user = userService.getUserEntityByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String role = user.getRoles().stream()
                .findFirst()
                .map(role1 -> role1.getName())
                .orElse("USER");

        return new LoginResponse(token, user.getUsername(), user.getEmail(), role);
    }

    public LoginResponse signup(SignupRequest signupRequest) {
        // Check if username already exists
        if (userService.getUserEntityByUsername(signupRequest.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        // Check if email already exists
        if (userService.getUserEntityByEmail(signupRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user with USER role
        User user = userService.createUserEntity(
                signupRequest.getUsername(),
                signupRequest.getEmail(),
                signupRequest.getPassword(),
                java.util.Set.of("USER")
        );

        // Generate token for immediate login
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities("ROLE_USER")
                .build();

        String token = jwtUtil.generateToken(userDetails);

        return new LoginResponse(token, user.getUsername(), user.getEmail(), "USER");
    }

    public LoginResponse getCurrentUser(String username) {
        User user = userService.getUserEntityByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String role = user.getRoles().stream()
                .findFirst()
                .map(role1 -> role1.getName())
                .orElse("USER");

        return new LoginResponse(null, user.getUsername(), user.getEmail(), role);
    }
}
