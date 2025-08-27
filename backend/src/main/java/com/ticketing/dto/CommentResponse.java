package com.ticketing.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class CommentResponse {
    private Long id;
    private String body;
    private UserResponse author;
    private Instant createdAt;
}
