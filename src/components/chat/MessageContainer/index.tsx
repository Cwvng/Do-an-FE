import React from 'react';
import { FullChatResponse } from '../../../requests/types/chat.interface.ts';
import ScrollableFeed from 'react-scrollable-feed';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
  isUserMessage,
} from './utils.tsx';
import { useSelector } from 'react-redux';
import { Avatar, theme, Tooltip } from 'antd';
import { AppState } from '../../../redux/store';
import { getTime } from '../../../utils/message.util.tsx';

interface MessageContainerProps {
  messages: FullChatResponse[];
}
export const MessageContainer: React.FC<MessageContainerProps> = ({ messages }) => {
  const user = useSelector((state: AppState) => state.user).userInfo;
  const { token } = theme.useToken();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div className="flex" key={m._id}>
            {(isSameSender(messages, m, i, user?._id) || isLastMessage(messages, i, user?._id)) && (
              <Tooltip title={m.sender.firstname} placement="bottom">
                <Avatar src={m.sender.profilePic} />
              </Tooltip>
            )}
            <div
              style={{
                marginLeft: isSameSenderMargin(messages, m, i, user?._id),
                marginTop: isSameUser(messages, m, i) ? 3 : 10,

                maxWidth: '75%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/*{i === 0 && !isUserMessage(m, user?._id) && (*/}
              {/*    <div className="px-2 py-1 text-xs">*/}
              {/*        {m.sender.firstname}, {getTime(m.createdAt)}*/}
              {/*    </div>*/}
              {/*)}*/}
              <Tooltip
                placement={isUserMessage(m, user?._id) ? 'left' : 'right'}
                color={token.colorPrimary}
                title={<span className="text-xs">{getTime(m.updatedAt)}</span>}
              >
                <div
                  className="px-3 py-2 rounded-lg break-words"
                  style={{
                    backgroundColor: `${m.sender._id === user?._id ? '#BEE3F8' : '#B9F5D0'}`,
                  }}
                >
                  {m.content}
                </div>
              </Tooltip>
            </div>
          </div>
        ))}
    </ScrollableFeed>
  );
};
