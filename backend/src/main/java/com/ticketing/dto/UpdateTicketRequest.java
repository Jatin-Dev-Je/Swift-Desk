package com.ticketing.dto;

import com.ticketing.model.Ticket.Priority;
import com.ticketing.model.Ticket.Status;
import lombok.Data;

@Data
public class UpdateTicketRequest {
    private String subject;
    private String description;
    private Priority priority;
    private Status status;
    private Long assigneeId;
}
