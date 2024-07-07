import { Issue } from '../../../requests/types/issue.interface.ts';
import { ProjectSprint } from '../../../requests/types/sprint.interface.ts';

export interface ReportChartInterface {
  issueList?: Issue[] | undefined;
  labels?: string[];
  sprint?: ProjectSprint;
}
