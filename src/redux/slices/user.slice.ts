import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UserInfo, UserProfileReducers, UserProfileState } from '../../types/user-state.type.ts';
import { getLoggedUserInfo } from '../../requests/auth.request.ts';
import { setAccessToken } from '../../utils/storage.util.ts';
import { AppDispatch } from '../store';
import { getAllChats } from '../../requests/chat.request.ts';
import { getProjectById } from '../../requests/project.request.ts';

const initialState: UserProfileState = {
  isAuthenticated: false,
  userInfo: null,
  isLoading: false,
  chatList: null,
  selectedChat: null,
  selectedProject: null,
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
      })
      .addCase(getProjectDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProjectDetail.fulfilled, (state, action) => {
        state.selectedProject = action.payload;
        state.isLoading = false;
      })
      .addCase(getProjectDetail.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { logout, updateUser, setSelectedChat } = userSlice.actions;

export const getUserInfo = createAsyncThunk<UserInfo>('/user', async () => {
  return getLoggedUserInfo();
});
export const getChatList = createAsyncThunk('/chat', async () => {
  return getAllChats();
});

export const getProjectDetail = createAsyncThunk('/project', async (id: string) => {
  return await getProjectById(id);
});
export const userLogout = () => async (dispatch: AppDispatch) => {
  try {
    setAccessToken(null);
    dispatch(logout());
  } catch (err: any) {
    throw new Error(err);
  }
};

export const userReducer = userSlice.reducer;
