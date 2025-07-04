import React, { useEffect, useState } from 'react';
import { Table, Typography, Button, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table';
import { getUsers, deleteUser } from '../../api/admin';
import { User } from '../../types/user';
import UserBulkManager from '../../components/admin/UserBulkManager';

const { Title } = Typography;

const UserManagementPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen]  = useState(false);

    const handleDelete = async (userId: number) => {
        try {
            await deleteUser(userId);
            message.success("用户删除成功！");
            setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
        } catch (error) {
            message.error("删除失败！请稍后重试！");
        }
    }

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
                    <Popconfirm
                        title = "确认删除用户"
                        description = {`你确认要删除用户 "${record.username} 吗？此操作不可撤销"`}
                        onConfirm = {() => handleDelete(record.id)}
                        okText = "确认"
                        cancelText = "取消"
                    >
                        <Button type = "link" danger>
                            删除
                        </Button>
                    </Popconfirm>
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
        <>
            <Space direction = "vertical" style = {{ width: '100%' }}>
                <Title level = {2}>用户管理</Title>
                <div style = {{ marginBottom: 16}}>
                    <Button type = "primary" icon = {<PlusOutlined />}>
                        新增用户
                    </Button>
                    <Button 
                        style = {{ marginLeft: 8 }}
                        icon = {<UploadOutlined />}
                        onClick = {() => setIsModalOpen(true)}
                    >
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

            <UserBulkManager
                open = {isModalOpen}
                onClose = {() => setIsModalOpen(false)}
                onSuccess = {() => {
                    fetchUsers();
                }}
            />
        </>
    )
}

export default UserManagementPage