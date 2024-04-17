import React, { useEffect } from 'react';
import { Avatar, Form, FormProps, Input, theme } from 'antd';
import { IoMdSend } from 'react-icons/io';
import { ChatsResponse, FullChatResponse } from '../../../requests/types/chat.interface.ts';
import { accessChat } from '../../../requests/chat.request.ts';
import { Index } from '../../../components/chat/MessageContainer';
import { SendMessagesBody } from '../../../requests/types/message.interface.ts';
import { sendNewMessage } from '../../../requests/message.request.ts';

interface ChatContainerProps {
    selectedChat: ChatsResponse | undefined;
}

type FieldType = {
    content: string;
};
export const ChatContainer: React.FC<ChatContainerProps> = ({ selectedChat }) => {
    const [chatData, setChatData] = React.useState<FullChatResponse[]>([]);

    const { token } = theme.useToken();
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
            if (selectedChat) {
                const body: SendMessagesBody = {
                    content: values.content,
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

    useEffect(() => {
        getSelectedChatData();
    }, [selectedChat]);

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center border-b-1 border-border px-5 py-3 gap-3">
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
                        <Avatar size="large" src={selectedChat?.users[1].profilePic} />
                        <div className="flex flex-col">
                            <span className="text-lg text-secondary">
                                {selectedChat?.users[1].firstname} {selectedChat?.users[1].lastname}
                            </span>
                            <span className="text-sm ">🟢 Active now</span>
                        </div>
                    </>
                )}
            </div>
            <div className="bg-lightBg relative flex-1 flex flex-col justify-between p-5">
                <div>
                    <Index messages={chatData} />
                </div>
                <div className="absolute bottom-0 right-0 w-full p-3">
                    <Form form={form} onFinish={sendMessage}>
                        <Form.Item name="content">
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
