import React, { useEffect } from 'react';
import ChatList from './chat-list/ChatList.tsx';
import { ChatContainer } from './chat-container/ChatContainer.tsx';
import { Attachment } from './attachment/Attachment.tsx';
import { AppState, useDispatch, useSelector } from '../../redux/store';
import { getChatList } from '../../redux/slices/user.slice.ts';

export const Messages: React.FC = () => {
  const chatList = useSelector((app: AppState) => app.user.chatList);
  const dispatch = useDispatch();

  const [openAttachment, setOpenAttachment] = React.useState(false);

  const toggleAttachment = () => {
    setOpenAttachment(!openAttachment);
  };

  useEffect(() => {
    dispatch(getChatList());
  }, []);

  return (
    <div className="flex flex-row bg-white h-full">
      <div className="w-1/4 border-r border-border">
        <ChatList chatList={chatList} />
      </div>
      <div
        className={openAttachment ? 'w-2/4 border-r border-border' : 'w-3/4 border-r border-border'}
      >
        <ChatContainer toggleAttachment={toggleAttachment} />
      </div>
      {openAttachment && (
        <div className="flex-1">
          <Attachment />
        </div>
      )}
    </div>
  );
};
