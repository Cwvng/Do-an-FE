import { createSlice } from '@reduxjs/toolkit';
import { UserProfileReducers, UserProfileState } from '../../types/user-state.type';

const initialState: UserProfileState = {
    userInfo: null,
    chatList: [],
};
export const userSlice = createSlice<UserProfileState, UserProfileReducers>({
    name: 'user',
    initialState: initialState,
    reducers: {
        updateUser: (state, action) => {
            return {
                ...(state || {}),
                userInfo: action.payload,
            } as UserProfileState;
        },
        //@ts-ignore
        removeUser: () => {
            return null;
        },
        updateChatList: (state, action) => {
            state.chatList = action.payload;
        },
        addChat: (state, action) => {
            state.chatList = [...state.chatList, action.payload];
        },
    },
});

export const { updateUser, removeUser, updateChatList, addChat } = userSlice.actions;

export const userReducer = userSlice.reducer;
