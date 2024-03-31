import { Button, Col, Form, Input, message, Row } from 'antd';
import Password from 'antd/es/input/Password';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { updateUser } from '../../../redux/slices/user.slice.ts';
import { login } from '../../../requests/auth.request.ts';
import { State } from '../../../types/state.type.ts';

export const Signup: React.FC = () => {
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
        <div className="h-screen flex flex-row bg-auth-bg bg-cover justify-center">
            <div
                className="w-1/3 bg-gray-200 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 border border-gray-100
 flex flex-col p-10 my-20 justify-center"
            >
                <h2>Sign up a new account ✍️</h2>
                <Form
                    form={form}
                    layout="vertical"
                    requiredMark={false}
                    onFinish={handleFinish}
                    style={{ width: '100%' }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="firstname"
                                label={<span className="font-medium">First name</span>}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="lastname"
                                label={<span className="font-medium">Last name</span>}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input size="large" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="email"
                        label={<span className="font-medium">Email</span>}
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

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="password"
                                label={<span className="font-medium">Password</span>}
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                            >
                                <Password size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="cfPassword"
                                label={<span className="font-medium">Confirm password</span>}
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                            >
                                <Password size="large" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Button style={{ width: '100%' }} size="large" type="primary" htmlType="submit" loading={loading}>
                        Signup
                    </Button>
                </Form>
                <div className="flex flex-row mt-3 justify-between">
                    <div>
                        Already have an account?{' '}
                        <span>
                            <Link to={'/login'}>Login now</Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
