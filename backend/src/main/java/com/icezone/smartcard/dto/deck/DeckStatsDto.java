package com.icezone.smartcard.dto.deck;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DeckStatsDto {
    private Long id;
    private String name;
    private int totalCards;
    private int myLearnedCount;
}
