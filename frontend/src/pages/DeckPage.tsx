import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'
import { Typography, Table, Spin, message, Space, Button } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { getDeckWithCards } from '../api/decks'
import { Card } from '../types/card'
import { DeckDetailsResponse } from '../types/deck'
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons'
import CardCreator from '../components/decks/CardCreator'

const { Title } = Typography

const DeckPage: React.FC = () => {
    const { deckId } = useParams<{ deckId: string }>();
    const [deckData, setDeckData] = useState<DeckDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCreatorOpen, setIsCreatorOpen] = useState(false);

    const columns: ColumnsType<Card> = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: '类型', dataIndex: 'card_type', key: 'card_type'},
        {
            title: '问题',
            dataIndex: 'question',
            key: 'question',
            render: (text) => text.length > 50 ? `${text.substring(0, 50)}...` : text,
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size = "middle">
                    <a>编辑</a>
                    <a>删除</a>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        if (!deckId) return ;

        const fetchDeckDetails = async () => {
            setLoading(true);
            try {
                const response = await getDeckWithCards(deckId);
                setDeckData(response.data);
            } catch (error) {
                message.error('加载卡片组详情失败！');
            } finally {
                setLoading(false);
            }
        };

        fetchDeckDetails();
    }, [deckId]);

    if (loading) {
        return <Spin size = "large" style = {{ display: 'block', marginTop: '50px' }} />
    }

    if (!deckData) {
        return <div style = {{ padding: '24px' }}>加载失败，或者未找到该卡片组</div>
    }

    return (
        <>
            <div style = {{ padding: '24px' }}>
                <Button
                    icon = {<ArrowLeftOutlined />}
                    style = {{ marginBottom: '16px' }}
                >
                    <Link to = "/">返回主页</Link>
                </Button>
                <Button
                    type = "primary"
                    icon = {<PlusOutlined />}
                    onClick = {() => setIsCreatorOpen(true)}
                >
                    创建新卡片
                </Button>
                <Title level = {2}>管理卡片组: {deckData.name}</Title>

                <Table 
                    columns = {columns}
                    dataSource = {deckData.cards}
                    rowKey = "id"
                    style = {{ marginTop: '24px' }}
                />
            </div>

            <CardCreator
                open = {isCreatorOpen}
                deckId = {Number(deckId)}
                onClose = {() => setIsCreatorOpen(false)}
                onSuccess = {(newCards) => {
                    setDeckData(currentData => {
                        if (!currentData) return null;
                        return {
                            ...currentData,
                            cards: [...currentData.cards, ...newCards]
                        }
                    })
                }}
            />
        </>
    )
}

export default DeckPage;