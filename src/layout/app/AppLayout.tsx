import { Layout } from 'antd';
import React from 'react';
import { AppHeader } from './AppHeader.tsx';
import { AppSidebar } from './AppSideBar.tsx';

interface IAppLayout {
    children: any;
}
export const AppLayout: React.FC<IAppLayout> = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
    return (
        <Layout>
            <AppHeader toggleSidebar={toggleSidebar} />
            <Layout>
                <AppSidebar collapsed={isSidebarCollapsed} />
                <Layout.Content className="bg-gray-100 font-semibold">{children}</Layout.Content>
            </Layout>
        </Layout>
    );
};
