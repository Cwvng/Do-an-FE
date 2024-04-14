import { api } from '../utils/api.util.ts';
import { ChatsResponse, CreateGroupChatBody, CreateNewChatBody, FullChatResponse } from './types/chat.interface.ts';

export const getAllChats = async () => {
    const { data } = await api.get<ChatsResponse[]>('/chat');
    return data;
};
export const createGroupChat = async (body: CreateGroupChatBody) => {
    const { data } = await api.post<ChatsResponse>('/chat/group', body);
    return data;
};
export const createNewChat = async (body: CreateNewChatBody) => {
    const { data } = await api.post<ChatsResponse>('/chat', body);
    return data;
};
export const accessChat = async (param: string) => {
    const { data } = await api.get<FullChatResponse[]>(`/chat/${param}`);
    return data;
};
