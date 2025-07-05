import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../services/authStore';
import { Avatar, Dropdown, MenuProps, Space } from 'antd';
import { UserOutlined, LogoutOutlined, HomeOutlined, CrownOutlined } from '@ant-design/icons';

const UserProfileDropdown: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const items: MenuProps['items'] = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: '回到主页',
            onClick: () => navigate('/'),
        },
        ...(user?.role === 'ADMIN' ? [{
            key: 'admin',
            icon: <CrownOutlined />,
            label: '管理员后台',
            onClick: () => navigate('/admin/users'),
        }] : []),
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: '退出登录',
            danger: true,
            onClick: handleLogout
        },
    ];

    return (
        <Dropdown menu = {{ items }}>
            <a onClick = {(e) => e.preventDefault()}>
                <Space>
                    <Avatar style = {{ backgroundColor: '#87d068' }} icon = {<UserOutlined />} />
                    {user?.username}
                </Space>
            </a>
        </Dropdown>
    )
}

export default UserProfileDropdown;