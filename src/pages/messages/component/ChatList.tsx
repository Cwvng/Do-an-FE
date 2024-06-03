import React, { useEffect, useState } from 'react';
import {
  Divider,
  Form,
  FormProps,
  Input,
  message,
  Modal,
  Select,
  SelectProps,
  Space,
  Tooltip,
} from 'antd';
import { FaSearch } from 'react-icons/fa';
import {
  Chat,
  CreateGroupChatBody,
  CreateNewChatBody,
} from '../../../requests/types/chat.interface.ts';
import { IoCreate } from 'react-icons/io5';
import { getAllOtherUsers } from '../../../requests/user.request.ts';
import { createGroupChat, createNewChat } from '../../../requests/chat.request.ts';
import { ChatNameCard } from '../../../components/chat/ChatNameCard.tsx';
import { AppState, useDispatch, useSelector } from '../../../redux/store';
import { getChatList, setSelectedChat } from '../../../redux/slices/user.slice.ts';

interface ChatListProps {
  chatList: Chat[] | null;
}
const ChatList: React.FC<ChatListProps> = ({ chatList }) => {
  const [openCreateChat, setOpenCreateChat] = React.useState(false);
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [options, setOptions] = React.useState<SelectProps['options']>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const selectedChat = useSelector((app: AppState) => app.user.selectedChat);

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

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const createChat: FormProps<CreateGroupChatBody>['onFinish'] = async (values) => {
    try {
      setSubmitLoading(true);
      if (values.users.length > 1) {
        const body: CreateGroupChatBody = {
          name: values.name.trim(),
          users: values.users,
        };
        await createGroupChat(body);
        dispatch(getChatList({ name: searchTerm }));
        message.success('Created a new group chat');
      } else {
        const body: CreateNewChatBody = {
          userId: values.users[0],
        };
        const res = await createNewChat(body);
        const index = chatList?.findIndex((e) => e._id === res._id);
        if (index && index < 0) {
          dispatch(getChatList({ name: searchTerm }));
          message.success('Created new chat');
        } else {
          //access to chat
        }
      }
      form.resetFields();
    } finally {
      setSubmitLoading(false);
      setOpenCreateChat(false);
    }
  };

  useEffect(() => {
    getUserList();
  }, []);

  useEffect(() => {
    dispatch(getChatList({ name: searchTerm }));
  }, [searchTerm, dispatch]);

  return (
    <>
      <div className="flex flex-col h-full px-5">
        <h1 className="flex justify-between items-center text-secondary">
          Messages
          <Tooltip placement="top" color={'fff'} title={'New chat'}>
            <IoCreate
              className="text-gray-500 hover:cursor-pointer"
              onClick={() => setOpenCreateChat(true)}
            />
          </Tooltip>
        </h1>
        <Input
          size="large"
          suffix={<FaSearch className="text-primary" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Divider />

        <div style={{ overflowY: 'scroll', overflowX: 'hidden' }}>
          {chatList && chatList.length > 0 ? (
            chatList.map((item, index) => (
              <div key={index} onClick={() => dispatch(setSelectedChat(item))}>
                <ChatNameCard isSelected={selectedChat?._id === item._id} item={item} />
              </div>
            ))
          ) : (
            <span className="text-center text-sm text-border">No chat yet</span>
          )}
        </div>
      </div>
      <Modal
        title={<span className="text-xl font-bold text-primary">Create new chat</span>}
        centered
        open={openCreateChat}
        onCancel={() => setOpenCreateChat(false)}
        okText="Create"
        confirmLoading={submitLoading}
        onOk={form.submit}
      >
        <Form layout="vertical" form={form} requiredMark={false} onFinish={createChat}>
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
              filterOption={filterOption}
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
            rules={[
              {
                required: true,
                message: 'Group name is required',
              },
            ]}
            dependencies={['users']}
          >
            {({ getFieldValue }) => (
              <Form.Item name="name" label={<span className="font-medium">Group chat name</span>}>
                <Input size="large" disabled={getFieldValue('users')?.length < 2} />
              </Form.Item>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ChatList;
