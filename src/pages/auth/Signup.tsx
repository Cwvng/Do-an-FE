import { Button, Col, Form, Input, message, Row, Select } from 'antd';
import Password from 'antd/es/input/Password';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../requests/auth.request.ts';
import { setAccessToken } from '../../utils/storage.util.ts';

export const Signup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleFinish = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      // delete values.confirmPassword;
      const res = await signup(values);
      if (res.access_token && res.user.isVerified) setAccessToken(res.access_token);
      // dispatch(updateUser(user));
      message.success('Signup successfully. Please verify your email to login');
      navigate('/login');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Sign up a new account ✍️</h2>
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        style={{ width: '100%' }}
      >
        <Row gutter={20}>
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
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              name="email"
              label={<span className="font-medium">Email</span>}
              rules={[
                {
                  required: true,
                  pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: 'Email is not valid',
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="gender"
              rules={[{ required: true, message: 'Please select an option!' }]}
              label={<span className="font-medium">Gender</span>}
            >
              <Select size="large">
                <Select.Option value="male">Male</Select.Option>
                <Select.Option value="female">Female</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              name="password"
              label={<span className="font-medium">Password</span>}
              rules={[
                {
                  required: true,
                  message: 'Password is required',
                },
                {
                  pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                  message: 'Password must contain at least a capitalize character and a number',
                },
                { min: 8, message: 'Password must be at least 8 characters.' },
              ]}
            >
              <Password size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="confirmPassword"
              label={<span className="font-medium">Confirm password</span>}
              rules={[
                {
                  required: true,
                  message: 'Please retype password',
                },
                {
                  validator: (_, value) => {
                    if (value === form.getFieldValue('password')) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject('Password is not match');
                    }
                  },
                },
              ]}
            >
              <Password size="large" />
            </Form.Item>
          </Col>
        </Row>
        <Button
          className="w-full mt-2"
          size="large"
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          Signup
        </Button>
      </Form>
      <div className="flex flex-row mt-3 justify-between">
        <div className=" font-medium">
          Already have an account?{' '}
          <span>
            <Link className="text-primary font-medium" to={'/login'}>
              Login now
            </Link>
          </span>
        </div>
      </div>
    </>
  );
};
