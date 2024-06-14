import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { FaRegQuestionCircle } from 'react-icons/fa';
import moment from 'moment/moment';
import { getSprintSummary } from '../../../requests/sprint.request.ts';
import { Issue } from '../../../requests/types/issue.interface.ts';
import { Modal } from 'antd';
import { AppState, useSelector } from '../../../redux/store';

interface CumulativeFlowProps {
  issueList: Issue[] | undefined;
  labels: string[];
}

export const CumulativeFlow: React.FC<CumulativeFlowProps> = ({ labels }) => {
  const [newData, setNewData] = useState<number[]>([]);
  const [inProgressData, setInProgressData] = useState<number[]>([]);
  const [doneData, setDoneData] = useState<number[]>([]);
  const [openTutorial, setOpenTutorial] = React.useState(false);

  const sprintId = useSelector((app: AppState) => app.user.selectedProject?.activeSprint);

  useEffect(() => {
    const getSprintSummaryList = async () => {
      try {
        if (sprintId) {
          const res = await getSprintSummary(sprintId);

          const newData = labels.map((label) => {
            const summary = res.find(
              (summary) => moment(summary.date).format('DD/MM/YYYY') === label,
            );
            return summary ? +summary.new : undefined;
          });

          const inProgressData = labels.map((label) => {
            const summary = res.find(
              (summary) => moment(summary.date).format('DD/MM/YYYY') === label,
            );
            return summary ? +summary.in_progress : undefined;
          });

          const doneData = labels.map((label) => {
            const summary = res.find(
              (summary) => moment(summary.date).format('DD/MM/YYYY') === label,
            );
            return summary ? +summary.done : undefined;
          });

          // Fill undefined values with the last valid value
          const fillUndefined = (data: number[]) => {
            for (let i = 1; i < data.length; i++) {
              if (data[i] === undefined) {
                data[i] = data[i - 1];
              }
            }
          };

          fillUndefined(newData as number[]);
          fillUndefined(inProgressData as number[]);
          fillUndefined(doneData as number[]);

          setNewData(newData as number[]);
          setInProgressData(inProgressData as number[]);
          setDoneData(doneData as number[]);
        }
      } catch (error) {
        console.error('Error fetching sprint summary:', error);
      }
    };

    getSprintSummaryList();
  }, [labels, sprintId]);

  return (
    <div className="w-full flex flex-row gap-5">
      <div className="border-1 p-5 border-border w-3/4 text-nowrap rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <div className="flex items-center gap-2">
          <div className="text-secondary text-xl font-bold">Cumulative Flow Chart</div>
          <span>
            <FaRegQuestionCircle
              onClick={() => setOpenTutorial(true)}
              className="hover:cursor-pointer"
            />
          </span>
        </div>
        <Line
          options={{
            elements: {
              line: {
                tension: 0.23,
              },
            },
            responsive: true,
            scales: {
              x: {
                beginAtZero: true,
              },
              y: {
                beginAtZero: true,
              },
            },
          }}
          data={{
            labels,
            datasets: [
              {
                label: 'Done',
                data: doneData,
                borderColor: 'rgba(145,170,201,255)',
                backgroundColor: 'rgba(145,170,201,0.5)',
                fill: 'origin',
              },
              {
                label: 'In Progress',
                data: inProgressData,
                borderColor: 'rgba(205,150,149,255)',
                backgroundColor: 'rgba(205,150,149,0.5)',
                fill: 'origin',
              },
              {
                label: 'New',
                data: newData,
                borderColor: 'rgba(186,209,160,255)',
                backgroundColor: 'rgba(186,209,160,0.5)',
                fill: 'origin',
              },
            ],
          }}
        />
      </div>
      <Modal
        title={<span className="text-xl font-bold text-secondary">What is Cumulative Flow?</span>}
        centered
        open={openTutorial}
        onOk={() => setOpenTutorial(false)}
        onCancel={() => setOpenTutorial(false)}
      >
        <div>
          A Cumulative Flow Diagram (CFD) is an area chart that shows the various statuses of work
          items for an application, version, or sprint.
          <br />
          The horizontal x-axis in a CFD indicates time, and the vertical y-axis indicates cards
          (issues).
          <br />
          Each colored area of the chart equates to a workflow status (i.e. a column on your board).
          <br />
          The CFD can be useful for identifying bottlenecks. If your chart contains an area that is
          widening vertically over time, the column that equates to the widening area will generally
          be a bottleneck.
        </div>
      </Modal>
    </div>
  );
};
