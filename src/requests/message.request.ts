import { api } from '../utils/api.util.ts';
import { SendMessagesBody, UpdateMessageBody } from './types/message.interface.ts';
import { Message } from './types/chat.interface.ts';

export const sendNewMessage = async (body: SendMessagesBody) => {
  const { data } = await api.post<Message>('/messages', body);
  return data;
};
export const deleteMessage = async (id: string) => {
  const { data } = await api.delete(`/messages/${id}`);
  return data;
};
export const updateMessage = async (id: string, body: UpdateMessageBody) => {
  const { data } = await api.patch(`/messages/${id}`, body);
  return data;
};
