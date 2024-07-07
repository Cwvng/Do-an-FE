import { Doughnut } from 'react-chartjs-2';
import React from 'react';
import { Divider, theme } from 'antd';
import { Issue } from '../../../../requests/types/issue.interface.ts';
import { Status } from '../../../../constants';
import { ProjectSprint } from '../../../../requests/types/sprint.interface.ts';
import moment from 'moment';
import ChartDataLabels from 'chartjs-plugin-datalabels';

interface StatusChartProps {
  issueList: Issue[];
  sprint: ProjectSprint;
}

export const StatusChart: React.FC<StatusChartProps> = ({ issueList }) => {
  const { token } = theme.useToken();
  const statusLabels = ['New', 'In progress', 'Waiting review', 'Feedback', 'Done'];
  const completionLabels = ['Not Done', 'Done In Time', 'Done Late'];

  const calculateStatusStatistics = (issues: Issue[]) => {
    const statusCount = {
      new: 0,
      in_progress: 0,
      waiting_review: 0,
      feedback: 0,
      done: 0,
    };

    issues?.forEach((issue) => {
      switch (issue.status) {
        case Status.DONE:
          statusCount.done++;
          break;
        case Status.IN_PROGRESS:
          statusCount.in_progress++;
          break;
        case Status.WAITING_REVIEW:
          statusCount.waiting_review++;
          break;
        case Status.FEEDBACK:
          statusCount.feedback++;
          break;
        case Status.NEW:
          statusCount.new++;
          break;
      }
    });

    return Object.values(statusCount);
  };

  const calculateCompletionStatistics = (issues: Issue[]) => {
    const statusCount = {
      not_done: 0,
      done_on_time: 0,
      done_late: 0,
    };

    issues?.forEach((issue) => {
      if (issue.status !== Status.DONE) {
        statusCount.not_done++;
      } else {
        const doneHistory = issue.history.find(
          (history) => history.field === 'status' && history.newValue === 'done',
        );

        if (doneHistory) {
          const doneDate = moment(doneHistory.updatedAt);
          const dueDate = moment(issue.dueDate);

          if (doneDate <= dueDate) {
            statusCount.done_on_time++;
          } else {
            statusCount.done_late++;
          }
        }
      }
    });

    return Object.values(statusCount);
  };

  const statusData = {
    labels: statusLabels,
    datasets: [
      {
        label: 'Number of Issues by Status',
        data: calculateStatusStatistics(issueList),
        backgroundColor: [
          token.colorPrimary,
          token.red4,
          token.yellow4,
          token.green4,
          token.blue4,
          token.purple4,
        ],
        borderColor: [
          token.colorPrimary,
          token.red4,
          token.yellow4,
          token.green4,
          token.blue4,
          token.purple4,
        ],
        borderWidth: 1,
      },
    ],
  };

  const completionData = {
    labels: completionLabels,
    datasets: [
      {
        label: 'Issue Completion Status',
        data: calculateCompletionStatistics(issueList),
        backgroundColor: [token.red4, token.green4, token.orange4],
        borderColor: [token.red4, token.green4, token.orange4],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex-1 flex flex-row gap-5">
      <div className="border-1 p-5 border-border w-full h-90 text-nowrap rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <div title="Number of issue status" className="text-secondary text-xl font-bold">
            Issue Status
          </div>
        </div>{' '}
        <Divider className="m-2" />
        <div className="flex h-full">
          <div className="w-1/2">
            <Doughnut
              data={statusData}
              //@ts-ignore
              plugins={[ChartDataLabels]}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'right',
                  },
                  datalabels: {
                    display: true,
                    color: 'white',
                    font: {
                      weight: 'bold',
                      size: 15,
                    },
                    formatter: (value) => {
                      const percent = Math.floor((value / issueList.length) * 100);
                      return percent + ' %';
                    },
                  },
                },
              }}
            />
          </div>
          <div className="w-1/2">
            <Doughnut
              data={completionData}
              //@ts-ignore
              plugins={[ChartDataLabels]}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'right',
                  },
                  datalabels: {
                    display: true,
                    color: 'white',
                    font: {
                      weight: 'bold',
                      size: 15,
                    },
                    formatter: (value) => {
                      const percent = Math.floor((value / issueList.length) * 100);
                      return percent + ' %';
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
