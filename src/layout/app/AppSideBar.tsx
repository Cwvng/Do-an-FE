import { Button, Layout, Menu } from 'antd';
import { ItemType, SubMenuType } from 'antd/es/menu/hooks/useItems';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GoHomeFill } from 'react-icons/go';
import React, { useEffect, useState } from 'react';
import { SelectInfo } from 'rc-menu/lib/interface';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineTaskAlt } from 'react-icons/md';
import { IoChatbubbles } from 'react-icons/io5';

export const Sidebar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
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
            label: 'Home',
            icon: <GoHomeFill className="text-2xl" />,
        },
        {
            key: '/tasks',
            label: 'Task',
            icon: <MdOutlineTaskAlt className="text-2xl" />,
        },
        {
            key: '/messages',
            label: <span className="text-bold">Messages</span>,
            icon: <IoChatbubbles className="text-2xl" />,
        },
    ];

    return (
        <Layout.Sider
            className="!bg-white flex flex-col sidebar"
            collapsible
            collapsed={collapsed}
            collapsedWidth={60}
            width={150}
            trigger={null}
        >
            <div className="p-8"></div>
            <Menu
                items={menuItems}
                mode="inline"
                onSelect={handleMenuSelect}
                selectedKeys={[selectedMenu]}
                openKeys={openKey}
                onOpenChange={setOpenKey}
            />
            <Button onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? (
                    <FaChevronRight />
                ) : (
                    <span className="inline-flex gap-1 items-center">
                        <span className="inline-flex items-center">
                            <FaChevronLeft />
                        </span>
                    </span>
                )}
            </Button>
        </Layout.Sider>
    );
};
