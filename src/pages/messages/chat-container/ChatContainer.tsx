import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Dropdown,
  Form,
  FormProps,
  Image,
  Input,
  MenuProps,
  message,
  Modal,
  Select,
  SelectProps,
  Space,
  Spin,
  theme,
  Upload,
  UploadFile,
} from 'antd';
import { IoMdSend } from 'react-icons/io';
import { Chat, Message, User } from '../../../requests/types/chat.interface.ts';
import {
  deleteChat,
  getChatDetail,
  getMessageList,
  updateChat,
} from '../../../requests/chat.request.ts';
import { MessageList } from './MessageList.tsx';
import { SendMessagesBody } from '../../../requests/types/message.interface.ts';
import { sendNewMessage } from '../../../requests/message.request.ts';
import { useSocketContext } from '../../../context/SocketContext.tsx';
import { getReceiverUser } from '../../../utils/message.util.ts';
import { AppState, useDispatch, useSelector } from '../../../redux/store';
import { FaSearch } from 'react-icons/fa';
import { CircleButton } from '../../../components/button/CircleButton.tsx';
import { IoImageOutline } from 'react-icons/io5';
import { FaEllipsisVertical, FaImage } from 'react-icons/fa6';
import { getChatList } from '../../../redux/slices/user.slice.ts';
import { ExclamationCircleFilled, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { getAllOtherUsers } from '../../../requests/user.request.ts';

interface ChatContainerProps {
  toggleAttachment: () => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ toggleAttachment }) => {
  const [loading, setLoading] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [sendMessageLoading, setSendMessageLoading] = React.useState(false);
  const [updateLoading, setUpdateLoading] = React.useState(false);
  const [openUpload, setOpenUpload] = React.useState(false);
  const [canLoadMore, setCanLoadMore] = React.useState(true);
  const [scrollToBottom, setScrollToBottom] = React.useState(false);
  const [selectedChat, setSelectedChat] = React.useState<Chat>();
  const [receiver, setReceiver] = React.useState<User>();
  const [fileList, setFileList] = React.useState<UploadFile[]>();
  const [messageList, setMessageList] = React.useState<Message[]>([]);
  const [previewImage, setPreviewImage] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [options, setOptions] = useState<SelectProps['options']>([]);

  const { token } = theme.useToken();
  const { socket, onlineUsers } = useSocketContext();
  const userId = useSelector((app: AppState) => app.user.userInfo?._id);
  const { id } = useParams();
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const dispatch = useDispatch();

  const getUserList = async () => {
    try {
      const data = await getAllOtherUsers();
      const userList: SelectProps['options'] = [];
      data.forEach((item) => {
        userList.push({
          value: item._id,
          label: item.firstname + ' ' + item.lastname,
          emoji: item.profilePic,
          desc: item.email,
        });
      });
      setOptions(userList);
    } catch (error) {
      console.log(error);
    }
  };
  const getChatInfo = async () => {
    try {
      if (id !== 'undefined' && id) {
        const res = await getChatDetail(id);
        setSelectedChat(res);
        const receiver = getReceiverUser(res.users, userId);
        setReceiver(receiver);
        setScrollToBottom(true);
      }
    } finally {
    }
  };
  const getChatMessageList = async (page: number) => {
    try {
      if (id !== 'undefined' && id) {
        setLoading(true);
        const res = await getMessageList(id, { page });
        setMessageList(res.messages);
      }
    } finally {
      setLoading(false);
    }
  };

  const sendMessage: FormProps<SendMessagesBody>['onFinish'] = async (values) => {
    try {
      if (id && values.content !== '') {
        setSendMessageLoading(true);
        const formData = new FormData();
        if (values.images && values.images.length > 0)
          values.images.forEach((image: any) => {
            formData.append('images', image.originFileObj);
          });
        if (values.content) formData.append('content', values.content);
        if (id) formData.append('chatId', id);
        const res = await sendNewMessage(formData);
        setMessageList([...messageList, res]);

        setOpenUpload(false);
        dispatch(getChatList());
        form.resetFields();
        setScrollToBottom(true);
      }
    } finally {
      setSendMessageLoading(false);
    }
  };
  const updateSelectedChat: FormProps['onFinish'] = async (values) => {
    try {
      if (id) {
        setUpdateLoading(true);
        const updateData = {
          chatName: values.chatName,
          users: values.users,
        };
        await updateChat(id, updateData);
        message.success('Updated successfully');
        form.resetFields();
        setOpenModal(false);
        await getChatInfo();
        dispatch(getChatList());
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const deleteSelectedChat = async () => {
    try {
      setLoading(true);
      if (id) await deleteChat(id);
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

  let items: MenuProps['items'] = [
    {
      label: (
        <span className="text-red-500" onClick={isConfirmToDelete}>
          Delete chat
        </span>
      ),
      key: 'deleteChat',
    },
  ];
  if (selectedChat?.groupAdmin === userId)
    items.unshift({
      label: <span onClick={() => setOpenModal(true)}>Edit chat</span>,
      key: 'editChat',
    });

  //@ts-ignore
  useEffect(() => {
    socket?.on('newMessage', (newMessage) => {
      newMessage.shouldShake = true;
      if (newMessage.chat._id === id) setMessageList([...messageList, newMessage]);
    });

    return () => socket?.off('newMessage');
  }, [socket, setMessageList, messageList]);

  useEffect(() => {
    setMessageList([]);
    setCanLoadMore(true);
    setPage(1);
    getChatInfo();
    getChatMessageList(page);
  }, [id]);

  useEffect(() => {
    getChatMessageList(page);
  }, [page]);
  useEffect(() => {
    getUserList();
  }, []);

  if (!id || id === 'undefined')
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
          <Dropdown
            trigger={['click']}
            menu={{ items }}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
          >
            <CircleButton type="primary" icon={<FaEllipsisVertical size="20" />} />
          </Dropdown>
        </div>
      </div>
      <div className="bg-lightBg flex flex-col h-full overflow-y-hidden justify-between p-5">
        <div className="h-full overflow-y-hidden">
          <MessageList
            getChatMessageList={getChatMessageList}
            page={page}
            messages={messageList}
            setPage={setPage}
            canLoadMore={canLoadMore}
            loading={loading}
            scrollToBottom={scrollToBottom}
            setScrollToBottom={setScrollToBottom}
          />
        </div>
        <div className="mt-5">
          <Form form={form} onFinish={sendMessage}>
            {openUpload && (
              <Form.Item
                className="mt-5"
                name="images"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e && e.fileList;
                }}
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  beforeUpload={(file) => {
                    console.log(file);
                  }}
                  onPreview={async (file: UploadFile) => {
                    setPreviewImage(file.url || (file.preview as string));
                    setPreviewOpen(true);
                  }}
                  customRequest={async (options) => {
                    const { onSuccess, onError, file } = options;

                    try {
                      //@ts-ignore
                      onSuccess(file);
                    } catch (error) {
                      //@ts-ignore
                      onError(error);
                    }
                  }}
                  onChange={({ fileList: newFileList }) => {
                    setFileList(newFileList);
                    console.log(fileList);
                  }}
                  onRemove={(file) => {
                    console.log('remove', file);
                  }}
                >
                  <PlusOutlined className="text-primary text-xl" />
                </Upload>
              </Form.Item>
            )}
            {previewImage && (
              <Image
                wrapperStyle={{ display: 'none' }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(''),
                }}
                src={previewImage}
              />
            )}
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
                prefix={
                  <FaImage
                    onClick={() => setOpenUpload(!openUpload)}
                    className="text-primary text-xl hover:cursor-pointer"
                  />
                }
                suffix={
                  sendMessageLoading ? (
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                  ) : (
                    <IoMdSend
                      onClick={form.submit}
                      className="text-primary text-xl hover:cursor-pointer"
                    />
                  )
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
        onCancel={() => {
          setOpenModal(false);
          updateForm.resetFields();
        }}
        okText="Save"
        confirmLoading={updateLoading}
        onOk={updateForm.submit}
      >
        <Form
          initialValues={{
            chatName: selectedChat?.chatName,
            users: selectedChat?.users.map((item) => ({
              value: item._id,
              label: item.firstname + ' ' + item.lastname,
              emoji: item.profilePic,
              desc: item.email,
            })),
          }}
          layout="vertical"
          form={updateForm}
          requiredMark={false}
          onFinish={updateSelectedChat}
        >
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            name="users"
            label={<span className="font-medium">Members</span>}
          >
            <Select
              className="w-full"
              showSearch
              mode="multiple"
              size="large"
              optionFilterProp="children"
              filterOption={(input: string, option?: { label: string; value: string }) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              // @ts-ignore
              options={options}
              optionRender={(option) => (
                <Space>
                  <img src={option.data.emoji} className="w-10" alt="avatar" />
                  <div className="flex flex-col">
                    <span className="font-medium">{option.data.label}</span>
                    <span className="text-sm">{option.data.desc}</span>
                  </div>
                </Space>
              )}
            />
          </Form.Item>
          <Form.Item
            name="chatName"
            label={<span className="font-medium">Group chat name</span>}
            rules={[
              {
                required: true,
                message: 'Group name is required',
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
