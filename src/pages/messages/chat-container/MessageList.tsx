import React, { useEffect, useRef } from 'react';
import { Message } from '../../../requests/types/chat.interface.ts';
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
import { Avatar, Divider, Dropdown, Image, Input, message, Spin, theme, Tooltip } from 'antd';
import { AppState } from '../../../redux/store';
import { getTime } from '../../../utils/message.util.ts';
import { deleteMessage, updateMessage } from '../../../requests/message.request.ts';

interface MessageListProps {
  messages: Message[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  canLoadMore: boolean;
  getChatMessageList: any;
  loading: boolean;
  scrollToBottom: boolean;
  setScrollToBottom: React.Dispatch<React.SetStateAction<boolean>>;
}
export const MessageList: React.FC<MessageListProps> = ({
  messages,
  setPage,
  canLoadMore,
  getChatMessageList,
  page,
  loading,
  scrollToBottom,
  setScrollToBottom,
}) => {
  const user = useSelector((state: AppState) => state.user).userInfo;
  const { token } = theme.useToken();
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedMsg, setSelectedMsg] = React.useState<Message | null>(null);

  const deleteSelectedMessage = async (id: string) => {
    try {
      if (messages) {
        await deleteMessage(id);
        await getChatMessageList(page);
        message.success('Deleted successfully');
      }
    } finally {
    }
  };

  const updateSelectedMessage = async () => {
    try {
      if (selectedMsg && !selectedMsg.isUpdated) {
        await updateMessage(selectedMsg._id, { content: selectedMsg.content });
        await getChatMessageList(page);
        setSelectedMsg(null);
        message.success('Updated successfully');
      }
    } finally {
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop } = containerRef.current;
      if (scrollTop === 0 && canLoadMore && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [canLoadMore, loading]);

  useEffect(() => {
    if (scrollToBottom && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      setScrollToBottom(false);
    }
  }, [scrollToBottom, messages]);

  if (messages.length === 0)
    return (
      <div className="flex justify-center text-secondary">
        No message yet. Start chat by sending a new message 💬.
      </div>
    );
  return (
    <div className="overflow-auto h-full pr-2" ref={containerRef}>
      {loading && (
        <div className="flex justify-center">
          <Spin />
        </div>
      )}
      {messages.map((m, i) => (
        <React.Fragment key={m._id}>
          {isFirstMessageOfDay(messages, m) && (
            <Divider>
              <span className="text-xs">{isTodayFirstMessage(m.updatedAt)}</span>
            </Divider>
          )}

          <div className="flex">
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
                  disabled={m.sender._id !== user?._id}
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
              {m.isUpdated && <span className="text-xs text-gray-400 mr-0 ml-auto">Modified</span>}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
