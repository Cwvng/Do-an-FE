export const setAccessToken = (token?: string | null) => {
  if (token) {
    localStorage.setItem(import.meta.env.VITE_ACCESS_TOKEN_KEY || 'access_token', token);
  }
};

export const getAccessToken = () => {
  return localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_KEY || 'access_token');
};

export const removeAccessToken = () => {
  localStorage.removeItem(import.meta.env.VITE_ACCESS_TOKEN_KEY || 'access_token');
};
