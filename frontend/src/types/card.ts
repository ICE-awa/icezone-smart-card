export interface Card {
    id: number;
    deck_id: number;
    card_type: 'WORD' | 'CHOICE' | 'TRUE_FALSE';
    question: string;
    answer: string;
    options: Record<string, string> | null;
    created_at: string;
}