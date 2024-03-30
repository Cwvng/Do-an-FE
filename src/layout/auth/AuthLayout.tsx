import React from 'react';

interface IAuthLayout {
    children: any;
}
export const AuthLayout: React.FC<IAuthLayout> = ({ children }) => {
    return <section className="auth">{children}</section>;
};
