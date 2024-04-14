import React from 'react';
import ChatList from '../../components/chat/ChatList.tsx';
import { ChatContainer } from '../../components/chat/ChatContainer.tsx';
import { ChatsResponse } from '../../requests/types/chat.interface.ts';

export const Messages: React.FC = () => {
    const [selectedChat, setSelectedChat] = React.useState<ChatsResponse>();
    return (
        <div className="flex flex-row bg-white h-full">
            <div className="basis-1/4 border-r border-border">
                <ChatList setSelectedChat={setSelectedChat} />
            </div>
            <div className="basis-2/4 border-r border-border">
                <ChatContainer selectedChat={selectedChat} />
            </div>
            <div className="basis-1/4 ">Attachment</div>
        </div>
    );
};
