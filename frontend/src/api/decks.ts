import axiosInstance from './axiosInstance'
import { DeckWithStats, DeckDetailsResponse } from '../types/deck'
import { Card } from '../types/card';

export const getMyDecksWithStats = () => {
    return axiosInstance.get<DeckWithStats[]>('/me/decks/stats');
}

export const getDeckDetails = (deckId: string) => {
    return axiosInstance.get<DeckWithStats>(`/decks/${deckId}`);
}

export const getDeckWithCards = ( deckId: string ) => {
    return axiosInstance.get<DeckDetailsResponse>(`/decks/${deckId}/cards`);
}