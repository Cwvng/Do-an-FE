import React from 'react';
import { Button, Divider, Form, FormProps, message } from 'antd';
import Password from 'antd/es/input/Password';
import { useForm } from 'antd/es/form/Form';
import { resetPassword } from '../../requests/auth.request.ts';
import { useNavigate, useParams } from 'react-router-dom';

export const ResetPassword: React.FC = () => {
  const [form] = useForm();
  const { token, id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);

  const handleFinish: FormProps['onFinish'] = async (values) => {
    try {
      setLoading(true);
      if (id && token) {
        delete values.cfPassword;
        await resetPassword(id, token, values);
        message.success('Password reset successfully');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Reset password 🔑</h2>
      <Divider plain></Divider>
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        style={{ width: '100%' }}
      >
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
                  return Promise.reject('Confirm password is not match');
                }
              },
            },
          ]}
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
          Submit
        </Button>
      </Form>
    </>
  );
};
