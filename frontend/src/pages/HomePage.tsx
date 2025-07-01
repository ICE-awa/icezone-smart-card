import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../services/authStore'
import { Button, Card, Row, Col, Typography } from 'antd'

const { Title, Text } = Typography;

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Row justify = "center" align = "middle" style = {{ minHeight: '100vh', padding: '20px' }}>
            <Col xs = {20} sm = {16} md = {14} lg = {12}  xl = {10} xxl = {8}>
                <Card>
                    <Title level = {2}>欢迎回来， {user?.username || '用户'}! </Title>
                    <Text>你已成功登录“冰域学习卡片”系统。</Text>
                    <br /><br />
                    <Button type = "primary" danger onClick = {handleLogout}>
                        退出登录
                    </Button>
                </Card>
            </Col>
        </Row>
    )
}

export default HomePage;