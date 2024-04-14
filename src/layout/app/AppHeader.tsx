import { Header } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Dropdown, MenuProps } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../types/state.type';
import { removeUser } from '../../redux/slices/user.slice';
import { removeAccessToken } from '../../utils/storage.util';
import React from 'react';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { IoIosMenu, IoMdSettings } from 'react-icons/io';
import { IoNotifications } from 'react-icons/io5';

interface AppHeaderProps {
    toggleSidebar: () => void;
}
export const AppHeader: React.FC<AppHeaderProps> = ({ toggleSidebar }) => {
    const dispatch = useDispatch();
    const user = useSelector((state: State) => state.user);

    const navigate = useNavigate();

    const handleLogout = () => {
        removeAccessToken();
        dispatch(removeUser());
        navigate('/login');
    };
    const items: MenuProps['items'] = [
        {
            label: user?.userInfo?.firstname || 'Username',
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
                <h2 className="text-secondary">HUST Workspace</h2>
            </div>
            <div className="flex gap-3">
                <Button
                    className="border-none bg-transparent"
                    icon={<IoNotifications className="text-2xl text-gray-700" />}
                ></Button>
                <Button
                    className="border-none bg-transparent	"
                    icon={<IoMdSettings className="text-2xl text-gray-700" />}
                ></Button>
                <Dropdown menu={{ items }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
                    <Button className="border-none bg-transparent	flex items-center px-0">
                        <Avatar src={user.userInfo?.profilePic}></Avatar>
                    </Button>
                </Dropdown>
            </div>
        </Header>
    );
};
