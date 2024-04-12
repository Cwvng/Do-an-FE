import React from 'react';
import ChatList from '../../components/chat/ChatList.tsx';
import { ChatContainer } from '../../components/chat/ChatContainer.tsx';

export const Messages: React.FC = () => {
    return (
        <div className="flex flex-row bg-white h-full">
            <div className="basis-1/4 border-r border-border">
                <ChatList />
            </div>
            <div className="basis-2/4 border-r border-border">
                <ChatContainer />
            </div>
            <div className="basis-1/4 ">Attachment</div>
        </div>
    );
};
