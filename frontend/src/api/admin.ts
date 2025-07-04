import axiosInstance from './axiosInstance'
import { User } from '../types/user'
import axios from 'axios';

interface GetUsersResponse {
    content: User[];
}

interface BulkAddUserPayload {
    username: string;
    password: string;
    role?: 'USER' | 'ADMIN';
}

export interface BulkDeleteUserPayload {
    usernames: string[];
}

export const getUsers = () => {
    return axiosInstance.get<GetUsersResponse>('/admin/users');
}

export const deleteUser = (userId: number) => {
    return axiosInstance.delete(`/admin/users/${userId}`);
}

export const bulkAddUsers = (users: BulkAddUserPayload[]) => {
    return axiosInstance.post('/admin/users/batch-add', users);
}

export const bulkDeleteUsers = (data: BulkDeleteUserPayload) => {
    return axiosInstance.post('/admin/users/batch-delete', data);
}