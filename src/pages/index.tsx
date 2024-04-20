import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Login } from './auth/login/Login.tsx';
import { Signup } from './auth/signup/Signup.tsx';
import { Error404 } from '../components/errors/Error404.tsx';
import { Error403 } from '../components/errors/Error403.tsx';
import { AuthLayout } from '../layout/auth/AuthLayout.tsx';
import { AppLayout } from '../layout/app/AppLayout.tsx';
import { Home } from './home/home.tsx';
import { Index } from './messages';
import { Tasks } from './tasks/Tasks.tsx';
import { AppState, useSelector } from '../redux/store';

interface ProtectedRouteProps {
    children: any;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }: ProtectedRouteProps) => {
    const user = useSelector((app: AppState) => app.user);
    if (!user.isAuthenticated) {
        return <Navigate to={{ pathname: '/login' }} />;
    }
    return <>{children}</>;
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
                <Route path="/messages" element={<Index />} />
                <Route path="/tasks" element={<Tasks />} />
            </Route>
        </Routes>
    );
};
