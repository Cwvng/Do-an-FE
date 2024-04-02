import { Header } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { Avatar, Button, Dropdown, MenuProps } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../types/state.type';
import { removeUser } from '../../redux/slices/user.slice';
import { removeAccessToken } from '../../utils/storage.util';
import React from 'react';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { IoMdSettings } from 'react-icons/io';
import { IoNotifications } from 'react-icons/io5';

export const AppHeader: React.FC = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: State) => state.user);

    const navigate = useNavigate();

    const handleLogout = () => {
        removeAccessToken();
        dispatch(removeUser({}));
        navigate('/login');
    };
    const items: MenuProps['items'] = [
        {
            label: user?.firstname || 'Username',
            key: 'mail',
        },
        {
            label: <a onClick={handleLogout}>Logout</a>,
            key: 'logout',
            icon: <RiLogoutBoxRLine />,
        },
    ];
    return (
        <Header className="bg-primary flex flex-row items-center justify-end gap-2">
            <Button
                className="border-none bg-transparent"
                icon={<IoNotifications className="text-2xl text-slate-600" />}
            ></Button>
            <Button
                className="border-none bg-transparent	"
                icon={<IoMdSettings className="text-2xl text-slate-600" />}
            ></Button>
            <Dropdown menu={{ items }} placement="bottomCenter" arrow={{ pointAtCenter: true }}>
                <Button className="border-none bg-transparent	flex items-center px-0">
                    {user?.profilePic ? (
                        <Avatar
                            src={<img className="object-cover rounded-full" src={user.profilePic} alt="avatar" />}
                            className="align-middle"
                        />
                    ) : (
                        <FaUserCircle className="text-2xl text-slate-600 align-middle" />
                    )}
                </Button>
            </Dropdown>
        </Header>
    );
};
