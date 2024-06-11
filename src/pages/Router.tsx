import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Login } from './auth/Login.tsx';
import { Signup } from './auth/Signup.tsx';
import { Error404 } from '../components/errors/Error404.tsx';
import { Error403 } from '../components/errors/Error403.tsx';
import { AuthLayout } from '../layout/auth/AuthLayout.tsx';
import { AppLayout } from '../layout/app/AppLayout.tsx';
import { ActiveSprint } from './projects/ActiveSprint.tsx';
import { getAccessToken } from '../utils/storage.util.ts';
import { Messages } from './messages';
import { ProjectList } from './projects/ProjectList.tsx';
import { VerifyEmail } from './auth/VerifyEmail.tsx';
import { SendEmailReset } from './auth/SendEmailReset.tsx';
import { ResetPassword } from './auth/ResetPassword.tsx';
import { IssueDetail } from '../components/kanban/IssueDetail';
import { Backlog } from './backlog/Backlog.tsx';
import { Report } from './report/Report.tsx';

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
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
        <Route path="/send-email" element={<SendEmailReset />} />
        <Route path="/verify-email/:id/:token" element={<VerifyEmail />} />
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
        <Route path="/" element={<Navigate to={`/projects`} replace />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/:id/sprint/:sprintId" element={<ActiveSprint />} />
        <Route path="/projects/:id/issue/:issueId" element={<IssueDetail />} />

        <Route path="/projects/:id/backlog" element={<Backlog />} />
        <Route path="/projects/:id/report/:sprintId" element={<Report />} />
      </Route>
    </Routes>
  );
};
