import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Login } from './auth/Login/Login.tsx';
import { Signup } from './auth/Signup/Signup.tsx';
import { Error404 } from '../components/errors/Error404.tsx';
import { Error403 } from '../components/errors/Error403.tsx';
import { AuthLayout } from '../layout/auth/AuthLayout.tsx';
import { AppLayout } from '../layout/app/AppLayout.tsx';
import { getAccessToken } from '../utils/storage.util.ts';
import { Home } from './home/home.tsx';
import { Messages } from './messages/Messages.tsx';
import { Tasks } from './tasks/Tasks.tsx';

interface ProtectedRouteProps {
    children: any;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }: ProtectedRouteProps) => {
    const access_token = getAccessToken();
    if (!access_token) return <Navigate to="/login" replace />;
    return children;
};

export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* error pages */}
            <Route path="/*" element={<Error404 />} />
            <Route path="/403" element={<Error403 />} />

            {/* auth routes */}
            <Route
                element={
                    <AuthLayout>
                        <Outlet />
                    </AuthLayout>
                }
            >
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Route>

            {/* authenticated routes */}
            <Route
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <Outlet />
                        </AppLayout>
                    </ProtectedRoute>
                }
            >
                <Route path="/" element={<Home />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/tasks" element={<Tasks />} />
            </Route>
        </Routes>
    );
};
