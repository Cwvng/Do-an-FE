import './assets/styles/index.scss';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import React from 'react';
import { store } from './redux/store';
import { AppRoutes } from './pages';

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <ConfigProvider
                theme={{
                    hashed: false,
                    components: { Layout: { colorBgBase: '#fff' } },
                }}
            >
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </ConfigProvider>
        </Provider>
    );
};

export default App;
