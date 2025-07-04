import axiosInstance from './axiosInstance'
import { User } from '../types/user'
import axios from 'axios';

interface GetUsersResponse {
    content: User[];
}

interface AddUserPayload {
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

export const bulkAddUsers = (users: AddUserPayload[]) => {
    return axiosInstance.post('/admin/users/batch-add', users);
}

export const bulkDeleteUsers = (data: BulkDeleteUserPayload) => {
    return axiosInstance.post('/admin/users/batch-delete', data);
}

export const addUser = (data: AddUserPayload) => {
    return axiosInstance.post('/admin/users/add', data);
}