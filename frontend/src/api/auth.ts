import axiosInstance from './axiosInstance';
import { User } from '../types/user';

interface RegisterData {
    username: string;
    password: string;
}

export const registerUser = (data: RegisterData) => {
    return axiosInstance.post('/auth/register', data);
};

interface LoginData extends RegisterData {}

interface LoginResponse {
    token: string;
    user: User;
}

export const loginUser = (data: LoginData) => {
    return axiosInstance.post<LoginResponse>('/auth/login', data);
};