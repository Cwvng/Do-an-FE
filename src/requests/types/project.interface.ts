import { User } from './chat.interface.ts';
import { Issue } from './issue.interface.ts';

export interface Project {
  _id: string;
  name: string;
  members: User[];
  issues: Issue[];
  projectManager: User;
  createdAt: string;
  updatedAt: string;
}
export type UpdateProjectBody = Partial<Project>;
