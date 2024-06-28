import { api } from '../utils/api.util.ts';
import { setAccessToken } from '../utils/storage.util.ts';
import {
  GoogleLoginBody,
  LoginBody,
  ResetPasswordBody,
  SendEmailBody,
  SignupBody,
} from './types/auth.interface.ts';

export const login = async (body: LoginBody) => {
  const { data } = await api.post('/auth/login', body);
  const { access_token } = data;
  setAccessToken(access_token);
  return data;
};
export const googleLogin = async (body: GoogleLoginBody) => {
  const { data } = await api.post('/auth/google-login', body);
  return data;
};
export const signup = async (body: SignupBody) => {
  const { data } = await api.post('/auth/signup', body);
  return data;
};
export const getLoggedUserInfo = async () => {
  const { data } = await api.get('/auth/user');
  return data;
};
export const verifyEmail = async (id: string, token: string) => {
  const { data } = await api.get(`/auth/verify-email/${id}/${token}`);
  return data;
};

export const sendEmailReset = async (body: SendEmailBody) => {
  const { data } = await api.post('auth/reset-password', body);
  return data;
};
export const sendEmailSignup = async (body: SendEmailBody) => {
  const { data } = await api.post('auth/signup', body);
  return data;
};

export const resetPassword = async (id: string, token: string, body: ResetPasswordBody) => {
  const { data } = await api.post(`auth/reset-password/${id}/${token}`, body);
  return data;
};
