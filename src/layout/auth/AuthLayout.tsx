import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState, useSelector } from '../../redux/store';

interface IAuthLayout {
  children: any;
}
export const AuthLayout: React.FC<IAuthLayout> = ({ children }) => {
  const navigate = useNavigate();
  const user = useSelector((app: AppState) => app.user);
  useEffect(() => {
    if (user.isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [user.isAuthenticated, navigate]);
  return (
    <section className="auth">
      <div className="h-screen flex flex-row bg-auth-bg bg-cover justify-center items-center">
        <div
          className="w-1/3 h-min bg-gray-200 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 border border-gray-100
 flex flex-col p-10 my-20 justify-center"
        >
          {children}
        </div>
      </div>
    </section>
  );
};
