import { User } from './chat.interface.ts';

export interface Issue {
  _id?: string;
  label?: string;
  subject?: string;
  description?: string;
  status?: string;
  priority?: string;
  assignee?: User;
  creator?: User;
  parentIssue?: Issue;
  project: string;
  dueDate?: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}
export type UpdateIssueBody = Partial<Issue>;
