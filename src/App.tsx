import './assets/styles/index.scss';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import React from 'react';
import { store } from './redux/store';
import { AppRoutes } from './pages';
import { GoogleOAuthProvider } from '@react-oauth/google';

const App: React.FC = () => {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <Provider store={store}>
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
                    <BrowserRouter>
                        <AppRoutes />
                    </BrowserRouter>
                </ConfigProvider>
            </Provider>
        </GoogleOAuthProvider>
    );
};

export default App;
