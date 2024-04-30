export interface UserResponse {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  authType: string;
  authGoogleID: string | null;
  gender: string;
  profilePic: string;
  createdAt: string;
  updatedAt: string;
}
export interface ChatsResponse {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: UserResponse[];
  groupAdmin: UserResponse | null;
  latestMessage: FullChatResponse | null;
  createdAt: string;
  updatedAt: string;
}
export interface CreateGroupChatBody {
  name: string;
  users: string[];
}
export interface CreateNewChatBody {
  userId: string;
}
export interface FullChatResponse {
  _id: string;
  sender: UserResponse;
  content: string;
  chat: ChatsResponse;
  readBy: [];
  createdAt: string;
  updatedAt: string;
}
