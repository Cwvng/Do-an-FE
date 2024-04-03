import { Layout } from 'antd';
import React from 'react';
import { AppHeader } from './AppHeader.tsx';
import { Sidebar } from './AppSideBar.tsx';

interface IAppLayout {
    children: any;
}
export const AppLayout: React.FC<IAppLayout> = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(true);

    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
    return (
        <Layout className="dashboard min-h-full">
            <Sidebar collapsed={isSidebarCollapsed} />
            <Layout className="main">
                <AppHeader toggleSidebar={toggleSidebar} />
                <Layout.Content className="page">{children}</Layout.Content>
            </Layout>
        </Layout>
    );
};
