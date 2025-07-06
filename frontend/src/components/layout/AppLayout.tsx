import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import UserProfileDropdown from './UserProfileDropdown';

const { Header, Content } = Layout;

const AppLayout: React.FC = () => {
    return (
        <Layout style = {{ minHeight: '100vh' }}>
            <Header style = {{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
                <div className = "logo" style = {{ color: '#1677ff', fontWeight: 'bold' }}>icezone-smartcard-demo</div>
                <UserProfileDropdown />
            </Header>
            <Content style = {{ background: '#f0f2f5' }}>
                <Outlet />
            </Content>
        </Layout>
    )
} 

export default AppLayout;