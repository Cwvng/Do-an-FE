import React, { useEffect } from 'react';
import { Divider, Form, FormProps, Input, message, Modal, Select, SelectProps, Space, Spin, Tooltip } from 'antd';
import { FaSearch } from 'react-icons/fa';
import { ChatNameCard } from './ChatNameCard.tsx';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { ChatsResponse, CreateGroupChatBody, CreateNewChatBody } from '../../requests/types/chat.interface.ts';
import { IoCreate } from 'react-icons/io5';
import { LoadingOutlined } from '@ant-design/icons';
import { getAllOtherUsers } from '../../requests/user.request.ts';
import { createGroupChat, createNewChat, getAllChats } from '../../requests/chat.request.ts';

const ChatList: React.FC = () => {
    const [openPinnedList, setOpenPinnedList] = React.useState(false);
    const [openChatList, setOpenChatList] = React.useState(true);
    const [openCreateChat, setOpenCreateChat] = React.useState(false);
    const [submitLoading, setSubmitLoading] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [options, setOptions] = React.useState<SelectProps['options']>([]);
    const [chatList, setChatList] = React.useState<ChatsResponse[]>([]);

    const [form] = Form.useForm();

    const togglePinnedList = () => setOpenPinnedList((prevState) => !prevState);
    const toggleChatList = () => setOpenChatList((prevState) => !prevState);

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
                const res = await createGroupChat(body);
                setChatList([res, ...chatList]);
                message.success('Created a new group chat');
            } else {
                const body: CreateNewChatBody = {
                    userId: values.users[0],
                };
                const res = await createNewChat(body);
                const index = chatList.findIndex((e) => (e._id = res._id));
                if (index < 0) {
                    setChatList([res, ...chatList]);
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
    const getChatList = async () => {
        try {
            setLoading(true);
            setChatList(await getAllChats());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserList();
        getChatList();
    }, []);
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
                    placeholder="Enter name ..."
                    suffix={<FaSearch className="text-primary" />}
                    aria-label="Search for a chat"
                />
                <Divider />
                <div
                    className="mb-3 flex items-center justify-between hover:cursor-pointer hover:bg-hoverBg p-1"
                    onClick={togglePinnedList}
                    aria-label="Toggle pinned list"
                >
                    Pinned 📌
                    {openPinnedList ? (
                        <IoIosArrowDown aria-label="Collapse pinned list" />
                    ) : (
                        <IoIosArrowUp aria-label="Expand pinned list" />
                    )}
                </div>
                {/*{openPinnedList && Array.from({ length: 2 }, (_, index) => <ChatNameCard item={item} key={index} />)}*/}
                <div
                    className="mb-3 flex items-center justify-between hover:cursor-pointer hover:bg-hoverBg p-1"
                    onClick={toggleChatList}
                    aria-label="Toggle chat list"
                >
                    All chat 💬
                    {openChatList ? (
                        <IoIosArrowDown aria-label="Collapse chat list" />
                    ) : (
                        <IoIosArrowUp aria-label="Expand chat list" />
                    )}
                </div>
                {loading && <Spin indicator={<LoadingOutlined spin style={{ fontSize: 24 }} />} />}
                <div style={{ overflowY: 'scroll', overflowX: 'hidden' }}>
                    {openChatList &&
                        (chatList && chatList.length > 0 ? (
                            chatList.map((item, index) => <ChatNameCard item={item} key={index} />)
                        ) : (
                            <span className="text-center text-sm text-border">No chat yet</span>
                        ))}
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
                <Form layout="vertical" form={form} onFinish={createChat}>
                    <Form.Item name="users" label={<span className="font-medium">Members</span>}>
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
                    <Form.Item dependencies={['users']}>
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