package com.icezone.smartcard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.icezone.smartcard.entity.Card;

public interface CardRepository extends JpaRepository<Card, Long> {
    int countByDeckId(Long deckId);
}
