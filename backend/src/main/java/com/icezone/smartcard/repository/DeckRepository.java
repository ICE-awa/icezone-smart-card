package com.icezone.smartcard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.icezone.smartcard.entity.Deck;
import com.icezone.smartcard.entity.DeckVisibility;

public interface DeckRepository extends JpaRepository<Deck, Long> {
    List<Deck> findByOwnerIdOrVisibility(Long ownerId, DeckVisibility visibility);
}
