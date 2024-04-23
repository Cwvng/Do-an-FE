import React, { useEffect } from 'react';
import { Avatar, Form, FormProps, Input, theme } from 'antd';
import { IoMdSend } from 'react-icons/io';
import { ChatsResponse, FullChatResponse } from '../../../requests/types/chat.interface.ts';
import { accessChat } from '../../../requests/chat.request.ts';
import { MessageContainer } from '../../../components/chat/MessageContainer';
import { SendMessagesBody } from '../../../requests/types/message.interface.ts';
import { sendNewMessage } from '../../../requests/message.request.ts';
import { useSocketContext } from '../../../context/SocketContext.tsx';
import { getReceiverUser } from '../../../utils/message.util.tsx';
import { AppState, useSelector } from '../../../redux/store';
import { FaSearch } from 'react-icons/fa';
import { CircleButton } from '../../../components/common/button/CircleButton.tsx';
import { IoImageOutline } from 'react-icons/io5';
import { FaEllipsisVertical } from 'react-icons/fa6';

interface ChatContainerProps {
    selectedChat: ChatsResponse | undefined;
    toggleAttachment: () => void;
}

type FieldType = {
    content: string;
};
export const ChatContainer: React.FC<ChatContainerProps> = ({ selectedChat, toggleAttachment }) => {
    const [chatData, setChatData] = React.useState<FullChatResponse[]>([]);

    const { token } = theme.useToken();
    const { socket, onlineUsers } = useSocketContext();
    const userId = useSelector((app: AppState) => app.user.userInfo?._id);
    const receiver = getReceiverUser(selectedChat?.users, userId);
    const [form] = Form.useForm();

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
                form.resetFields();
            }
        } finally {
            console.log('sent');
        }
    };
    //@ts-ignore
    useEffect(() => {
        socket?.on('newMessage', (newMessage) => {
            newMessage.shouldShake = true;
            // const sound = new Audio(notificationSound);
            // sound.play();
            setChatData([...chatData, newMessage]);
        });

        return () => socket?.off('newMessage');
    }, [socket, setChatData, chatData]);

    useEffect(() => {
        getSelectedChatData();
    }, [selectedChat]);

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
                    <CircleButton type="primary" icon={<IoImageOutline size="20" />} onClick={toggleAttachment} />
                    <CircleButton type="primary" icon={<FaEllipsisVertical size="20" />} />
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
                                suffix={<IoMdSend className="text-primary text-xl hover:cursor-pointer" />}
                            />
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};
