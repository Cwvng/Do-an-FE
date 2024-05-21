import { api, apiAttachment } from '../utils/api.util.ts';
import { Issue } from './types/issue.interface.ts';

export const getIssueDetailById = async (id: string) => {
  const { data } = await api.get<Issue>(`/issue/${id}`);
  return data;
};
export const updateIssueById = async (id: string, body: any) => {
  const { data } = await apiAttachment.patch<Issue>(`/issue/${id}`, body);
  return data;
};
export const createNewIssue = async (body: Issue) => {
  const { data } = await api.post('/issue', body);
  return data;
};
export const deleteIssueById = async (id: string) => {
  const { data } = await api.delete<Issue>(`/issue/${id}`);
  return data;
};
