import axiosInstance from './axiosInstance'
import { User } from '../types/user'
import axios from 'axios';

interface GetUsersResponse {
    content: User[];
}

export const getUsers = () => {
    return axiosInstance.get<GetUsersResponse>('/admin/users');
}

export const deleteUser = (userId: number) => {
    return axiosInstance.delete(`/admin/users/${userId}`);
}