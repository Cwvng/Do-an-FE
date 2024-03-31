import { Button, Divider, Form, Input, message } from 'antd';
import Password from 'antd/es/input/Password';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { updateUser } from '../../../redux/slices/user.slice.ts';
import { googleLogin, login } from '../../../requests/auth.request.ts';
import { State } from '../../../types/state.type.ts';
import { FcGoogle } from '@react-icons/all-files/fc/FcGoogle';
import { useGoogleLogin } from '@react-oauth/google';

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

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                console.log(tokenResponse);
                await googleLogin({ access_token: tokenResponse.access_token });
            } catch (err) {
                console.log('Login with google error:', err);
            }
        },
    });

    if (user) return <Navigate to="/" />;

    return (
        <div className="h-screen flex flex-row bg-auth-bg bg-cover justify-center">
            <div
                className="w-1/3 bg-gray-200 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 border border-gray-100
 flex flex-col p-10 my-20 justify-center"
            >
                <h2>Welcome to BKOffice 🎉</h2>
                <Button
                    className="ant-btn"
                    size="large"
                    onClick={() => loginWithGoogle()}
                    icon={<FcGoogle className="anticon" size={20} />}
                >
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

                    <Form.Item
                        name="password"
                        label={<span className="font-medium">Password</span>}
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                    >
                        <Password size="large" />
                    </Form.Item>

                    <Button style={{ width: '100%' }} size="large" type="primary" htmlType="submit" loading={loading}>
                        Login
                    </Button>
                </Form>
                <div className="flex flex-row mt-3 justify-between">
                    <div>
                        <span>
                            <Link to={'/forgot-password'}>Forgot password</Link>
                        </span>
                    </div>
                    <div>
                        {' '}
                        <span>
                            <Link to={'/signup'}>Signup</Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
