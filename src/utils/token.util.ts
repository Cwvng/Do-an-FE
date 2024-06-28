import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token: any) => {
  if (!token) return true;
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    console.log(decodedToken);
    return decodedToken.exp && decodedToken.exp > currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};
