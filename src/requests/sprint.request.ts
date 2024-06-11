import { api } from '../utils/api.util.ts';
import { CreateProjectSprintBody, DailySummary, ProjectSprint } from './types/sprint.interface.ts';

export const createProjectSprint = async (body: CreateProjectSprintBody) => {
  const { data } = await api.post<ProjectSprint>('sprint', body);
  return data;
};
export const getSprintDetail = async (sprintId: string) => {
  const { data } = await api.get<ProjectSprint>(`sprint/${sprintId}`);
  return data;
};
export const getSprintSummary = async (sprintId: string) => {
  const { data } = await api.get<DailySummary[]>(`sprint/${sprintId}/summary`);
  return data;
};
