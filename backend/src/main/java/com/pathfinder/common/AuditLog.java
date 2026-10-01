package com.pathfinder.common;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String eventType;

    private Long userId;

    @Column(length = 2048)
    private String details;

    @Column(length = 64)
    private String entityType;

    private Long entityId;

    @Builder.Default
    @Column(nullable = false)
    private Instant createdAt = Instant.now();
}
