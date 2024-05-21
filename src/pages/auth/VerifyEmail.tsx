import React, { useEffect } from 'react';
import { Button, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { verifyEmail } from '../../requests/auth.request.ts';
import { Loading } from '../../components/loading/Loading.tsx';

export const VerifyEmail: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [response, setResponse] = React.useState<any>();

  const navigate = useNavigate();
  const { id, token } = useParams();
  const verifyEmailRegistered = async () => {
    try {
      setLoading(true);
      if (id && token) {
        const res = await verifyEmail(id, token);
        setResponse(res);
        message.success('Verified successfully');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyEmailRegistered();
  }, []);
  if (loading) return <Loading />;
  return (
    <div className="flex flex-col items-center gap-5">
      <svg
        fill="#628DB6"
        xmlns="http://www.w3.org/2000/svg"
        width="64px"
        height="64px"
        viewBox="0 0 52 52"
        enableBackground="new 0 0 52 52"
        xmlSpace="preserve"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path d="M26,2C12.7,2,2,12.7,2,26s10.7,24,24,24s24-10.7,24-24S39.3,2,26,2z M39.4,20L24.1,35.5 c-0.6,0.6-1.6,0.6-2.2,0L13.5,27c-0.6-0.6-0.6-1.6,0-2.2l2.2-2.2c0.6-0.6,1.6-0.6,2.2,0l4.4,4.5c0.4,0.4,1.1,0.4,1.5,0L35,15.5 c0.6-0.6,1.6-0.6,2.2,0l2.2,2.2C40.1,18.3,40.1,19.3,39.4,20z"></path>{' '}
        </g>
      </svg>
      <div>{response?.message} </div>
      <div>
        <Button type="primary" onClick={() => navigate('/login')}>
          Go to Login
        </Button>
      </div>
    </div>
  );
};
