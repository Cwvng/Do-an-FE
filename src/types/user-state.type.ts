import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { ChatsResponse, UserResponse } from '../requests/types/chat.interface.ts';

export interface UserProfileState {
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  isLoading: boolean;
  chatList: ChatsResponse[] | null;
  selectedChat: ChatsResponse | null;
}
export interface UserInfo extends UserResponse {}

export type UserProfileCaseReducer<P = any> = CaseReducer<UserProfileState, PayloadAction<P>>;

export type UserProfileReducers = {
  [K: string]: UserProfileCaseReducer;
} & {
  logout: UserProfileCaseReducer<undefined>;
  updateUser: UserProfileCaseReducer<UserInfo>;
  setSelectedChat: UserProfileCaseReducer<ChatsResponse>;
};
