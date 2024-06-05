import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { Chat, User } from '../requests/types/chat.interface.ts';
import { Project } from '../requests/types/project.interface.ts';

export interface UserProfileState {
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  isLoading: boolean;
  chatList: Chat[] | null;
  selectedChat: Chat | null;
  selectedProject: Project | null;
}
export interface UserInfo extends User {}

export type UserProfileCaseReducer<P = any> = CaseReducer<UserProfileState, PayloadAction<P>>;

export type UserProfileReducers = {
  [K: string]: UserProfileCaseReducer;
} & {
  logout: UserProfileCaseReducer<undefined>;
  updateUser: UserProfileCaseReducer<UserInfo>;
  setSelectedChat: UserProfileCaseReducer<Chat>;
  setSelectedProject: UserProfileCaseReducer<Project>;
};
