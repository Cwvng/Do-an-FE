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
                        components: { Layout: { colorBgBase: '#fff' } },
                        token: {
                            colorPrimary: '#2596be',
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
