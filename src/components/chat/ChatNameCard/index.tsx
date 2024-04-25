import React from 'react';
import { ChatsResponse } from '../../../requests/types/chat.interface.ts';
import { Avatar, theme } from 'antd';
import { useSelector } from 'react-redux';
import { AppState } from '../../../redux/store';
import { getReceiverUser } from '../../../utils/message.util.tsx';
import { useSocketContext } from '../../../context/SocketContext.tsx';
import { isTodayMessage } from './utils.tsx';

interface ChatNameCardProps {
  item: ChatsResponse;
  isSelected: boolean;
}

export const ChatNameCard: React.FC<ChatNameCardProps> = ({ item, isSelected }) => {
  const user = useSelector((state: AppState) => state.user);
  const { token } = theme.useToken();
  const { onlineUsers } = useSocketContext();

  return (
    <div
      className={`${isSelected ? 'bg-hoverBg' : ''} relative flex items-center rounded-md justify-between border-primary hover:bg-hoverBg hover:cursor-pointer p-1 gap-5 h-15 max-w-full mb-2`}
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
                src={getReceiverUser(item.users, user.userInfo?._id)?.profilePic}
                alt=""
                className="rounded-8 object-contain w-full h-full"
              />
              {onlineUsers.includes(getReceiverUser(item.users, user.userInfo?._id)?._id) && (
                <span className="absolute text-green-500 top-0 right-0">
                  <svg width="15" height="15">
                    <circle cx="6" cy="6" r="6" fill="currentColor"></circle>
                  </svg>
                </span>
              )}
            </>
          )}
        </div>
      </div>
      <div className="w-3/4 max-w-[250px] relative flex flex-col justify-start gap-1">
        <div className="flex justify-between items-center">
          <span className="text-base text-secondary">
            {item.isGroupChat
              ? item.chatName
              : //@ts-ignore
                getReceiverUser(item.users, user.userInfo?._id).firstname +
                //@ts-ignore
                getReceiverUser(item.users, user.userInfo?._id).lastname}
          </span>
          <span className="text-xs text-secondary">{isTodayMessage(item.updatedAt)}</span>
        </div>
        {item?.latestMessage && (
          <span className="truncate w-full">
            {item.latestMessage.sender._id == user.userInfo?._id
              ? 'You'
              : item.latestMessage.sender.firstname}
            : {item.latestMessage.content}
          </span>
        )}
      </div>
    </div>
  );
};
