package com.icezone.smartcard.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.icezone.smartcard.dto.deck.DeckStatsDto;
import com.icezone.smartcard.entity.Deck;
import com.icezone.smartcard.entity.DeckVisibility;
import com.icezone.smartcard.entity.User;
import com.icezone.smartcard.repository.CardRepository;
import com.icezone.smartcard.repository.DeckRepository;
import com.icezone.smartcard.repository.UserCardProgressRepository;
import com.icezone.smartcard.repository.UserRepository;

@Service
public class DeckService {
    
    @Autowired
    private DeckRepository deckRepository;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private UserCardProgressRepository userCardProgressRepository;

    @Autowired
    private UserRepository userRepository;

    public List<DeckStatsDto> getDeckStatsForCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalStateException("当前登录用户不存在"));
        Long userId = currentUser.getId();

        List<Deck> accessibleDecks = deckRepository.findByOwnerIdOrVisibility(userId, DeckVisibility.PUBLIC);
        
        return accessibleDecks.stream().map(deck -> {
            int totalCards = cardRepository.countByDeckId(deck.getId());
            int learnedCount = userCardProgressRepository.countLearnedCardsInDeck(userId, deck.getId());
            return new DeckStatsDto(deck.getId(), deck.getName(), totalCards, learnedCount);
        }).collect(Collectors.toList());
    }
}
