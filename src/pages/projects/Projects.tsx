import React from 'react';
import { Avatar, Breadcrumb, Button, Input, theme } from 'antd';
import { useParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { MdPersonAdd } from 'react-icons/md';
import { KanbanBoard } from '../../components/kanban/KanbanBoard.tsx';

export const Projects: React.FC = () => {
    const { id } = useParams();
    const { token } = theme.useToken();

    return (
        <div className="bg-white h-full p-5">
            <Breadcrumb>
                <Breadcrumb.Item>Projects</Breadcrumb.Item>
                <Breadcrumb.Item>Project {id}</Breadcrumb.Item>
            </Breadcrumb>
            <h2 className="mt-5 text-secondary">Assigned issues (10)</h2>
            <div className="flex flex-row items-center max-w-100 gap-5 mt-5">
                <Input size="large" suffix={<FaSearch className="text-primary" />} aria-label="Search for a chat" />
                <Avatar.Group maxCount={2} maxStyle={{ color: token.colorError, backgroundColor: token.colorErrorBg }}>
                    <Avatar src="https://i.pinimg.com/736x/b0/cd/e6/b0cde658985bd1a87b525592bf71da18.jpg" />
                    <Avatar src="https://i.pinimg.com/736x/b0/cd/e6/b0cde658985bd1a87b525592bf71da18.jpg" />
                    <Avatar src="https://i.pinimg.com/736x/b0/cd/e6/b0cde658985bd1a87b525592bf71da18.jpg" />
                    <Avatar src="https://i.pinimg.com/736x/b0/cd/e6/b0cde658985bd1a87b525592bf71da18.jpg" />
                </Avatar.Group>
                <Button type="primary" shape="circle" icon={<MdPersonAdd size="19" />} />
            </div>
            <div>
                <KanbanBoard />
            </div>
        </div>
    );
};
