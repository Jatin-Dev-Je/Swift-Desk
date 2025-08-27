package com.ticketing.config;

import com.ticketing.model.Role;
import com.ticketing.model.User;
import com.ticketing.repository.RoleRepository;
import com.ticketing.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
        initializeUsers();
    }

    private void initializeRoles() {
        if (roleRepository.count() == 0) {
            log.info("Initializing roles...");
            
            Role adminRole = Role.builder().name("ADMIN").build();
            Role agentRole = Role.builder().name("AGENT").build();
            Role userRole = Role.builder().name("USER").build();
            
            roleRepository.save(adminRole);
            roleRepository.save(agentRole);
            roleRepository.save(userRole);
            
            log.info("Roles initialized successfully");
        }
    }

    private void initializeUsers() {
        if (userRepository.count() == 0) {
            log.info("Initializing users...");
            
            Role adminRole = roleRepository.findByName("ADMIN").orElseThrow();
            Role agentRole = roleRepository.findByName("AGENT").orElseThrow();
            Role userRole = roleRepository.findByName("USER").orElseThrow();
            
            // Create admin user
            User admin = User.builder()
                    .username("admin")
                    .email("admin@ticketing.com")
                    .password(passwordEncoder.encode("admin123"))
                    .roles(Set.of(adminRole))
                    .build();
            userRepository.save(admin);
            
            // Create agent user
            User agent = User.builder()
                    .username("agent")
                    .email("agent@ticketing.com")
                    .password(passwordEncoder.encode("agent123"))
                    .roles(Set.of(agentRole))
                    .build();
            userRepository.save(agent);
            
            // Create regular user
            User user = User.builder()
                    .username("user")
                    .email("user@ticketing.com")
                    .password(passwordEncoder.encode("user123"))
                    .roles(Set.of(userRole))
                    .build();
            userRepository.save(user);
            
            log.info("Users initialized successfully");
            log.info("Default credentials:");
            log.info("Admin: admin/admin123");
            log.info("Agent: agent/agent123");
            log.info("User: user/user123");
        }
    }
}
