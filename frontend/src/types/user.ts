export interface User {
    id: number;
    username: string;
    role: 'USER' | 'ADMIN';
}