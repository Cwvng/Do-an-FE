import React from 'react';
import ChatList from './component/ChatList.tsx';
import { ChatContainer } from './component/ChatContainer.tsx';
import { ChatsResponse } from '../../requests/types/chat.interface.ts';
import { Attachment } from './component/Attachment.tsx';

export const Index: React.FC = () => {
    const [selectedChat, setSelectedChat] = React.useState<ChatsResponse>();
    const [openAttachment, setOpenAttachment] = React.useState(true);
    const toggleAttachment = () => {
        setOpenAttachment(!openAttachment);
    };
    return (
        <div className="flex flex-row bg-white h-full">
            <div className="basis-1/4 border-r border-border">
                <ChatList selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
            </div>
            <div className={openAttachment ? 'basis-2/4 border-r border-border' : 'basis-3/4 border-r border-border'}>
                <ChatContainer toggleAttachment={toggleAttachment} selectedChat={selectedChat} />
            </div>
            {openAttachment && (
                <div className="basis-1/4 ">
                    <Attachment />
                </div>
            )}
        </div>
    );
};
