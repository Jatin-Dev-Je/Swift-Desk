package com.ticketing.dto;

import com.ticketing.model.Ticket.Priority;
import com.ticketing.model.Ticket.Status;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class TicketResponse {
    private Long id;
    private String subject;
    private String description;
    private Priority priority;
    private Status status;
    private UserResponse owner;
    private UserResponse assignee;
    private Instant createdAt;
    private Instant updatedAt;
    private List<CommentResponse> comments;
}
