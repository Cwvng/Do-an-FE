import { api } from '../utils/api.util.ts';
import {
  CreateProjectSprintBody,
  DailySummary,
  ProjectSprint,
  UpdateProjectSprintBody,
} from './types/sprint.interface.ts';

export const createProjectSprint = async (body: CreateProjectSprintBody) => {
  const { data } = await api.post<ProjectSprint>('sprint', body);
  return data;
};
export const getSprintDetail = async (sprintId: string) => {
  const { data } = await api.get<ProjectSprint>(`sprint/${sprintId}`);
  return data;
};
export const deleteSprint = async (sprintId: string) => {
  const { data } = await api.delete(`sprint/${sprintId}`);
  return data;
};
export const updateSprint = async (sprintId: string, body: UpdateProjectSprintBody) => {
  const { data } = await api.patch<ProjectSprint>(`sprint/${sprintId}`, body);
  return data;
};
export const getSprintSummary = async (sprintId: string) => {
  const { data } = await api.get<DailySummary[]>(`sprint/${sprintId}/summary`);
  return data;
};
