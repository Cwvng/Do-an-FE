import React, { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { Modal } from 'antd';
import moment from 'moment';
import { getSprintSummary } from '../../../requests/sprint.request.ts';
import { Issue } from '../../../requests/types/issue.interface.ts';
import { AppState, useSelector } from '../../../redux/store';

interface BurnDownProps {
  issueList: Issue[] | undefined;
  labels: string[];
}

export const BurndownChart: React.FC<BurnDownProps> = ({ labels }) => {
  const [openTutorial, setOpenTutorial] = useState(false);
  const [idealData, setIdealData] = useState<number[]>([]);
  const [burndownData, setBurndownData] = useState<number[]>([]);
  const project = useSelector((app: AppState) => app.user.selectedProject);

  useEffect(() => {
    const generateIssueData = async (totalIssues: number) => {
      if (totalIssues) {
        const data = [];
        for (let i = 0; i <= 14; i++) {
          data.push(totalIssues - (totalIssues / 14) * i);
        }
        setIdealData(data);
      }
    };
    const getLatestDailySummaryTotal = async () => {
      try {
        if (project?.activeSprint) {
          const res = await getSprintSummary(project.activeSprint);
          generateIssueData(res[res.length - 1].total);
        }
      } finally {
      }
    };

    getLatestDailySummaryTotal();
  }, [project?.activeSprint]);

  useEffect(() => {
    const getSprintSummaryList = async () => {
      try {
        if (project?.activeSprint) {
          const res = await getSprintSummary(project.activeSprint);
          const newBurndownData = labels.map((label) => {
            const summary = res.filter(
              (summary) => moment(summary.date).format('DD/MM/YYYY') === label,
            )[0];
            return summary ? +summary.total - +summary.done : undefined;
          });
          for (let i = 1; i < newBurndownData.length; i++) {
            if (newBurndownData[i] === undefined) {
              newBurndownData[i] = newBurndownData[i - 1];
            }
          }
          setBurndownData(newBurndownData as number[]);
        }
      } finally {
      }
    };

    getSprintSummaryList();
  }, [labels, project?.activeSprint]);

  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'Burndown',
          fill: false,
          borderColor: '#EE6868',
          backgroundColor: '#EE6868',
          data: burndownData,
        },
        {
          label: 'Ideal',
          borderColor: '#6C8893',
          backgroundColor: '#6C8893',
          borderDash: [5, 5],
          fill: false,
          data: idealData,
        },
      ],
    }),
    [labels, burndownData, idealData],
  );

  return (
    <div className="w-full flex flex-row gap-5">
      <div className="border-1 p-5 border-border w-3/4 h-full text-nowrap rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <div className="flex items-center gap-2">
          <div className="text-secondary text-xl font-bold">Burndown chart</div>
          <span>
            <FaRegQuestionCircle
              className="hover:cursor-pointer"
              onClick={() => setOpenTutorial(true)}
            />
          </span>
        </div>
        <Line
          className="w-full h-full"
          data={chartData}
          options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
      <Modal
        title={<span className="text-xl font-bold text-secondary">What is Burndown Chart?</span>}
        centered
        open={openTutorial}
        onOk={() => setOpenTutorial(false)}
        onCancel={() => setOpenTutorial(false)}
      >
        <div>
          A burndown chart shows the amount of work that has been completed in an epic or sprint,
          and the total work remaining. <br />
          Burndown charts are used to predict your team's likelihood of completing their work in the
          time available. They're also great for keeping the team aware of any scope creep that
          occurs. Burndown charts are useful because they provide insight into how the team works.
          For example:
          <ul>
            <li>
              If you notice that the team consistently finishes work early, this might be a sign
              that they aren't committing to enough work during sprint planning
            </li>
            <li>
              If they consistently miss their forecast, this might be a sign that they've committed
              to too much work
            </li>
            <li>
              If the burndown chart shows a sharp drop during the sprint, this might be a sign that
              work has not been estimated accurately, or broken down properly.
            </li>
          </ul>
        </div>
      </Modal>
    </div>
  );
};
