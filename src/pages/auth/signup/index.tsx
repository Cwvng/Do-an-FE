import { Button, Col, Form, Input, message, Row, Select } from 'antd';
import Password from 'antd/es/input/Password';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { updateUser } from '../../../redux/slices/user.slice.ts';
import { signup } from '../../../requests/auth.request.ts';
import { useDispatch } from '../../../redux/store';

export const Signup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleFinish = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      // delete values.confirmPassword;
      const { user } = await signup(values);
      dispatch(updateUser(user));
      navigate('/');
      message.success('signup successfully');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-row bg-auth-bg bg-cover justify-center items-center">
      <div
        className="w-1/3 h-min bg-gray-200 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 border border-gray-100
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
                    message: 'Email không hợp lệ',
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
                    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                  },
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
                    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                  },
                  {
                    validator: (_, value) => {
                      if (value === form.getFieldValue('password')) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject('Mật khẩu không trùng khớp');
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
      </div>
    </div>
  );
};
