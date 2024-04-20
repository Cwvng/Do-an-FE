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
    return <section className="auth">{children}</section>;
};
