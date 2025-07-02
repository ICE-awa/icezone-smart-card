import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../services/authStore'
import { message } from 'antd'

const AdminRoute: React.FC = () => {
    const { user, token } = useAuthStore()
    if (!token) {
        return <Navigate to = "/login" replace />;
    }

    if (user?.role !== 'ADMIN') {
        message.error('无权访问！您不是管理员。');
        return <Navigate to = "/" replace />;
    }

    return <Outlet />
}

export default AdminRoute;