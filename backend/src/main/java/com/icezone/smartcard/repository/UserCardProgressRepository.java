package com.icezone.smartcard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.icezone.smartcard.entity.UserCardProgress;
import com.icezone.smartcard.entity.UserCardProgressId;

public interface UserCardProgressRepository extends JpaRepository<UserCardProgress, UserCardProgressId> {
    @Query("SELECT COUNT(p) FROM UserCardProgress p WHERE p.user.id = :userId And p.card.deck.id = :deckId AND p.isLearned = true")
    int countLearnedCardsInDeck(Long userId, Long deckId);
}
