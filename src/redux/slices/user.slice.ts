import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UserInfo, UserProfileReducers, UserProfileState } from '../../types/user-state.type';
import { getLoggedUserInfo } from '../../requests/auth.request.ts';

const initialState: UserProfileState = {
    isAuthenticated: false,
    isLoading: false,
    userInfo: undefined,
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
    extraReducers: (builder) => {
        builder
            .addCase(getUserInfo.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.userInfo = action.payload;
                state.isLoading = false;
            })
            .addCase(getUserInfo.rejected, (state) => {
                state.isAuthenticated = false;
                state.isLoading = false;
            });
    },
});
export const getUserInfo = createAsyncThunk<UserInfo>('auth/user', async () => {
    return getLoggedUserInfo();
});
export const { updateUser, removeUser, updateChatList, addChat } = userSlice.actions;

export const userReducer = userSlice.reducer;
