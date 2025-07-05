import axios from 'axios';
import { useAuthStore } from '../services/authStore';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.response && error.response.status === 401) {
            if (window.location.pathname !== '/login') {
                useAuthStore.getState().logout();
                console.error('认证失败或者 Token 已过期，请重新登录！');
                window.location.href = '/login';
            } 
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;