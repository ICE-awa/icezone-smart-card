package com.icezone.smartcard.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.icezone.smartcard.dto.card.CardDetailDto;
import com.icezone.smartcard.dto.deck.DeckDetailDto;
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

    @Autowired
    private ObjectMapper objectMapper;

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

    public DeckDetailDto getDeckWithCards (Long deckId) {
        Deck deck = deckRepository.findById(deckId)
            .orElseThrow(() -> new IllegalArgumentException("ID 为 " + deckId + " 的卡片组不存在！"));
        
            List<CardDetailDto> cardDtos = deck.getCards().stream().map(card -> {
                CardDetailDto dto = new CardDetailDto();
                dto.setId(card.getId());
                dto.setDeckId(card.getDeck().getId());
                dto.setCardType(card.getCardType());
                dto.setQuestion(card.getQuestion());
                dto.setAnswer(card.getAnswer());
                if (card.getOptions() != null && !card.getOptions().isEmpty()) {
                    try {
                        Map<String, Object> optionsMap = objectMapper.readValue(card.getOptions(), new TypeReference<>() {});
                        dto.setOptions(optionsMap);
                    } catch (Exception e) {
                        dto.setOptions(null);
                    }
                }
                return dto;
            }).collect(Collectors.toList());

            DeckDetailDto deckDetailDto = new DeckDetailDto();
            deckDetailDto.setId(deck.getId());
            deckDetailDto.setName(deck.getName());
            deckDetailDto.setOwnerId(deck.getOwner().getId());
            deckDetailDto.setVisibility(deck.getVisibility());
            deckDetailDto.setCards(cardDtos);

            return deckDetailDto;
    }
}
