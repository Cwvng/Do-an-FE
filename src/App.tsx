import './assets/styles/index.scss';
import { ConfigProvider } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { AppRoutes } from './pages';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { getAccessToken } from './utils/storage.util.ts';
import { getUserInfo } from './redux/slices/user.slice.ts';
import { AppState, useDispatch, useSelector } from './redux/store';
import { SocketContextProvider } from "./context/SocketContext.tsx";

const App: React.FC = () => {
    const userProfile = useSelector((state: AppState) => state.user);
    const location = useLocation();
    const { pathname } = location;
    const navigate = useNavigate();

    const dispatch = useDispatch();

    useEffect(() => {
        const access_token = getAccessToken();
        if (access_token) {
            if (!userProfile.isAuthenticated) {
                dispatch(getUserInfo());
            }
        } else if (pathname === '/') {
            navigate('/login');
        }
    }, [pathname, userProfile.isAuthenticated]);
    return (
        <SocketContextProvider>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <ConfigProvider
                    theme={{
                        hashed: false,
                        components: {
                            Layout: { colorBgBase: '#fff' },
                            Menu: {
                                iconSize: 20,
                                collapsedIconSize: 20,
                                itemColor: '#3E5B76',
                                itemSelectedBg: '#628DB6',
                                itemSelectedColor: '#FFF',
                                itemHoverColor: '#628DB6',
                            },
                            Select: {
                                multipleItemBg: 'rgba(98,141,182,0.25)',
                            },
                            Avatar: { groupSpace: 2, groupOverlapping: -20 },
                        },
                        token: {
                            colorPrimary: '#628DB6',
                            colorError: '#f56a00',
                            colorErrorBg: '#fde3cf',
                        },
                    }}
                >
                    <AppRoutes />
                </ConfigProvider>
            </GoogleOAuthProvider>
        </SocketContextProvider>
    );
};

export default App;
