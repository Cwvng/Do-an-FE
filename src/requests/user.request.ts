import { api } from '../utils/api.util.ts';
import { UserResponse } from './types/chat.interface.ts';

export const getAllOtherUsers = async () => {
    const { data } = await api.get<UserResponse[]>('/users');
    return data;
};
