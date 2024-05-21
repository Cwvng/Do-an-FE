import { message } from 'antd';
import axios, {
  AxiosError,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';
import { AxiosInstanceOptions } from '../types/axios-instance-options.type';
import { getAccessToken, removeAccessToken } from './storage.util';

export const createApiInstance = (
  config: CreateAxiosDefaults,
  { auth = true, silent }: AxiosInstanceOptions = {},
) => {
  const api = axios.create(config);

  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (auth && config?.headers) {
        config.headers['Authorization'] = 'Bearer ' + getAccessToken();
      }
      return config;
    },
    (error: AxiosError<any, any>) => {
      Promise.reject(error);
    },
  );

  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<any, any>) => {
      if (error.response?.status === 401) {
        removeAccessToken();
      }

      if (!silent) {
        message.error(error.response?.data?.message);
      }

      return Promise.reject(error);
    },
  );

  return api;
};

export const api = createApiInstance({
  baseURL: import.meta.env.VITE_API_ENDPOINT + '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
});

export const apiExport = createApiInstance({
  baseURL: import.meta.env.VITE_API_ENDPOINT + '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
  responseType: 'blob',
});

export const apiAttachment = createApiInstance({
  baseURL: import.meta.env.VITE_API_ENDPOINT + '/api',
  headers: {
    'Content-Type': 'multipart/form-data',
    Accept: '*/*',
  },
});

export const silentApi = createApiInstance(
  {
    baseURL: import.meta.env.VITE_API_ENDPOINT + '/api',
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
    },
  },
  { silent: true },
);
