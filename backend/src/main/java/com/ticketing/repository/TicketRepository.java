package com.ticketing.repository;

import com.ticketing.model.Ticket;
import com.ticketing.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
	Page<Ticket> findByOwner(User owner, Pageable pageable);
	Page<Ticket> findByAssignee(User assignee, Pageable pageable);
	
	// Search and filter methods
	@Query("SELECT t FROM Ticket t WHERE " +
		   "(:search IS NULL OR LOWER(t.subject) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
		   "(:status IS NULL OR t.status = :status) AND " +
		   "(:priority IS NULL OR t.priority = :priority) AND " +
		   "(:assigneeId IS NULL OR t.assignee.id = :assigneeId)")
	Page<Ticket> findTicketsWithFilters(@Param("search") String search,
										@Param("status") Ticket.Status status,
										@Param("priority") Ticket.Priority priority,
										@Param("assigneeId") Long assigneeId,
										Pageable pageable);
	
	@Query("SELECT t FROM Ticket t WHERE t.owner = :owner AND " +
		   "(:search IS NULL OR LOWER(t.subject) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
		   "(:status IS NULL OR t.status = :status) AND " +
		   "(:priority IS NULL OR t.priority = :priority)")
	Page<Ticket> findMyTicketsWithFilters(@Param("owner") User owner,
										  @Param("search") String search,
										  @Param("status") Ticket.Status status,
										  @Param("priority") Ticket.Priority priority,
										  Pageable pageable);
	
	@Query("SELECT t FROM Ticket t WHERE t.assignee = :assignee AND " +
		   "(:search IS NULL OR LOWER(t.subject) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
		   "(:status IS NULL OR t.status = :status) AND " +
		   "(:priority IS NULL OR t.priority = :priority)")
	Page<Ticket> findAssignedTicketsWithFilters(@Param("assignee") User assignee,
												@Param("search") String search,
												@Param("status") Ticket.Status status,
												@Param("priority") Ticket.Priority priority,
												Pageable pageable);
}
