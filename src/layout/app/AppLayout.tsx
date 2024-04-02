import { Layout } from 'antd';
import React from 'react';
import { AppHeader } from './AppHeader.tsx';
import { Sidebar } from './AppSideBar.tsx';

interface IAppLayout {
    children: any;
}
export const AppLayout: React.FC<IAppLayout> = ({ children }) => {
    return (
        <Layout className="dashboard min-h-full">
            <Sidebar />
            <Layout className="main">
                <AppHeader />
                <Layout.Content className="page">{children}</Layout.Content>
            </Layout>
        </Layout>
    );
};
