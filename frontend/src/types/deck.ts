import { Card } from './card'

export interface DeckWithStats {
    id: number;
    name: string;
    totalCards: number;
    myLearnedCount: number;
}

export interface DeckDetailsResponse {
    id: number;
    name: string;
    owner_id: number;
    visibility: 'PUBLIC' | 'PRIVATE' | 'HIDDEN';
    cards: Card[];
}