import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../services/authStore'
import { Button, Card, Row, Col, Typography, Progress, Spin, Empty, message } from 'antd'
import { PlayCircleOutlined, SettingOutlined } from '@ant-design/icons'
import { getMyDecksWithStats } from '../api/decks'
import { DeckWithStats } from '../types/deck'

const { Title, Text } = Typography;

const HomePage: React.FC = () => {
    const { user } = useAuthStore();
    const [decks, setDecks] = useState<DeckWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const response = await getMyDecksWithStats();
                setDecks(response.data);
            } catch (error) {
                message.error('加载卡片组失败！')
            } finally {
                setLoading(false);
            }
       };
       fetchDecks();
    }, []);

    if (loading) {
        return <Spin size = "large" style = {{ display: 'block', marginTop: '50px' }} />;
    }

    return (
        <div style = {{ padding: '24px' }}>
            <Title level = {2}>欢迎回来，{user?.username || '用户'}！</Title>
            <Text type = "secondary">选择一个卡片组开始吧！</Text>

            {decks.length === 0 ? (
                <Empty description="你还没有任何卡片组，快去创建一个吧！" style = {{ marginTop: '40px'}} />
            ) : (
                <Row gutter = {[24, 24]} style = {{ marginTop: '24px' }}>
                    { decks.map((deck) => (
                        <Col xs = {20} sm = {16} md = {14} lg = {12}  xl = {10} xxl = {8}>
                            <Card
                                title = {deck.name}
                                hoverable
                                actions = {[
                                    <Button type = "text" icon = {<PlayCircleOutlined />} key = "study">开始学习</Button>,
                                    <Button 
                                        type = "text"
                                        icon = {<SettingOutlined />} 
                                        key = "manage"
                                        onClick = {() => navigate(`/decks/${deck.id}`)}
                                    >
                                        管理卡片
                                    </Button>
                                ]}
                            >
                                <p>总卡片数：{deck.totalCards}</p>
                                <p>我的进度：{deck.myLearnedCount} / {deck.totalCards}</p>
                                <Progress 
                                    percent = {deck.totalCards > 0 ? (deck.myLearnedCount / deck.totalCards) * 100 : 0}
                                    showInfo = {false}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    )
}

export default HomePage;