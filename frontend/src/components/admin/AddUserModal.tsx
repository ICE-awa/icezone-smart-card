import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Radio, message } from 'antd'
import { addUser } from '../../api/admin';

interface AddUserModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ open, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            form.resetFields();
        }
    }, [open, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            await addUser(values);
            message.success('新增用户成功！');
            onSuccess();
            onClose();
        } catch (error: any) {
            if (error.errorFields) {
                message.error('请检查表单输入！');
            } else {
                message.error(error.response?.data?.message || '新增用户失败！');
            } 
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            open = {open}
            title = "新增用户"
            okText = "确认新增"
            cancelText = "取消"
            onCancel = {onClose}
            onOk = {handleOk}
            confirmLoading = {loading}
        >
            <Form form = {form} layout = "vertical" name = "addUserForm">
                <Form.Item
                    name = "username"
                    label = "用户名"
                    rules = {[{ required: true, message: '请输入用户名！' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name = "password"
                    label = "密码"
                    rules = {[{ required: true, message: '请输入密码！' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name = "confirm"
                    label = "确认密码"
                    dependencies = {['password']}
                    hasFeedback
                    rules = {[
                        { required: true, message: '请再次输入密码！'},
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
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name = "role"
                    label = "权限"
                    initialValue = "USER"
                    rules = {[{ required: true, message: '请选择用户权限！' }]}
                >
                    <Radio.Group>
                        <Radio value = "USER">普通用户</Radio>
                        <Radio value = "ADMIN">管理员</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default AddUserModal;