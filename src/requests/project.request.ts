import { api } from '../utils/api.util.ts';
import {
  CreateProjectBody,
  GetAllProjectQuery,
  Project,
  UpdateProjectBody,
} from './types/project.interface.ts';
import { CreateProjectSprintBody, ProjectSprint } from './types/sprint.interface.ts';

export const getAllProject = async (params?: GetAllProjectQuery) => {
  const { data } = await api.get<Project[]>(`/project`, { params });
  return data;
};
export const getProjectBacklog = async (projectId: string) => {
  const { data } = await api.get<ProjectSprint[]>(`/project/${projectId}/backlog`);
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
export const createProjectSprint = async (body: CreateProjectSprintBody) => {
  const { data } = await api.post<ProjectSprint>('sprint', body);
  return data;
};
