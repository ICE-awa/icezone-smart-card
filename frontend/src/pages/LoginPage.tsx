import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Row, Col, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginUser } from '../api/auth';
import { useAuthStore } from '../services/authStore';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try{
            const response = await loginUser({ username: values.username, password: values.password });
            login(response.data.token, response.data.user);
            message.success(`欢迎回来，${response.data.user.username}!`);
            navigate('/');
        } catch (error: any) {
            console.error('登录失败：', error.response?.data);
            const errorMsg = error.response?.data?.message || '用户名或密码错误！';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row justify = "center" align = "middle" style = {{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <Col xs = {20} sm = {16} md = {14} lg = {12}  xl = {10} xxl = {8}>
                <Card style = {{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                    <div style = {{ textAlign: 'center', marginBottom: '24px' }}>
                        <Title level={2}>冰域学习卡片账号 - 登录</Title>
                    </div>
                    <Form
                        name = "login"
                        onFinish = {onFinish}
                        autoComplete = "false"
                    >
                        <Form.Item
                            name = "username"
                            rules = {[{ required: true, message: '请输入你的用户名！' }]}
                        >
                            <Input prefix = {<UserOutlined />} placeholder = "用户名" />
                        </Form.Item>

                        <Form.Item
                            name = "password"
                            rules = {[{ required: true, message: '请输入你的密码！' }]}
                        >
                            <Input.Password prefix = {<LockOutlined />} placeholder = "密码" />
                        </Form.Item>

                        <Form.Item>
                            <Button type = "primary" htmlType = "submit" style = {{ width: '100%' }} loading = {loading}>
                                登录
                            </Button>
                        </Form.Item>

                        <div style = {{ textAlign: 'center' }}>
                            <Text type = "secondary">还没有账号？</Text> <Link to = "/register">马上注册</Link>
                        </div>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}

export default LoginPage;