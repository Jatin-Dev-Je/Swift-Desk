package com.ticketing.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final DataSource dataSource;

    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("timestamp", System.currentTimeMillis());
        status.put("service", "Swift Desk Backend");
        status.put("version", "1.0.0");
        
        // Check database connectivity
        try (Connection connection = dataSource.getConnection()) {
            status.put("database", "UP");
        } catch (Exception e) {
            status.put("database", "DOWN");
            status.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(status);
    }

    @GetMapping("/ready")
    public ResponseEntity<Map<String, String>> readiness() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "READY");
        status.put("message", "Application is ready to serve requests");
        return ResponseEntity.ok(status);
    }

    @GetMapping("/live")
    public ResponseEntity<Map<String, String>> liveness() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "ALIVE");
        status.put("message", "Application is running");
        return ResponseEntity.ok(status);
    }
}
