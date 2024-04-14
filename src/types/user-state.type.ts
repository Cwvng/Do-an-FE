import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { ChatsResponse } from '../requests/types/chat.interface.ts';

export interface UserProfileState {
    userInfo: UserInfo | undefined;
    chatList: ChatsResponse[];
    isAuthenticated: boolean;
    isLoading: boolean;
}
export interface UserInfo {
    _id: string;
    firstname: string | null;
    lastname: string | null;
    email: string | null;
    profilePic: string | null;
}

export type UserProfileCaseReducer<P = any> = CaseReducer<UserProfileState, PayloadAction<P>>;

export type UserProfileReducers = {
    [K: string]: UserProfileCaseReducer;
} & {
    updateUser: UserProfileCaseReducer<UserInfo>;
    removeUser: CaseReducer<UserProfileState, PayloadAction<undefined>>;
    updateChatList: UserProfileCaseReducer<ChatsResponse[]>;
    addChat: UserProfileCaseReducer<ChatsResponse>;
};
