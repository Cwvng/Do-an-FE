import { Layout, Menu } from 'antd';
import { ItemType, SubMenuType } from 'antd/es/menu/hooks/useItems';
import React, { useEffect, useState } from 'react';
import { SelectInfo } from 'rc-menu/lib/interface';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoChatbubbles, IoFileTrayStacked } from 'react-icons/io5';
import { FaChartBar, FaCode, FaList } from 'react-icons/fa';
import { AppState, useSelector } from '../../redux/store';

interface SidebarProps {
  collapsed: boolean;
}
export const AppSidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const [selectedMenu, setSelectedMenu] = useState('/projects');
  const [openKey, setOpenKey] = useState(['']);

  const location = useLocation();
  const navigate = useNavigate();
  const project = useSelector((app: AppState) => app.user.selectedProject!);

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
  }, [location.pathname, project]);

  const handleMenuSelect = ({ key }: SelectInfo) => {
    navigate(key);
  };

  const menuItems: ItemType[] = project
    ? [
        {
          key: `/projects`,
          label: <span className="text-bold">Project list</span>,
          icon: <FaList />,
        },
        {
          key: `/projects/${project?._id}/active-sprint/`,
          label: <span className="text-bold">Active sprint</span>,
          icon: <FaCode />,
        },
        {
          key: `/projects/${project?._id}/backlog`,
          label: <span className="text-bold">Backlog</span>,
          icon: <IoFileTrayStacked />,
        },
        {
          key: `/projects/${project?._id}/report/`,
          label: <span className="text-bold">Report</span>,
          icon: <FaChartBar />,
        },

        {
          key: '/messages',
          label: <span className="text-bold">Messages</span>,
          icon: <IoChatbubbles />,
        },
      ]
    : [
        {
          key: `/projects`,
          label: <span className="text-bold">Project list</span>,
          icon: <FaList />,
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
      width={200}
      trigger={null}
    >
      <Menu
        className="h-full bg-lightBg"
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
