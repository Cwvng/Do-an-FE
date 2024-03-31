import { api } from '../utils/api.util.ts';
import { setAccessToken } from '../utils/storage.util.ts';
import { GoogleLoginBody, LoginBody, SignupBody } from './types/auth.interface.ts';

export const login = async (body: LoginBody) => {
    const { data } = await api.post('/auth/login', body);
    const { accessToken } = data;
    setAccessToken(accessToken);
    return data;
};
export const googleLogin = async (body: GoogleLoginBody) => {
    const { data } = await api.post('/auth/google-login', body);
    return data;
};
export const signup = async (body: SignupBody) => {
    const { data } = await api.post('/register', body);
    const { accessToken } = data;
    setAccessToken(accessToken);
    return data;
};
