import axiosInstance from './axiosInstance'
import { DeckWithStats, DeckDetailsResponse } from '../types/deck'
import { Card } from '../types/card';

type AddCardPayload = Omit<Card, 'id' | 'deck_id'> & { deck_id: number };

interface BulkAddCardsPayload {
    deck_id: number;
    cards: Omit<Card, 'id' | 'deck_id'>[];
}

interface BulkAddCardsResponse {
    successCount: number;
    newCards: Card[];
}

export const getMyDecksWithStats = () => {
    return axiosInstance.get<DeckWithStats[]>('/me/decks/stats');
}

export const getDeckDetails = (deckId: string) => {
    return axiosInstance.get<DeckWithStats>(`/decks/${deckId}`);
}

export const getDeckWithCards = ( deckId: string ) => {
    return axiosInstance.get<DeckDetailsResponse>(`/decks/${deckId}/cards`);
}

export const addCard = (data: AddCardPayload) => {
    return axiosInstance.post<Card>('/cards/add', data);
}

export const bulkAddCards = (data: BulkAddCardsPayload) => {
    return axiosInstance.post<BulkAddCardsResponse>('/cards/batch-add', data);
}