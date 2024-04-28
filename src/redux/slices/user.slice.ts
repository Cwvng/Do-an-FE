import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UserInfo, UserProfileReducers, UserProfileState } from '../../types/user-state.type.ts';
import { getLoggedUserInfo } from '../../requests/auth.request.ts';
import { setAccessToken } from '../../utils/storage.util.ts';
import { AppDispatch } from '../store';
import { getAllChats } from '../../requests/chat.request.ts';

const initialState: UserProfileState = {
  isAuthenticated: false,
  userInfo: null,
  isLoading: false,
  chatList: null,
  selectedChat: null,
};

export const userSlice = createSlice<UserProfileState, UserProfileReducers>({
  name: 'userSlice',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.userInfo = null;
    },

    updateUser: (state, action) => {
      state.userInfo = action.payload;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
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
      })
      .addCase(getChatList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getChatList.fulfilled, (state, action) => {
        state.chatList = action.payload;
        state.selectedChat = action.payload[0];
        state.isLoading = false;
      })
      .addCase(getChatList.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { logout, updateUser, setSelectedChat } = userSlice.actions;

export const getUserInfo = createAsyncThunk<UserInfo>('auth/me', async () => {
  return getLoggedUserInfo();
});

export const userLogout = () => async (dispatch: AppDispatch) => {
  try {
    setAccessToken(null);
    dispatch(logout());
  } catch (err: any) {
    throw new Error(err);
  }
};

export const getChatList = createAsyncThunk('/chat', async () => {
  return getAllChats();
});
export const userReducer = userSlice.reducer;
