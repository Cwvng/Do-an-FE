export interface User {
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
  rating: number;
}
export interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  groupAdmin: string | null;
  latestMessage: Message | null;
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
export interface GetMessageListBody {
  page: number;
}
export interface Message {
  _id: string;
  sender: User;
  content: string;
  chat: Chat;
  readBy: [];
  images: string[];
  createdAt: string;
  updatedAt: string;
  isUpdated: boolean;
}
export interface GetChatListQuery {
  name: string;
}
export interface MessageListResponse {
  messages: Message[];
  total: number;
}
export type UpdateChatBody = Partial<Chat>;
