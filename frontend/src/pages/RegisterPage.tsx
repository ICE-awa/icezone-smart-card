import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Row, Col, message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { registerUser } from '../api/auth';

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        console.log("表单校验成功，收到的值：", values);
        setLoading(true);

        try{
            await registerUser({ username: values.username, password: values.password });
            message.success('注册成功！即将跳转到登录页...');

            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error: any) {
            console.error('注册失败:', error.response?.data);
            const errorMsg = error.response?.data?.message || '注册失败，请稍后重试！';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row justify = "center" align = "middle" style = {{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <Col xs = {20} sm = {16} md = {14} lg = {12}  xl = {10} xxl = {8}>
                <Card style = {{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1' }}>
                    <div style = {{ textAlign: 'center', marginBottom: '24px'}}>
                        <Title level = {2}>冰域学习卡片账号 - 注册</Title>
                    </div>
                    <Form
                        name = "register"
                        onFinish = {onFinish}
                        autoComplete = "off"
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

                        <Form.Item
                            name = "confirm"
                            dependencies = {[ 'password' ]}
                            hasFeedback
                            rules = {[
                                { required: true, message: "请确认你的密码！" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('两次输入的密码不一致！'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix = {<LockOutlined />} placeholder = "确认密码" />
                        </Form.Item>

                        <Form.Item>
                            <Button type = "primary" htmlType = "submit" style = {{ width: '100%' }} loading = {loading}>
                                注册
                            </Button>
                        </Form.Item>

                        <div style = {{ textAlign: 'center' }}>
                            <Text type = "secondary">已有账号？</Text> <Link to = "/login">前往登录</Link>
                        </div>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}

export default RegisterPage;