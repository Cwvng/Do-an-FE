import { Message } from '../../requests/types/chat.interface.ts';

export const isSameSenderMargin = (
  messages: Message[],
  m: Message,
  i: number,
  userId: string | undefined,
) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return 'auto';
};

export const isSameSender = (
  messages: Message[],
  m: Message,
  i: number,
  userId: string | undefined,
) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id || messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages: Message[], i: number, userId: string | undefined) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (messages: Message[], m: Message, i: number) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
export const isUserMessage = (m: Message, userId: string | undefined) => {
  return m.sender._id === userId;
};
// export const getSender = (loggedUser, users) => {
//     return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
// };
//
// export const getSenderFull = (loggedUser, users) => {
//     return users[0]._id === loggedUser._id ? users[1] : users[0];
// };
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
export const isFirstMessageOfDay = (messages: Message[], m: Message) => {
  const getDayKey = (dateStr: string) => new Date(dateStr).setHours(0, 0, 0, 0);
  let earliestMessagesByDay: any = {};

  messages.forEach((message) => {
    const dayKey = getDayKey(message.updatedAt);
    if (
      !earliestMessagesByDay[dayKey] ||
      new Date(message.updatedAt) < new Date(earliestMessagesByDay[dayKey].updatedAt)
    ) {
      earliestMessagesByDay[dayKey] = message;
    }
  });

  const earliestMessages = Object.values(earliestMessagesByDay);
  return earliestMessages.map((item: any) => item?._id).includes(m._id);
};

export const isTodayFirstMessage = (date: string) => {
  const today = new Date();
  const updatedAt = new Date(date);
  return updatedAt.getDate() < today.getDate()
    ? updatedAt.toLocaleDateString('en-US', { weekday: 'short' })
    : 'Today';
};
