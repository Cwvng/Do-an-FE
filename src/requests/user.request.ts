import { api, apiAttachment } from '../utils/api.util.ts';
import { User } from './types/chat.interface.ts';

export const getAllOtherUsers = async () => {
  const { data } = await api.get<User[]>('/users');
  return data;
};
export const updateUserInfo = async (body: any) => {
  const { data } = await apiAttachment.patch<User>('/users', body);
  return data;
};
