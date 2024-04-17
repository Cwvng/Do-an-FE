import React from 'react';
import { ChatsResponse } from '../../../requests/types/chat.interface.ts';
import { Avatar, theme } from 'antd';
import { useSelector } from 'react-redux';
import { isTodayMessage } from './utils.tsx';
import { AppState } from '../../../redux/store';

interface ChatNameCardProps {
    item: ChatsResponse;
    isSelected: boolean;
}
export const Index: React.FC<ChatNameCardProps> = ({ item, isSelected }) => {
    const user = useSelector((state: AppState) => state.user);
    const { token } = theme.useToken();
    return (
        <div
            className={`${isSelected ? 'bg-hoverBg' : ''} relative flex items-center rounded-md  border-primary hover:bg-hoverBg hover:cursor-pointer p-1 gap-5 h-15 max-w-full mb-2`}
        >
            <div className="basis-1/5 relative h-full flex items-center">
                <div className="relative w-full h-full flex items-center justify-center">
                    {item.isGroupChat ? (
                        <Avatar.Group
                            maxCount={2}
                            maxStyle={{ color: token.colorError, backgroundColor: token.colorErrorBg }}
                        >
                            {item.users.map((user, index) => {
                                return <Avatar key={index} src={user.profilePic} />;
                            })}
                        </Avatar.Group>
                    ) : (
                        <>
                            <img
                                src={item.users[1]?.profilePic}
                                alt=""
                                className="rounded-8 object-contain w-full h-full"
                            />
                            <span className="absolute text-green-500 top-0 right-0">
                                <svg width="15" height="15">
                                    <circle cx="6" cy="6" r="6" fill="currentColor"></circle>
                                </svg>
                            </span>
                        </>
                    )}
                </div>
            </div>
            <div className="basis-4/5 relative flex flex-col justify-start gap-1">
                <div className="flex justify-between items-center">
                    <span className="text-base text-secondary">
                        {item.isGroupChat ? item.chatName : item.users[1].firstname + item.users[1].lastname}
                    </span>
                    <span className="text-xs text-secondary">{isTodayMessage(item.updatedAt)}</span>
                </div>
                <div>
                    {item?.latestMessage && (
                        <span className="truncate max-w-50">
                            {item.latestMessage.sender._id == user.userInfo?._id
                                ? 'You'
                                : item.latestMessage.sender.firstname}
                            : {item.latestMessage.content}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
