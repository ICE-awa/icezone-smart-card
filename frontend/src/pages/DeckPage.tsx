import React from 'react';
import { useParams } from 'react-router-dom'
import { Typography } from 'antd'

const { Title } = Typography

const DeckPage: React.FC = () => {
    const { deckId } = useParams<{ deckId: string }>();

    return (
        <div style = {{ padding: '24px' }}>
            <Title level = {2}>管理卡片组 - ID: {deckId}</Title>
        </div>
    )
}

export default DeckPage;