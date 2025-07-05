package com.icezone.smartcard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icezone.smartcard.dto.deck.DeckDetailDto;
import com.icezone.smartcard.dto.deck.DeckStatsDto;
import com.icezone.smartcard.service.DeckService;

@RestController
@RequestMapping("/api")
public class DeckController {
    @Autowired
    private DeckService deckService;

    @GetMapping("/me/decks/stats")
    public ResponseEntity<List<DeckStatsDto>> getMyDeckStats() {
        List<DeckStatsDto> stats = deckService.getDeckStatsForCurrentUser();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/decks/{deckId}/cards")
    public ResponseEntity<?> getDeckDetails(@PathVariable Long deckId) {
        try {
            DeckDetailDto deckDetails = deckService.getDeckWithCards(deckId);
            return ResponseEntity.ok(deckDetails);
        } catch (IllegalArgumentException e) {  
            return ResponseEntity.notFound().build();
        }
    }
}
