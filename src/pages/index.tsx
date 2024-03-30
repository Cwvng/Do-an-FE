import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Login } from './auth/Login/Login.tsx';
import { Signup } from './auth/Signup.tsx';
import { Error404 } from '../components/errors/Error404.tsx';
import { Error403 } from '../components/errors/Error403.tsx';
import { AuthLayout } from '../layout/auth/AuthLayout.tsx';
import { AppLayout } from '../layout/app/AppLayout.tsx';
import { State } from '../types/state.type.ts';

interface ProtectedRouteProps {
    children: any;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }: ProtectedRouteProps) => {
    const user = useSelector((state: State) => state.user);

    if (user?.id) {
        // if (!user.status) return <Navigate to="/401" replace />;
        return children;
    }
    // return children;
    return <Navigate to="/login" replace />;
};

export const AppRoutes: React.FC = () => {
    // const [loading, setLoading] = useState(true);

    // const dispatch = useDispatch();
    //
    // useEffect(() => {
    //     getData();
    // }, []);
    //
    // const getData = async () => {
    //     try {
    //         const constants = await getConstants();
    //
    //         dispatch(updateConfig(constants));
    //
    //         const data = await refreshAccessToken();
    //         dispatch(updateUser(data.user));
    //
    //         const { records: projects } = await getProjects({ take: 99999999999999 });
    //         dispatch(updateProjects(projects));
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // if (loading) return <Loading />;

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
            ></Route>
        </Routes>
    );
};
