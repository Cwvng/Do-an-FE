import { User } from './chat.interface.ts';
import { Issue } from './issue.interface.ts';

export interface Project {
  _id: string;
  name: string;
  members: User[];
  issues: Issue[];
  projectManager: User;
  activeSprint: ProjectSprint;
  createdAt: string;
  updatedAt: string;
}
export type UpdateProjectBody = Partial<Project>;
export interface CreateProjectBody {
  name: string;
  members: User[];
}
export interface GetAllProjectQuery {
  name: string | null;
}
export interface ProjectSprint {
  _id: string;
  ordinary: string;
  members: User[];
  issues: Issue[];
  startDate: string;
  endDate: string;
  sprintGoal: string;
}
export type CreateProjectSprintBody = Partial<ProjectSprint>;
