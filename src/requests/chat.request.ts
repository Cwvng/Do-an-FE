import { api } from '../utils/api.util.ts';
import {
  Chat,
  CreateGroupChatBody,
  CreateNewChatBody,
  GetChatListQuery,
  GetMessageListBody,
  Message,
} from './types/chat.interface.ts';

export const getAllChats = async (params?: GetChatListQuery) => {
  const { data } = await api.get<Chat[]>('/chat', { params });
  return data;
};
export const createGroupChat = async (body: CreateGroupChatBody) => {
  const { data } = await api.post<Chat>('/chat/group', body);
  return data;
};
export const createNewChat = async (body: CreateNewChatBody) => {
  const { data } = await api.post<Chat>('/chat', body);
  return data;
};
export const getMessageList = async (param: string, params?: GetMessageListBody) => {
  const { data } = await api.get<Message[]>(`/chat/${param}/messages`, { params });
  return data;
};
export const deleteChat = async (params: string) => {
  const { data } = await api.delete(`/chat/${params}`);
  return data;
};
export const getChatDetail = async (id: string) => {
  const { data } = await api.get<Chat>(`chat/${id}`);
  return data;
};
