package com.icezone.smartcard.dto.card;

import java.util.Map;

import com.icezone.smartcard.entity.CardType;

import lombok.Data;

@Data
public class CardDetailDto {
    private Long id;
    private Long deckId;
    private CardType cardType;
    private String question;
    private String answer;
    private Map<String, Object> options;
}
