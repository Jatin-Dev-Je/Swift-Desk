package com.ticketing.controller;

import com.ticketing.dto.AddCommentRequest;
import com.ticketing.dto.CreateTicketRequest;
import com.ticketing.dto.TicketResponse;
import com.ticketing.dto.UpdateTicketRequest;
import com.ticketing.model.Ticket;
import com.ticketing.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @GetMapping
    public ResponseEntity<Page<TicketResponse>> getAllTickets(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Long assigneeId,
            Pageable pageable) {
        
        Ticket.Status statusEnum = status != null ? Ticket.Status.valueOf(status.toUpperCase()) : null;
        Ticket.Priority priorityEnum = priority != null ? Ticket.Priority.valueOf(priority.toUpperCase()) : null;
        
        Page<TicketResponse> tickets = ticketService.getAllTicketsWithFilters(search, statusEnum, priorityEnum, assigneeId, pageable);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/my-tickets")
    public ResponseEntity<Page<TicketResponse>> getMyTickets(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            Pageable pageable, 
            Authentication authentication) {
        
        String username = authentication.getName();
        Ticket.Status statusEnum = status != null ? Ticket.Status.valueOf(status.toUpperCase()) : null;
        Ticket.Priority priorityEnum = priority != null ? Ticket.Priority.valueOf(priority.toUpperCase()) : null;
        
        Page<TicketResponse> tickets = ticketService.getMyTicketsWithFilters(username, search, statusEnum, priorityEnum, pageable);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/assigned")
    public ResponseEntity<Page<TicketResponse>> getAssignedTickets(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            Pageable pageable, 
            Authentication authentication) {
        
        String username = authentication.getName();
        Ticket.Status statusEnum = status != null ? Ticket.Status.valueOf(status.toUpperCase()) : null;
        Ticket.Priority priorityEnum = priority != null ? Ticket.Priority.valueOf(priority.toUpperCase()) : null;
        
        Page<TicketResponse> tickets = ticketService.getAssignedTicketsWithFilters(username, search, statusEnum, priorityEnum, pageable);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(@Valid @RequestBody CreateTicketRequest request, Authentication authentication) {
        String username = authentication.getName();
        TicketResponse ticket = ticketService.createTicket(request, username);
        return ResponseEntity.ok(ticket);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TicketResponse> updateTicket(@PathVariable Long id, @RequestBody UpdateTicketRequest request, Authentication authentication) {
        String username = authentication.getName();
        TicketResponse ticket = ticketService.updateTicket(id, request, username);
        return ResponseEntity.ok(ticket);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        ticketService.deleteTicket(id, username);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketResponse> addComment(@PathVariable Long id, @Valid @RequestBody AddCommentRequest request, Authentication authentication) {
        String username = authentication.getName();
        ticketService.addComment(id, request, username);
        return ticketService.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<TicketResponse>> getTicketComments(@PathVariable Long id) {
        // Comments are included in the ticket response, so we return the ticket
        return ticketService.getTicketById(id)
                .map(ticket -> ResponseEntity.ok(List.of(ticket)))
                .orElse(ResponseEntity.notFound().build());
    }
}
