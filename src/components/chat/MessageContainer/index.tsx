import React from 'react';
import { FullChatResponse } from '../../../requests/types/chat.interface.ts';
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from './utils.tsx';
import { useSelector } from 'react-redux';
import { Avatar, Tooltip } from 'antd';
import { AppState } from '../../../redux/store';

interface MessageContainerProps {
    messages: FullChatResponse[];
}
export const Index: React.FC<MessageContainerProps> = ({ messages }) => {
    const user = useSelector((state: AppState) => state.user).userInfo;
    return (
        <ScrollableFeed>
            {messages &&
                messages.map((m, i) => (
                    <div style={{ display: 'flex' }} key={m._id}>
                        {(isSameSender(messages, m, i, user?._id) || isLastMessage(messages, i, user?._id)) && (
                            <Tooltip title={m.sender.firstname} placement="bottom">
                                <Avatar src={m.sender.profilePic} />
                            </Tooltip>
                        )}
                        <span
                            style={{
                                backgroundColor: `${m.sender._id === user?._id ? '#BEE3F8' : '#B9F5D0'}`,
                                marginLeft: isSameSenderMargin(messages, m, i, user?._id),
                                marginTop: isSameUser(messages, m, i) ? 3 : 10,
                                borderRadius: '20px',
                                padding: '5px 15px',
                                maxWidth: '75%',
                            }}
                        >
                            {m.content}
                        </span>
                    </div>
                ))}
        </ScrollableFeed>
    );
};
