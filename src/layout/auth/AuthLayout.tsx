import React from 'react';
import { getAccessToken } from '../../utils/storage.util.ts';
import { Navigate } from 'react-router-dom';

interface IAuthLayout {
    children: any;
}
export const AuthLayout: React.FC<IAuthLayout> = ({ children }) => {
    const access_token = getAccessToken();
    if (access_token) return <Navigate to="/" replace />;
    return <section className="auth">{children}</section>;
};
