import { Divider, Progress, theme } from 'antd';
import React, { useEffect } from 'react';
import { Issue } from '../../../../requests/types/issue.interface.ts';
import { UserIssueSummaryResponse } from '../../../../requests/types/user.interface.ts';
import moment from 'moment';
import { Status } from '../../../../constants';
import { getSprintDetail } from '../../../../requests/sprint.request.ts';
import { AppState, useSelector } from '../../../../redux/store';

interface TotalReportProps {
  issueList: Issue[];
  doneIssueList: Issue[];
  summary: UserIssueSummaryResponse;
}
export const GeneralReport: React.FC<TotalReportProps> = ({
  issueList,
  doneIssueList,
  summary,
}) => {
  const [sprintIssueList, setSprintIssueList] = React.useState<Issue[]>();

  const { token } = theme.useToken();
  const sprint = useSelector((app: AppState) => app.user.selectedProject?.activeSprint);

  const getSprintIssueList = async () => {
    try {
      if (sprint) {
        const res = await getSprintDetail(sprint);
        setSprintIssueList(res.issues);
      }
    } finally {
    }
  };

  const getLoggedWorkingTime = () => {
    let totalLoggedTime = 0;
    if (issueList) {
      totalLoggedTime = issueList.reduce((acc, item) => acc + item.loggedTime!, 0);
    }
    return totalLoggedTime;
  };
  const calculateTotalCompletionTime = (issues: Issue[]) => {
    let totalTime = 0;

    issues?.forEach((issue) => {
      const doneHistory = issue.history.find(
        (history) => history.field === 'status' && history.newValue === Status.DONE,
      );

      if (doneHistory) {
        const startTime = moment(issue.createdAt);
        const endTime = moment(doneHistory.updatedAt);
        const timeTaken = endTime.diff(startTime, 'hours');
        totalTime += timeTaken;
      }
    });

    return totalTime;
  };

  useEffect(() => {
    getSprintIssueList();
  }, []);

  return (
    <div className="h-full w-2/5 flex flex-col p-5 gap-2 shadow-lg">
      <div className="text-lg">
        <span className="text-secondary font-bold">General Report:</span>
      </div>
      <Divider className="m-0" />
      <div className="text-secondary font-bold">Total assigned issues:</div>
      {issueList?.length}
      <div className="text-secondary font-bold">Completed issue:</div>
      {doneIssueList?.length}
      <div className="text-secondary font-bold">Contribution:</div>
      {Math.floor((issueList?.length / sprintIssueList?.length!) * 100)}% of{' '}
      {sprintIssueList?.length} sprint issues
      <div className="text-secondary font-bold">Total logged time:</div>
      {getLoggedWorkingTime()} (hours)
      <div className="text-secondary font-bold">Average issue complete time:</div>
      {Math.floor(
        calculateTotalCompletionTime(doneIssueList) / doneIssueList?.length!,
      )} (hours) <Divider className="m-1" />
      <div className="text-secondary font-bold">Completed ({doneIssueList?.length})</div>
      <Progress
        percent={Math.floor((doneIssueList?.length! / issueList?.length!) * 100)}
        strokeColor={{
          '0%': token.colorPrimary,
          '100%': '#87d068',
        }}
      />
      <div className="text-secondary font-bold">
        Completed on time ({summary?.issuesCompletedOnTime})
      </div>
      <Progress
        percent={(summary?.issuesCompletedOnTime! / doneIssueList?.length!) * 100}
        strokeColor={{
          '0%': token.colorPrimary,
          '100%': '#87d068',
        }}
      />
      <div className="text-secondary font-bold">
        Completed without feedback ({summary?.issuesCompletedWithoutFeedback})
      </div>
      <Progress
        percent={(summary?.issuesCompletedWithoutFeedback! / doneIssueList?.length!) * 100}
        strokeColor={{
          '0%': token.colorPrimary,
          '100%': '#87d068',
        }}
      />{' '}
    </div>
  );
};
