import { api } from '../utils/api.util.ts';
import {
  CreateProjectBody,
  GetAllProjectQuery,
  Project,
  UpdateProjectBody,
} from './types/project.interface.ts';

export const getAllProject = async (params: GetAllProjectQuery) => {
  const { data } = await api.get<Project[]>(`/project`, { params });
  return data;
};

export const getProjectById = async (projectId: string, searchQuery?: string) => {
  const { data } = await api.get<Project>(`project/${projectId}?search=${searchQuery}`);
  return data;
};
export const updateProjectById = async (projectId: string, body: UpdateProjectBody) => {
  const { data } = await api.patch<Project>(`project/${projectId}`, body);
  return data;
};
export const createProject = async (body: CreateProjectBody) => {
  const { data } = await api.post(`/project`, body);
  return data;
};
export const deleteProject = async (projectId: string) => {
  const { data } = await api.delete<Project>(`project/${projectId}`);
  return data;
};
