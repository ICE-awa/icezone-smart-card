package com.icezone.smartcard.dto.deck;

import java.util.List;

import com.icezone.smartcard.dto.card.CardDetailDto;
import com.icezone.smartcard.entity.DeckVisibility;

import lombok.Data;

@Data
public class DeckDetailDto {
    private Long id;
    private String name;
    private Long ownerId;
    private DeckVisibility visibility;
    private List<CardDetailDto> cards;
}
