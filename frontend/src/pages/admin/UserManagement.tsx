import React, { useEffect, useState } from 'react';
import { Table, Typography, Button, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table';
import { getUsers } from '../../api/admin';
import { User } from '../../types/user';

const { Title } = Typography;

const UserManagementPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);

    const columns: ColumnsType<User> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '权限',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size = "middle">
                    <a>编辑</a>
                    <a>删除</a>
                </Space>
            )
        }
    ]

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await getUsers();
            setUsers(response.data.content || response.data);
        } catch (error) {
            message.error('加载用户列表失败！');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <Space direction = "vertical" style = {{ width: '100%' }}>
                <Title level = {2}>用户管理</Title>
                <div style = {{ marginBottom: 16}}>
                    <Button type = "primary" icon = {<PlusOutlined />}>
                        新增用户
                    </Button>
                    <Button style = {{ marginLeft: 8 }}>
                        批量管理用户
                    </Button>
                </div>

                <Table
                    columns = {columns}
                    dataSource = {users}
                    rowKey = "id"
                    loading = {loading}
                />
            </Space>
        </div>
    )
}

export default UserManagementPage