import { CaseReducer } from '@reduxjs/toolkit';

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    profilePic: string;
}

export interface UserAction {
    type: string;
    payload: Partial<User>;
}
export interface UserReducers {
    [K: string]: CaseReducer<UserState, UserAction>;
}
export type UserState = User | null | undefined;
