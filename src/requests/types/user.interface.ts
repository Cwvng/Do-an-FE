import { User } from './chat.interface.ts';

export type UpdateUserBody = Partial<User>;
export interface UserIssueSummaryQuery {
  sprintId: string;
}
export interface UserIssueSummaryResponse {
  issuesCompletedOnTime: number;
  issuesCompletedWithoutFeedback: number;
  rating: number;
}
