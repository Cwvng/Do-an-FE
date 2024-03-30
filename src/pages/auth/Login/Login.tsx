import { Button, Divider, Form, Input, message, Typography } from 'antd';
import Password from 'antd/es/input/Password';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { updateUser } from '../../../redux/slices/user.slice.ts';
import { login } from '../../../requests/auth.request.ts';
import { State } from '../../../types/state.type.ts';
import './Login.scss';
import { FcGoogle } from '@react-icons/all-files/fc/FcGoogle';

export const Login: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const user = useSelector((state: State) => state.user);
    const dispatch = useDispatch();

    const handleFinish = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            const data = await login(values);
            dispatch(updateUser(data.user));

            message.success('Đăng nhập thành công');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (user) return <Navigate to="/" />;

    return (
        <div className="login-container">
            <div className="login-background"></div>
            <div className="login-form">
                <Typography.Title level={2}>Welcome to BKOffice</Typography.Title>
                <Button className="ant-btn" size="large" icon={<FcGoogle className="anticon" size={20} />}>
                    Login with Google
                </Button>
                <Divider plain>Or login with</Divider>{' '}
                <Form
                    form={form}
                    layout="vertical"
                    requiredMark={false}
                    onFinish={handleFinish}
                    style={{ width: '100%' }}
                >
                    <Form.Item
                        name="email"
                        label="Email:"
                        rules={[
                            {
                                required: true,
                                pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                message: 'Email không hợp lệ',
                            },
                        ]}
                    >
                        <Input size="large" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu:"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                    >
                        <Password size="large" />
                    </Form.Item>

                    <Button style={{ width: '100%' }} size="large" type="primary" htmlType="submit" loading={loading}>
                        Đăng nhập
                    </Button>
                </Form>
                <div className="flex flex-row mt-3 justify-between">
                    <div>
                        <span>
                            <Link to={'/logup'}>Quên mật khẩu</Link>
                        </span>
                    </div>
                    <div>
                        {' '}
                        <span>
                            <Link to={'/logup'}>Đăng kí</Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
