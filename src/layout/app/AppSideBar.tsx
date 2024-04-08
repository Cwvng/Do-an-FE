import { Layout, Menu } from 'antd';
import { ItemType, SubMenuType } from 'antd/es/menu/hooks/useItems';
import { GoHomeFill } from 'react-icons/go';
import React, { useEffect, useState } from 'react';
import { SelectInfo } from 'rc-menu/lib/interface';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineTaskAlt } from 'react-icons/md';
import { IoChatbubbles } from 'react-icons/io5';

interface SidebarProps {
    collapsed: boolean;
}
export const AppSidebar: React.FC<SidebarProps> = ({ collapsed }) => {
    const [selectedMenu, setSelectedMenu] = useState('');
    const [openKey, setOpenKey] = useState(['']);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        for (const item of menuItems) {
            if (location.pathname.includes(item?.key as string)) {
                setSelectedMenu(item?.key as string);
                setOpenKey([item?.key] as string[]);
            }

            const children = (item as SubMenuType)?.children;
            if (children) {
                for (const child of children) {
                    if (location.pathname.includes(child?.key as string)) {
                        setSelectedMenu(child?.key as string);
                        return;
                    }
                }
            }
        }
    }, [location.pathname]);

    const handleMenuSelect = ({ key }: SelectInfo) => {
        navigate(key);
    };

    const menuItems: ItemType[] = [
        {
            key: '/',
            label: <span className="text-bold">Dashboard</span>,
            icon: <GoHomeFill />,
        },
        {
            key: '/tasks',
            label: <span className="text-bold">Tasks</span>,
            icon: <MdOutlineTaskAlt />,
        },

        {
            key: '/messages',
            label: <span className="text-bold">Messages</span>,
            icon: <IoChatbubbles />,
        },
    ];

    return (
        <Layout.Sider
            className="!bg-white flex flex-col border-r border-border"
            collapsible
            collapsed={collapsed}
            collapsedWidth={60}
            width={180}
            trigger={null}
        >
            <Menu
                style={{ minHeight: '100vh' }}
                items={menuItems}
                mode="inline"
                onSelect={handleMenuSelect}
                selectedKeys={[selectedMenu]}
                openKeys={openKey}
                onOpenChange={setOpenKey}
            />
        </Layout.Sider>
    );
};
