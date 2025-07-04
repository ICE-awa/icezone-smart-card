import React, { useState } from 'react';
import { Modal, Tabs, Input, Button, Typography, Space, message } from 'antd';
import type { TabsProps } from 'antd';
import { bulkAddUsers, bulkDeleteUsers  } from '../../api/admin';
import { BulkDeleteUserPayload } from '../../api/admin';

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

interface UserBulkManagerProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const UserBulkManager: React.FC<UserBulkManagerProps> = ({ open, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [addJsonInput, setAddJsonInput] = useState('');
    const [deleteJsonInput, setDeleteJsonInput] = useState('');
    const [activeTab, setActiveTab] = useState('1');

    const handleBulkAdd = async() => {
        let users;
        try {
            users = JSON.parse(addJsonInput);
        } catch {
            message.error('提交失败，JSON 格式有误！');
            return ;
        }
        
        setLoading(true);
        try {
            await bulkAddUsers(users);
            message.success('批量新增用户成功！');
            onSuccess();
            onClose();
            setAddJsonInput('');
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || '批量新增失败，请检查数据或者联系管理员';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }

    const handleBulkDelete = async () => {
        let data : BulkDeleteUserPayload;
        try {
            data = JSON.parse(deleteJsonInput);
            if (!data.usernames || !Array.isArray(data.usernames)) {
                throw new Error();
            }
        } catch (error) {
            message.error('提交失败，JSON 格式有误或者缺少 usernames 字段！');
            return;
        }

        const userCount = data.usernames.length;
        if (userCount === 0) {
            message.warning('用户名列表不能为空！');
            return;
        }

        setLoading(true);
        try {
            await bulkDeleteUsers(data);
            message.success('批量删除用户成功！');
            onSuccess();
            onClose();
            setAddJsonInput('');
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || '批量删除失败，请检查数据或者联系管理员';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '批量新增',
            children: (
                <Space direction = "vertical" style = {{ width: '100%' }}>
                    <Paragraph>
                        请在下方文本框中粘贴符合格式的 JSON 数据。系统会根据 JSON 数据批量创建用户。
                    </Paragraph>
                    <TextArea
                        rows = {10}
                        value = {addJsonInput}
                        onChange = {(e) => setAddJsonInput(e.target.value)}
                        placeholder='[&#10;  {&#10;    "username": "user1",&#10;    "password": "password123",&#10;    "role": "USER"&#10;  },&#10;  {&#10;    "username": "user2",&#10;    "password": "password456"&#10;  }&#10;]'
                    />
                    <Paragraph>
                        <Text strong>格式要求：</Text>
                        <pre style = {{ background: '#f5f5f5', padding: '10px', borderRadius: '4px'}}>
                            {`[
    {
        "username": "必填，字符串",
        "password": "必填，字符串",
        "role": “可选, 'USER' 或 'ADMIN', 默认为 'USER'"
    }
]`}
                        </pre>
                    </Paragraph>
                </Space>
            ),
        },
        {
            key: '2',
            label: '批量删除',
            children: (
                <Space direction = "vertical" style = {{ width: '100%' }}>
                    <Paragraph>
                        请粘贴要删除的用户 JSON 数据。系统将根据 `usernames` 列表进行删除。
                    </Paragraph>
                    <TextArea 
                        rows = {10}
                        value = {deleteJsonInput}
                        onChange = {(e) => setDeleteJsonInput(e.target.value)}
                        placeholder = '{&#10;   "usernames": ["user1", "user2"]&#10;'
                    />
                    <Paragraph>
                    <Text strong>格式要求：</Text>
                         <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
              {`{
  "usernames": [ "要删除的用户名1", "要删除的用户名2" ]
}`}
                        </pre>
                    </Paragraph>
                </Space>
            ),
        },
    ];

    const renderFooter = () => {
        if (activeTab === '1') {
            return [
                <Button key = "back" onClick = {onClose}>取消</Button>,
                <Button key = "submit" type = "primary" loading = {loading} onClick = {handleBulkAdd}>执行新增</Button>
            ];
        }
        if (activeTab === '2') {
            return [
                <Button key = "back" onClick = {onClose}>取消</Button>,
                <Button key = "submit" type = "primary" danger loading = {loading} onClick = {handleBulkDelete}>执行删除</Button>
            ]
        }
        return [];
    };

    return (
        <Modal
            open = {open}
            title = "批量用户管理"
            onCancel = {onClose}
            width = {800}
            footer = {renderFooter()}
        >
            <Tabs defaultActiveKey = "1" activeKey = {activeTab} onChange = {setActiveTab} items = {items} />
        </Modal>
    )
}

export default UserBulkManager;