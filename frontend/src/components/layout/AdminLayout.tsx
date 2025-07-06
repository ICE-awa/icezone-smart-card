import React from 'react'
import { Layout, Menu, Typography } from 'antd'
import { UserOutlined, DatabaseOutlined } from '@ant-design/icons'
import { Link, Outlet, useLocation } from 'react-router-dom'
import UserProfileDropdown from './UserProfileDropdown'

const { Header, Content, Sider, Footer } = Layout;
const { Title } = Typography;

const AdminLayout: React.FC = () => {
    const location = useLocation();

    return (
        <Layout style = {{ minHeight: '100vh' }}>
            <Sider collapsible>
                <div style = {{ height: '64px', margin: '16px', color: 'white', textAlign: 'center', fontSize: '16px'}}>
                    冰域学习卡片 - 管理系统
                </div>
                <Menu theme = "dark" selectedKeys = {[location.pathname]} mode = "inline">
                    <Menu.Item key = "/admin/users" icon = {<UserOutlined />}>
                        <Link to = "/admin/users">用户管理</Link>
                    </Menu.Item>

                    <Menu.Item key = "/admin/decks" icon = {<DatabaseOutlined />}>
                        <Link to = "/admin/decks">卡片组管理</Link>
                    </Menu.Item>
                </Menu>
            </Sider>

            <Layout>
                <Header style = {{ padding: '0 16px', background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <UserProfileDropdown />
                </Header>
                <Content style = {{ margin: '24px 16px 0' }}>
                    <div style = {{ padding: 24, minHeight: 360, background: '#fff', borderRadius: '8px' }}>
                        <Outlet />
                    </div>
                </Content>
                <Footer style = {{ textAlign: 'center' }}>
                    冰域学习卡片 ©{new Date().getFullYear()} By ice. All rights reserved.
                </Footer>
            </Layout>
        </Layout>
    )
}

export default AdminLayout;