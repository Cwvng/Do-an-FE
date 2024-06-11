import { User } from './chat.interface.ts';
import { Issue } from './issue.interface.ts';

export interface ProjectSprint {
  _id: string;
  ordinary: string;
  members: User[];
  issues: Issue[];
  startDate: string;
  endDate: string;
  sprintGoal: string;
  isActive: boolean;
  dailySummary: DailySummary[];
}
export interface DailySummary {
  date: string;
  done: string;
  in_progress: string;
  new: string;
  sprint: string;
  total: 0;
  _id: string;
}
export type CreateProjectSprintBody = Partial<ProjectSprint>;
