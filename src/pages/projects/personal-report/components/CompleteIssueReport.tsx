import React from 'react';
import { Divider, theme } from 'antd';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Issue } from '../../../../requests/types/issue.interface.ts';
import { UserIssueSummaryResponse } from '../../../../requests/types/user.interface.ts';
import { Priority, Status } from '../../../../constants';
import moment from 'moment/moment';

interface CompleteIssueReportProps {
  doneIssueList: Issue[];
  issueList: Issue[];
  summary: UserIssueSummaryResponse;
}
export const CompleteIssueReport: React.FC<CompleteIssueReportProps> = ({ doneIssueList }) => {
  const { token } = theme.useToken();

  const calculateStatusStatistics = (issues: Issue[]) => {
    const statusCount = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
    };

    issues?.forEach((issue) => {
      switch (issue.priority) {
        case Priority.LOW:
          statusCount.low++;
          break;
        case Priority.MEDIUM:
          statusCount.medium++;
          break;
        case Priority.HIGH:
          statusCount.high++;
          break;
        case Priority.URGENT:
          statusCount.urgent++;
          break;
      }
    });

    return Object.values(statusCount);
  };

  const statusData = {
    labels: ['Low', 'Medium', 'High', 'Urgent'],
    datasets: [
      {
        label: 'Number of completed issue by priority',
        data: calculateStatusStatistics(doneIssueList!),
        backgroundColor: [token.green4, token.yellow4, token.orange4, token.red4],
        borderColor: [token.green4, token.yellow4, token.orange4, token.red4],
        borderWidth: 1,
      },
    ],
  };

  const calculateTakenTime = (issues: Issue[]) => {
    let totalTime: number[] = [];

    issues?.forEach((issue) => {
      const doneHistory = issue.history.find(
        (history) => history.field === 'status' && history.newValue === Status.DONE,
      );

      if (doneHistory) {
        const startTime = moment(issue.createdAt);
        const endTime = moment(doneHistory.updatedAt);
        const timeTaken = endTime.diff(startTime, 'minutes') / 60;
        totalTime.push(Math.round(timeTaken * 100) / 100);
        console.log(totalTime);
      }
    });

    return totalTime;
  };

  const completedIssueData = {
    labels: doneIssueList?.map((item) => item.label),
    datasets: [
      {
        label: 'Time taken to complete issue (hours)',
        data: calculateTakenTime(doneIssueList!),
        backgroundColor: token.colorPrimary,
        borderColor: token.colorPrimary,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="h-full w-2/5 flex flex-col p-5 gap-2 shadow-lg">
      <div className="text-lg">
        <span className="text-secondary font-bold">Completed issue report</span>
      </div>
      <Divider className="m-0" />
      <Bar
        data={statusData}
        //@ts-ignore
        plugins={[ChartDataLabels]}
        options={{
          scales: {
            y: {
              max: doneIssueList?.length,
            },
          },
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            datalabels: {
              display: true,
              color: 'white',
              font: {
                weight: 'bold',
                size: 15,
              },
            },
          },
        }}
      />
      <Divider className="m-0" />
      <Bar
        data={completedIssueData}
        //@ts-ignore
        plugins={[ChartDataLabels]}
        options={{
          // scales: {
          //   y: {
          //     max: 10,
          //   },
          // },
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            datalabels: {
              display: true,
              color: 'white',
              font: {
                weight: 'bold',
                size: 15,
              },
            },
          },
        }}
      />
    </div>
  );
};
