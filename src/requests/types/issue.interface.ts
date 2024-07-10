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
  sprintId?: string;
  images?: string[];
  remainingDays?: string;
  history: IssueHistory[];
  createdAt?: string;
  updatedAt?: string;
  estimateTime?: number;
  loggedTime?: number;
  comments?: IssueComment[];
  pullRequest?: string;
}
export type UpdateIssueBody = Partial<Issue>;
export interface GetIssueListQuery {
  label?: string;
  assignee?: string;
  priority?: string;
  sprintId?: string;
}
export interface IssueHistory {
  field: string;
  oldValue: string;
  newValue: string;
  updatedBy: User;
  updatedAt: string;
  createdAt: string;
  _id: string;
}
export interface IssueComment {
  content: string;
  sender: User;
  createdAt: string;
}
export interface CreateIssueCommentBody {
  content: string;
  sender: string;
}
