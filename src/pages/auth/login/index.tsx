import { Button, Divider, Form, Input, message } from 'antd';
import Password from 'antd/es/input/Password';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserInfo, updateUser } from '../../../redux/slices/user.slice.ts';
import { googleLogin, login } from '../../../requests/auth.request.ts';
import { FcGoogle } from '@react-icons/all-files/fc/FcGoogle';
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from '../../../redux/store';

export const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFinish = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const data = await login(values);
      dispatch(updateUser(data.user));
      dispatch(getUserInfo());

      message.success('Welcome to HUST workspace');
      navigate('/');
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
        console.log('login with google error:', err);
      }
    },
  });

  return (
    <div className="h-screen flex flex-row bg-auth-bg bg-cover justify-center items-center">
      <div
        className="w-1/3 h-min bg-gray-200 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 border border-gray-100
 flex flex-col p-10 my-20 justify-center"
      >
        <h2>Welcome to MyDoAn 🎉</h2>
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

          <Button
            style={{ width: '100%' }}
            size="large"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Login
          </Button>
        </Form>
        <div className="flex flex-row mt-3 justify-between">
          <div>
            <span>
              <Link className="text-primary font-medium" to={'/forgot-password'}>
                Forgot password
              </Link>
            </span>
          </div>
          <div>
            {' '}
            <span>
              <Link className="text-primary font-medium" to={'/signup'}>
                Signup
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
