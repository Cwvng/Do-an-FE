import { api } from '../utils/api.util.ts';
import { User } from './types/chat.interface.ts';
import { UpdateUserBody } from './types/user.interface.ts';

export const getAllOtherUsers = async () => {
  const { data } = await api.get<User[]>('/users');
  return data;
};
export const updateUserInfo = async (body: UpdateUserBody) => {
  const { data } = await api.patch<User>('/users', body);
  return data;
};
