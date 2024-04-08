import React from 'react';
import ChatList from '../../components/message/ChatList.tsx';

export const Messages: React.FC = () => {
    return (
        <div className="flex flex-row bg-white ">
            <div className="basis-1/4 h-screen border-r border-border">
                <ChatList />
            </div>
            <div className="basis-2/4 h-screen border-r border-border">Chat box</div>
            <div className="basis-1/4 h-screen ">Attachment</div>
        </div>
    );
};
