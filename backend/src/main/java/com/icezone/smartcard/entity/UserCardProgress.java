package com.icezone.smartcard.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "user_card_progress")
@Data
@IdClass(UserCardProgressId.class)
public class UserCardProgress {
    
    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Id
    @ManyToOne
    @JoinColumn(name = "card_id")
    private Card card;

    @Column(name = "is_learned", nullable = false)
    private boolean isLearned = false;

    @Column(name = "consecutive_correct_count", nullable = false)
    private int consecutiveCorrectCount = 0;

    @Column(name = "ease_factor", nullable = false)
    private double easeFactor = 2.5;

    @Column(name = "interval_days", nullable = false)
    private int intervalDays;

    @Column(name = "next_review_at")
    private LocalDateTime nextReviewAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
