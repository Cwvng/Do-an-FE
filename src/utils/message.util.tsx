import { UserResponse } from '../requests/types/chat.interface.ts';

export const isTodayMessage = (date: string) => {
    const today = new Date();
    const updatedAt = new Date(date);
    return updatedAt.getDate() < today.getDate()
        ? updatedAt.toLocaleDateString('en-US', { weekday: 'short' })
        : updatedAt.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
          });
};
export const getTime = (date: string) => {
    const datetime = new Date(date);
    return datetime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
};
export const getReceiverUser = (users: UserResponse[] | undefined, userId: string | undefined) => {
    return users?.filter((item) => item._id !== userId)[0];
};
