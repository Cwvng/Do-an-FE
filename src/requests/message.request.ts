import { api } from '../utils/api.util.ts';
import { SendMessagesBody } from './types/message.interface.ts';
import { FullChatResponse } from './types/chat.interface.ts';

export const sendNewMessage = async (body: SendMessagesBody) => {
    const { data } = await api.post<FullChatResponse>('/messages', body);
    return data;
};
