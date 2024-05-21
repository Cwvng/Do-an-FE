import { api } from '../utils/api.util.ts';
import { Project, UpdateProjectBody } from './types/project.interface.ts';

export const getAllProject = async () => {
  const { data } = await api.get<Project[]>('/project');
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
