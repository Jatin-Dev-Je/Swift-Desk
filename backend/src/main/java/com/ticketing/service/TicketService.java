package com.ticketing.service;

import com.ticketing.dto.AddCommentRequest;
import com.ticketing.dto.CommentResponse;
import com.ticketing.dto.CreateTicketRequest;
import com.ticketing.dto.TicketResponse;
import com.ticketing.dto.UpdateTicketRequest;
import com.ticketing.dto.UserResponse;
import com.ticketing.model.Comment;
import com.ticketing.model.Ticket;
import com.ticketing.model.User;
import com.ticketing.repository.CommentRepository;
import com.ticketing.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final CommentRepository commentRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public Page<TicketResponse> getAllTickets(Pageable pageable) {
        return ticketRepository.findAll(pageable)
                .map(this::mapToTicketResponse);
    }

    @Transactional(readOnly = true)
    public Page<TicketResponse> getAllTicketsWithFilters(String search, Ticket.Status status, 
                                                        Ticket.Priority priority, Long assigneeId, 
                                                        Pageable pageable) {
        return ticketRepository.findTicketsWithFilters(search, status, priority, assigneeId, pageable)
                .map(this::mapToTicketResponse);
    }

    @Transactional(readOnly = true)
    public Page<TicketResponse> getTicketsByOwner(String username, Pageable pageable) {
        User owner = userService.getUserEntityByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ticketRepository.findByOwner(owner, pageable)
                .map(this::mapToTicketResponse);
    }

    @Transactional(readOnly = true)
    public Page<TicketResponse> getMyTicketsWithFilters(String username, String search, 
                                                       Ticket.Status status, Ticket.Priority priority, 
                                                       Pageable pageable) {
        User owner = userService.getUserEntityByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ticketRepository.findMyTicketsWithFilters(owner, search, status, priority, pageable)
                .map(this::mapToTicketResponse);
    }

    @Transactional(readOnly = true)
    public Page<TicketResponse> getTicketsByAssignee(String username, Pageable pageable) {
        User assignee = userService.getUserEntityByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ticketRepository.findByAssignee(assignee, pageable)
                .map(this::mapToTicketResponse);
    }

    @Transactional(readOnly = true)
    public Page<TicketResponse> getAssignedTicketsWithFilters(String username, String search, 
                                                             Ticket.Status status, Ticket.Priority priority, 
                                                             Pageable pageable) {
        User assignee = userService.getUserEntityByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ticketRepository.findAssignedTicketsWithFilters(assignee, search, status, priority, pageable)
                .map(this::mapToTicketResponse);
    }

    @Transactional(readOnly = true)
    public Optional<TicketResponse> getTicketById(Long id) {
        return ticketRepository.findById(id)
                .map(this::mapToTicketResponse);
    }

    @Transactional
    public TicketResponse createTicket(CreateTicketRequest request, String username) {
        User owner = userService.getUserEntityByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ticket ticket = Ticket.builder()
                .subject(request.getSubject())
                .description(request.getDescription())
                .priority(request.getPriority())
                .status(Ticket.Status.OPEN)
                .owner(owner)
                .createdAt(Instant.now())
                .build();

        Ticket savedTicket = ticketRepository.save(ticket);
        return mapToTicketResponse(savedTicket);
    }

    @Transactional
    public TicketResponse updateTicket(Long ticketId, UpdateTicketRequest request, String username) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        User currentUser = userService.getUserEntityByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check permissions
        boolean isOwner = ticket.getOwner().getId().equals(currentUser.getId());
        boolean isAssignee = ticket.getAssignee() != null && ticket.getAssignee().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRoles().stream().anyMatch(role -> "ADMIN".equals(role.getName()));
        boolean isAgent = currentUser.getRoles().stream().anyMatch(role -> "AGENT".equals(role.getName()));

        if (!isOwner && !isAssignee && !isAdmin && !isAgent) {
            throw new RuntimeException("Access denied");
        }

        // Update fields
        if (request.getSubject() != null) {
            ticket.setSubject(request.getSubject());
        }
        if (request.getDescription() != null) {
            ticket.setDescription(request.getDescription());
        }
        if (request.getPriority() != null) {
            ticket.setPriority(request.getPriority());
        }
        if (request.getStatus() != null) {
            ticket.setStatus(request.getStatus());
        }
        if (request.getAssigneeId() != null) {
            User assignee = userService.getUserEntityById(request.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
            ticket.setAssignee(assignee);
        }

        ticket.setUpdatedAt(Instant.now());
        Ticket savedTicket = ticketRepository.save(ticket);
        return mapToTicketResponse(savedTicket);
    }

    @Transactional
    public CommentResponse addComment(Long ticketId, AddCommentRequest request, String username) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        User author = userService.getUserEntityByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = Comment.builder()
                .ticket(ticket)
                .author(author)
                .body(request.getBody())
                .createdAt(Instant.now())
                .build();

        Comment savedComment = commentRepository.save(comment);
        return mapToCommentResponse(savedComment);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getTicketComments(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        return commentRepository.findByTicketOrderByCreatedAtAsc(ticket, Pageable.unpaged())
                .getContent()
                .stream()
                .map(this::mapToCommentResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteTicket(Long ticketId, String username) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        User currentUser = userService.getUserEntityByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isOwner = ticket.getOwner().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRoles().stream().anyMatch(role -> "ADMIN".equals(role.getName()));

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Access denied");
        }

        ticketRepository.delete(ticket);
    }

    private TicketResponse mapToTicketResponse(Ticket ticket) {
        TicketResponse response = new TicketResponse();
        response.setId(ticket.getId());
        response.setSubject(ticket.getSubject());
        response.setDescription(ticket.getDescription());
        response.setPriority(ticket.getPriority());
        response.setStatus(ticket.getStatus());
        response.setOwner(mapToUserResponse(ticket.getOwner()));
        if (ticket.getAssignee() != null) {
            response.setAssignee(mapToUserResponse(ticket.getAssignee()));
        }
        response.setCreatedAt(ticket.getCreatedAt());
        response.setUpdatedAt(ticket.getUpdatedAt());
        
        // Load comments
        List<CommentResponse> comments = commentRepository.findByTicketOrderByCreatedAtAsc(ticket, Pageable.unpaged())
                .getContent()
                .stream()
                .map(this::mapToCommentResponse)
                .collect(Collectors.toList());
        response.setComments(comments);
        
        return response;
    }

    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setRoles(user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toSet()));
        return response;
    }

    private CommentResponse mapToCommentResponse(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setBody(comment.getBody());
        response.setAuthor(mapToUserResponse(comment.getAuthor()));
        response.setCreatedAt(comment.getCreatedAt());
        return response;
    }
}
