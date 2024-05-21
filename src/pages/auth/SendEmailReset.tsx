import React from 'react';
import { Button, Divider, Form, FormProps, Input, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useNavigate } from 'react-router-dom';
import { sendEmailReset } from '../../requests/auth.request.ts';

export const SendEmailReset: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);

  const handleFinish: FormProps['onFinish'] = async (values) => {
    try {
      setLoading(true);
      const res = await sendEmailReset(values);
      message.success(res.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <h2>Enter your email 📧</h2>
      <span>An email with reset password token will be sent to your email address</span>
      <Divider></Divider>
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
              message: 'Email is not valid',
            },
          ]}
        >
          <Input size="large" />
        </Form.Item>

        <div className="flex gap-5">
          <Button className="w-full" size="large" onClick={() => navigate('/login')}>
            Cancel
          </Button>
          <Button
            className="w-full"
            size="large"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Send
          </Button>
        </div>
      </Form>
    </>
  );
};
