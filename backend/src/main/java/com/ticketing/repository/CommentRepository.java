package com.ticketing.repository;

import com.ticketing.model.Comment;
import com.ticketing.model.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
	Page<Comment> findByTicketOrderByCreatedAtAsc(Ticket ticket, Pageable pageable);
}
