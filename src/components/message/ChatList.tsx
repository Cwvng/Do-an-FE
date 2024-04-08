import React from 'react';
import { Divider, Input } from 'antd';
import { FaSearch } from 'react-icons/fa';
import { ChatNameCard } from './ChatNameCard.tsx';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

const ChatList: React.FC = () => {
    const [openPinnedList, setOpenPinnedList] = React.useState(false);
    const [openChatList, setOpenChatList] = React.useState(false);

    const togglePinnedList = () => setOpenPinnedList((prevState) => !prevState);
    const toggleChatList = () => setOpenChatList((prevState) => !prevState);

    return (
        <div className="flex flex-col h-full px-5" style={{ overflowY: 'scroll', overflowX: 'hidden' }}>
            <h1>Messages</h1>
            <Input
                size="large"
                placeholder="Enter name ..."
                suffix={<FaSearch className="text-primary" />}
                aria-label="Search for a chat"
            />
            <Divider />
            <section>
                <div
                    className="mb-3 flex items-center justify-between hover:cursor-pointer hover:bg-hoverBg p-1"
                    onClick={togglePinnedList}
                    aria-label="Toggle pinned list"
                >
                    Pinned 📌
                    {openPinnedList ? (
                        <IoIosArrowDown aria-label="Collapse pinned list" />
                    ) : (
                        <IoIosArrowUp aria-label="Expand pinned list" />
                    )}
                </div>
                {openPinnedList && Array.from({ length: 4 }, (_, index) => <ChatNameCard key={index} />)}
            </section>
            <section>
                <div
                    className="mb-3 flex items-center justify-between hover:cursor-pointer hover:bg-hoverBg p-1"
                    onClick={toggleChatList}
                    aria-label="Toggle chat list"
                >
                    All chat 💬
                    {openChatList ? (
                        <IoIosArrowDown aria-label="Collapse chat list" />
                    ) : (
                        <IoIosArrowUp aria-label="Expand chat list" />
                    )}
                </div>
                {openChatList && Array.from({ length: 10 }, (_, index) => <ChatNameCard key={index} />)}
            </section>
        </div>
    );
};

export default ChatList;
