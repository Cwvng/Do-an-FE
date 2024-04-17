import { FullChatResponse } from '../../../requests/types/chat.interface.ts';

export const isSameSenderMargin = (
    messages: FullChatResponse[],
    m: FullChatResponse,
    i: number,
    userId: string | undefined,
) => {
    if (i < messages.length - 1 && messages[i + 1].sender._id === m.sender._id && messages[i].sender._id !== userId)
        return 33;
    else if (
        (i < messages.length - 1 && messages[i + 1].sender._id !== m.sender._id && messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
        return 0;
    else return 'auto';
};

export const isSameSender = (
    messages: FullChatResponse[],
    m: FullChatResponse,
    i: number,
    userId: string | undefined,
) => {
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id || messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    );
};

export const isLastMessage = (messages: FullChatResponse[], i: number, userId: string | undefined) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    );
};

export const isSameUser = (messages: FullChatResponse[], m: FullChatResponse, i: number) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

// export const getSender = (loggedUser, users) => {
//     return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
// };
//
// export const getSenderFull = (loggedUser, users) => {
//     return users[0]._id === loggedUser._id ? users[1] : users[0];
// };
