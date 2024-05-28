import React from 'react';
import { Message } from '../../../requests/types/chat.interface.ts';
import ScrollableFeed from 'react-scrollable-feed';
import {
  isFirstMessageOfDay,
  isLastNotUserMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
  isTodayFirstMessage,
  isUserMessage,
} from '../utils.tsx';
import { useSelector } from 'react-redux';
import { Avatar, Divider, Dropdown, Image, Input, message, theme, Tooltip } from 'antd';
import { AppState } from '../../../redux/store';
import { getTime } from '../../../utils/message.util.tsx';
import { deleteMessage, updateMessage } from '../../../requests/message.request.ts';

interface MessageContainerProps {
  messages: Message[];
  updateMessageList: any;
}
export const MessageContainer: React.FC<MessageContainerProps> = ({
  messages,
  updateMessageList,
}) => {
  const user = useSelector((state: AppState) => state.user).userInfo;
  const { token } = theme.useToken();

  const [selectedMsg, setSelectedMsg] = React.useState<Message | null>();

  const deleteSelectedMessage = async (id: string) => {
    try {
      if (messages) {
        await deleteMessage(id);
        await updateMessageList();
        message.success('Deleted successfully');
      }
    } finally {
    }
  };
  const updateSelectedMessage = async () => {
    try {
      if (selectedMsg && !selectedMsg.isUpdated) {
        await updateMessage(selectedMsg._id, { content: selectedMsg.content });
        await updateMessageList();
        setSelectedMsg(null);
        message.success('Updated successfully');
      }
    } finally {
    }
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <>
            {isFirstMessageOfDay(messages, m) && (
              <Divider>
                <span className="text-xs">{isTodayFirstMessage(m.updatedAt)}</span>
              </Divider>
            )}

            <div className="flex" key={m._id}>
              {(isSameSender(messages, m, i, user?._id) ||
                isLastNotUserMessage(messages, i, user?._id)) && (
                <Tooltip title={m.sender.firstname} placement="bottom">
                  <Avatar src={m.sender.profilePic} />
                </Tooltip>
              )}
              <div
                style={{
                  marginLeft: isSameSenderMargin(messages, m, i, user?._id),
                  marginTop: isSameUser(messages, m, i) ? 3 : 10,

                  maxWidth: '50%',
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
                  <Dropdown
                    menu={{
                      items: [
                        {
                          label: (
                            <span
                              onClick={() => {
                                if (!m.isUpdated) setSelectedMsg(m);
                                else {
                                  message.warning('Message can be updated once');
                                }
                              }}
                            >
                              Edit
                            </span>
                          ),
                          key: 'editMsg',
                        },
                        {
                          label: (
                            <span
                              className="text-red-500"
                              onClick={() => deleteSelectedMessage(m._id)}
                            >
                              Delete
                            </span>
                          ),
                          key: 'deleteMsg',
                        },
                      ],
                    }}
                    trigger={['click']}
                    placement="bottomRight"
                    arrow={{ pointAtCenter: true }}
                  >
                    <div
                      className="px-3 py-2 rounded-lg break-words"
                      style={{
                        backgroundColor: `${m.sender._id === user?._id ? '#BEE3F8' : '#B9F5D0'}`,
                      }}
                    >
                      {selectedMsg?._id === m._id ? (
                        <Input
                          className="min-w-min"
                          defaultValue={m.content}
                          value={selectedMsg.content}
                          onBlur={() => setSelectedMsg(null)}
                          onChange={(e) =>
                            setSelectedMsg({ ...selectedMsg, content: e.target.value })
                          }
                          onPressEnter={updateSelectedMessage}
                        />
                      ) : (
                        <div>
                          <div>{m.content}</div>
                          {m.images &&
                            m.images.map((img, index) => (
                              <Image
                                className="object-contain	w-full"
                                key={index}
                                src={img}
                                alt="image message"
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  </Dropdown>
                </Tooltip>
                {m.isUpdated && (
                  <span className="text-xs text-gray-400 mr-0 ml-auto">Modified</span>
                )}
                {/*{checkMessageIsSent(messages, i, user?._id) && (*/}
                {/*  <span className="text-xs mr-0 ml-auto"> sent</span>*/}
                {/*)}*/}
              </div>
            </div>
          </>
        ))}
    </ScrollableFeed>
  );
};
