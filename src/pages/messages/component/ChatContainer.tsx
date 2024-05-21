import React, { useEffect } from 'react';
import { Avatar, Dropdown, Form, FormProps, Input, MenuProps, Modal, theme } from 'antd';
import { IoMdSend } from 'react-icons/io';
import { Message } from '../../../requests/types/chat.interface.ts';
import { accessChat, deleteChat } from '../../../requests/chat.request.ts';
import { MessageContainer } from '../../../components/chat/MessageContainer';
import { SendMessagesBody } from '../../../requests/types/message.interface.ts';
import { sendNewMessage } from '../../../requests/message.request.ts';
import { useSocketContext } from '../../../context/SocketContext.tsx';
import { getReceiverUser } from '../../../utils/message.util.tsx';
import { AppState, useDispatch, useSelector } from '../../../redux/store';
import { FaSearch } from 'react-icons/fa';
import { CircleButton } from '../../../components/common/button/CircleButton.tsx';
import { IoImageOutline } from 'react-icons/io5';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { Loading } from '../../../components/loading/Loading.tsx';
import { getChatList } from '../../../redux/slices/user.slice.ts';
import { ExclamationCircleFilled } from '@ant-design/icons';

interface ChatContainerProps {
  toggleAttachment: () => void;
}

type FieldType = {
  content: string;
};
export const ChatContainer: React.FC<ChatContainerProps> = ({ toggleAttachment }) => {
  const [chatData, setChatData] = React.useState<Message[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);

  const { token } = theme.useToken();
  const { socket, onlineUsers } = useSocketContext();
  const userId = useSelector((app: AppState) => app.user.userInfo?._id);
  const selectedChat = useSelector((app: AppState) => app.user.selectedChat);
  const receiver = getReceiverUser(selectedChat?.users, userId);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const getSelectedChatData = async () => {
    try {
      if (selectedChat) {
        const res = await accessChat(selectedChat._id);
        setChatData(res);
      }
    } finally {
      console.log('done');
    }
  };
  const sendMessage: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      if (selectedChat && values.content !== '') {
        const body: SendMessagesBody = {
          content: values.content.trim(),
          chatId: selectedChat._id,
        };
        const res = await sendNewMessage(body);
        setChatData([...chatData, res]);
        dispatch(getChatList());
        form.resetFields();
      }
    } finally {
      console.log('sent');
    }
  };

  const deleteSelectedChat = async () => {
    try {
      setLoading(true);
      if (selectedChat?._id) await deleteChat(selectedChat._id);
      dispatch(getChatList());
    } finally {
      setLoading(false);
    }
  };
  const isConfirmToDelete = () => {
    Modal.confirm({
      centered: true,
      title: 'Do you want to delete these items?',
      icon: <ExclamationCircleFilled />,
      onOk() {
        deleteSelectedChat();
      },
      okText: 'Yes',
      cancelText: 'No',
    });
  };

  const items: MenuProps['items'] = [
    {
      label: <span onClick={() => setOpenModal(true)}>Edit chat</span>,
      key: 'editChat',
    },
    {
      label: (
        <span className="text-red-500" onClick={isConfirmToDelete}>
          Delete chat
        </span>
      ),
      key: 'deleteChat',
    },
  ];
  //@ts-ignore
  useEffect(() => {
    socket?.on('newMessage', (newMessage) => {
      newMessage.shouldShake = true;
      // const sound = new Audio(notificationSound);
      // sound.play();
      if (newMessage.chat._id === selectedChat?._id) setChatData([...chatData, newMessage]);
    });

    return () => socket?.off('newMessage');
  }, [socket, setChatData, chatData]);

  useEffect(() => {
    getSelectedChatData();
  }, [selectedChat]);

  if (loading) return <Loading />;
  if (!selectedChat)
    return (
      <div className="bg-lightBg h-full flex items-center justify-center flex-col">
        <img
          className="w-1/2"
          src="https://cdni.iconscout.com/illustration/premium/thumb/message-notification-in-laptop-with-coffee-cup-3178506-2670442.png"
        />
        <span className="text-secondary ">No chat selected</span>
      </div>
    );
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-row justify-between items-center border-b-1 border-border px-5 py-3 gap-3">
        <div className="flex gap-3 items-center">
          {selectedChat?.isGroupChat ? (
            <>
              <Avatar.Group
                maxCount={2}
                maxStyle={{ color: token.colorError, backgroundColor: token.colorErrorBg }}
              >
                {selectedChat?.users.map((user, index) => {
                  return <Avatar key={index} src={user.profilePic} />;
                })}
              </Avatar.Group>
              <div className="flex flex-col">
                <span className="text-lg text-secondary">{selectedChat?.chatName}</span>
                <span className="text-sm ">{selectedChat?.users.length} members</span>
              </div>
            </>
          ) : (
            <>
              <Avatar size="large" src={receiver?.profilePic} />
              <div className="flex flex-col">
                <span className="text-lg text-secondary">
                  {receiver?.firstname} {receiver?.lastname}
                </span>
                {onlineUsers.includes(getReceiverUser(selectedChat?.users, userId)?._id) ? (
                  <span className="text-sm ">🟢 Online</span>
                ) : (
                  <span className="text-sm">Offline</span>
                )}
              </div>
            </>
          )}
        </div>
        <div className="flex flex-row items-center gap-5">
          <CircleButton type="primary" icon={<FaSearch size="15" />} />
          <CircleButton
            type="primary"
            icon={<IoImageOutline size="20" />}
            onClick={toggleAttachment}
          />
          <Dropdown menu={{ items }} placement="bottomLeft" arrow={{ pointAtCenter: true }}>
            <CircleButton type="primary" icon={<FaEllipsisVertical size="20" />} />
          </Dropdown>
        </div>
      </div>
      <div className="bg-lightBg flex flex-col h-full overflow-y-hidden justify-between p-5">
        <div className="h-full overflow-y-hidden">
          <MessageContainer messages={chatData} />
        </div>
        <div className="mt-5">
          <Form className="" form={form} onFinish={sendMessage}>
            <Form.Item
              name="content"
              rules={[
                {
                  pattern: /^(?!\s*$).+/,
                  message: 'Message should not be an empty string',
                  validateTrigger: '',
                },
              ]}
            >
              <Input
                className="p-3"
                suffix={
                  <IoMdSend
                    onClick={form.submit}
                    className="text-primary text-xl hover:cursor-pointer"
                  />
                }
              />
            </Form.Item>
          </Form>
        </div>
      </div>
      <Modal
        title={<span className="text-xl font-bold text-primary">Edit chat</span>}
        centered
        open={openModal}
        onCancel={() => setOpenModal(false)}
        okText="Save"
        onOk={form.submit}
      ></Modal>
    </div>
  );
};
