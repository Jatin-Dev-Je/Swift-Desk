package com.ticketing.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "tickets")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Ticket {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String subject;

	@Column(nullable = false, columnDefinition = "text")
	private String description;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private Priority priority;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private Status status;

	@ManyToOne(optional = false)
	@JoinColumn(name = "owner_id")
	private User owner;

	@ManyToOne
	@JoinColumn(name = "assignee_id")
	private User assignee;

	@Column(nullable = false)
	private Instant createdAt;

	@Column
	private Instant updatedAt;

	public enum Status { OPEN, IN_PROGRESS, RESOLVED, CLOSED }
	public enum Priority { LOW, MEDIUM, HIGH, URGENT }
}
