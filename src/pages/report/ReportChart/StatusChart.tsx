import { Doughnut } from 'react-chartjs-2';
import React from 'react';
import { Avatar, theme } from 'antd';
import { Issue } from '../../../requests/types/issue.interface.ts';
import { Status } from '../../../constants';
import { ProjectSprint } from '../../../requests/types/sprint.interface.ts';
import { Comment } from '@ant-design/compatible';

interface StatusChartProps {
  issueList: Issue[];
  sprint: ProjectSprint;
}

export const StatusChart: React.FC<StatusChartProps> = ({ issueList, sprint }) => {
  const { token } = theme.useToken();
  const labels = ['New', 'In progress', 'Waiting review', 'Feedback', 'Testing', 'Done'];

  const calculateIssueStatistics = (issues: Issue[]) => {
    const statusCount = {
      new: 0,
      in_progress: 0,
      waiting_review: 0,
      feedback: 0,
      done: 0,
      others: 0,
    };
    issues.forEach((issue) => {
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
        default:
          statusCount.others++;
          break;
      }
    });
    return Object.values(statusCount);
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Percentage of Issues',
        data: calculateIssueStatistics(issueList),
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

  return (
    <div className="w-full flex flex-row gap-5">
      <div className="border-1 p-5 border-border w-1/3 h-full text-nowrap rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <div title="Percentage of issue status" className="text-secondary text-xl font-bold">
            Issue Status
          </div>
        </div>
        <Doughnut
          className="w-full"
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: true,
                position: 'right',
              },
            },
          }}
        />
      </div>
      <div className="border-1 flex flex-col p-5 border-border w-2/3 h-full text-nowrap rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <div title="Percentage of issue status" className="text-secondary text-xl font-bold">
            Members working quality
          </div>
        </div>
        <div className="overflow-auto">
          {sprint.members.map((item, index) => (
            <Comment
              key={index}
              author={<a>{item.firstname + item.lastname}</a>}
              avatar={<Avatar size="large" src={item.profilePic} />}
              content={<p>Statics go here</p>}
            />
          ))}
        </div>
        <div></div>
      </div>
    </div>
  );
};
