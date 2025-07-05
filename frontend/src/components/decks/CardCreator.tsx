import React, { useState } from 'react';
import { Modal, Tabs, Input, Button, Typography, Space, message } from 'antd';
import type { TabsProps } from 'antd';
import { bulkAddCards } from '../../api/decks';

const { TextArea } = Input;
const { Paragraph, Text } = Typography;

interface CardCreatorProps {
    open: boolean;
    deckId: number;
    onClose: () => void;
    onSuccess: (newCards: any[]) => void;
}

const CardCreator: React.FC<CardCreatorProps> = ({ open, deckId, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [jsonInput, setJsonInput] = useState('');
    const [activeTab, setActiveTab] = useState('json');

    const handleBulkAdd = async () => {
        let cards;
        try {
            cards = JSON.parse(jsonInput);
            if (!Array.isArray(cards)) throw new Error();
        } catch (e) {
            message.error('JSON 格式错误，必须是一个数组！');
            return ;
        }

        setLoading(true);
        try {
            const response = await bulkAddCards({ deck_id: deckId, cards });
            message.success(`成功导入 ${response.data.successCount} 张照片！`);
            onSuccess(response.data.newCards);
            onClose();
            setJsonInput('');
        } catch (error: any) {
            message.error(error.response?.data?.message || '批量导入失败！');
        } finally {
            setLoading(false);
        }
    }

    const items: TabsProps['items'] = [
        {
            key: 'ui',
            label: '可视化创建',
            children: 'TODO',
        },
        {
            key: 'json',
            label: 'JSON 批量导入',
            children: (
                <Space direction = "vertical" style = {{ width: '100%' }}>
                    <Paragraph>在此处粘贴卡片数组的 JSON。系统将为你批量创建卡片。</Paragraph>
                    <TextArea 
                        rows = {12}
                        value = {jsonInput}
                        onChange = {(e) => setJsonInput(e.target.value)}
                        placeholder = {`[
  {
    "card_type": "WORD",
    "question": "什么是HTTP？",
    "answer": "超文本传输协议"
  }
]`}
                    />
                </Space>
            ),
        },
    ];

    return (
        <Modal
            open = {open}
            title = "创建新卡片"
            onCancel = {onClose}
            width = {800}
            footer = {
                activeTab === 'json' ? [
                    <Button key = "back" onClick = {onClose}>取消</Button>,
                    <Button key = "submit" type = "primary" loading = {loading} onClick = {handleBulkAdd}>执行导入</Button>
                ] : [
                    <Button key = "back" onClick = {onClose}>取消</Button>,
                    <Button key = "submit" type = "primary" loading = {loading}>确认创建</Button>
                ]
            }
        >
            <Tabs defaultActiveKey = "json" items = {items} onChange = {setActiveTab} />
        </Modal>
    );
};

export default CardCreator;