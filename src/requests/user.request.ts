import { api } from '../utils/api.util.ts';
import { User } from './types/chat.interface.ts';

export const getAllOtherUsers = async () => {
  const { data } = await api.get<User[]>('/users');
  return data;
};
