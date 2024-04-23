import { Header } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Dropdown, MenuProps } from 'antd';
import { userLogout } from '../../redux/slices/user.slice';
import { removeAccessToken } from '../../utils/storage.util';
import React from 'react';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { IoIosMenu, IoMdSettings } from 'react-icons/io';
import { IoNotifications } from 'react-icons/io5';
import { AppState, useDispatch, useSelector } from '../../redux/store';
import { CircleButton } from '../../components/common/button/CircleButton';

interface AppHeaderProps {
    toggleSidebar: () => void;
}
export const AppHeader: React.FC<AppHeaderProps> = ({ toggleSidebar }) => {
    const dispatch = useDispatch();
    const user = useSelector((state: AppState) => state.user);

    const navigate = useNavigate();

    const handleLogout = () => {
        removeAccessToken();
        dispatch(userLogout());
        navigate('/login');
    };
    const items: MenuProps['items'] = [
        {
            label: user?.userInfo?.firstname ?? 'Username',
            key: 'mail',
        },
        {
            label: <a onClick={handleLogout}>Logout</a>,
            key: 'logout',
            icon: <RiLogoutBoxRLine />,
        },
    ];
    return (
        <Header className="bg-white flex flex-row items-center justify-between border-b border-border gap-2 px-4 h-12">
            <div className="flex gap-10 flex-row items-center">
                <Button
                    className="border-none bg-transparent"
                    onClick={toggleSidebar}
                    icon={<IoIosMenu className="text-2xl text-gray-700" />}
                />
                <h2 className="text-secondary hover:cursor-pointer" onClick={() => navigate('/')}>
                    HUST Workspace
                </h2>
            </div>
            <div className="flex gap-3">
                <CircleButton icon={<IoNotifications className="text-2xl text-gray-700" />}></CircleButton>
                <CircleButton icon={<IoMdSettings className="text-2xl text-gray-700" />}></CircleButton>
                <Dropdown menu={{ items }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
                    <Button shape="circle" className="border-none bg-transparent	flex items-center px-0">
                        <Avatar src={user.userInfo?.profilePic}></Avatar>
                    </Button>
                </Dropdown>
            </div>
        </Header>
    );
};
