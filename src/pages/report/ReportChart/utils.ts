import { Issue } from '../../../requests/types/issue.interface.ts';

export interface ReportChartInterface {
  issueList?: Issue[] | undefined;
  labels?: string[];
}
