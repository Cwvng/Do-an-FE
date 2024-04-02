import { createSlice } from '@reduxjs/toolkit';
import { UserAction, UserReducers, UserState } from '../../types/user-state.type';

export const userSlice = createSlice<UserState, UserReducers>({
    name: 'user',
    initialState: null,
    reducers: {
        updateUser: (state: UserState, action: UserAction) => {
            return {
                ...(state || {}),
                ...action.payload,
            } as UserState;
        },
        removeUser: () => {
            return null;
        },
    },
});

export const { updateUser, removeUser } = userSlice.actions;

export const userReducer = userSlice.reducer;
