import axiosInstance from './axiosInstance'
import { DeckWithStats } from '../types/deck'

export const getMyDecksWithStats = () => {
    return axiosInstance.get<DeckWithStats[]>('/me/decks/stats');
}