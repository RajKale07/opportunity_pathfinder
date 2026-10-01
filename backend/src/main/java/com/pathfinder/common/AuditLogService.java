package com.pathfinder.common;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {
    private static final Logger log = LoggerFactory.getLogger(AuditLogService.class);
    private final AuditLogRepository auditLogRepository;

    @Transactional
    public void logEvent(String eventType, Long userId, String entityType, Long entityId, String details) {
        log.info("[AUDIT] Event: {} | User: {} | Target: {}:{} | Details: {}", eventType, userId, entityType, entityId, details);
        AuditLog auditLog = AuditLog.builder()
                .eventType(eventType)
                .userId(userId)
                .entityType(entityType)
                .entityId(entityId)
                .details(details)
                .createdAt(Instant.now())
                .build();
        auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getLogsForUser(Long userId) {
        return auditLogRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop50ByOrderByCreatedAtDesc();
    }
}
