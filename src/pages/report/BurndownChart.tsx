import React from 'react';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { Modal } from 'antd';
import { AppState, useSelector } from '../../redux/store';

interface BurnDownProps {
  burndownData: number[];
  scopeChange: number[];
}

export const BurndownChart: React.FC<BurnDownProps> = ({ burndownData, scopeChange }) => {
  const totalHoursInSprint = burndownData[0];
  const idealHoursPerDay = totalHoursInSprint / 9;

  const [openTutorial, setOpenTutorial] = React.useState(false);

  const project = useSelector((app: AppState) => app.user.selectedProject!);

  const sumArrayUpTo = (arrData: number[], index: number) => {
    let total = 0;
    for (let i = 0; i <= index; i++) {
      if (arrData.length > i) {
        total += arrData[i];
      }
    }
    return total;
  };

  const generateLabels = () => {
    const labels = [];
    const start = moment(project?.activeSprint.startDate);
    const end = moment(project?.activeSprint.endDate);
    const diffDays = end.diff(start, 'days');
    for (let i = 0; i <= diffDays; i++) {
      const date = moment(start).add(i, 'days');
      console.log(date);
      labels.push(date.format('MM/DD/YYYY'));
    }
    return labels;
  };

  return (
    <div className="w-full flex flex-row gap-5">
      <div className="w-3/4">
        <Line
          className="w-full h-full"
          data={{
            labels: generateLabels(),
            datasets: [
              {
                label: 'Burndown',
                data: burndownData,
                fill: false,
                borderColor: '#EE6868',
                backgroundColor: '#EE6868',
              },
              {
                label: 'Ideal',
                borderColor: '#6C8893',
                backgroundColor: '#6C8893',
                borderDash: [5, 5],
                fill: false,
                data: burndownData.map((_, index) => {
                  return Math.round(
                    totalHoursInSprint -
                      idealHoursPerDay * (index + 1) +
                      sumArrayUpTo(scopeChange, index),
                  );
                }),
              },
            ],
          }}
        />
      </div>
      <div className="border-1 p-5 border-border w-1/4 text-nowrap rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <div className="flex items-center  gap-2">
          <div className="text-secondary text-xl font-bold">Burndown chart</div>
          <span>
            <FaRegQuestionCircle
              className="hover:cursor-pointer"
              onClick={() => setOpenTutorial(true)}
            />
          </span>
        </div>
      </div>
      <Modal
        title={<span className="text-xl font-bold text-secondary">What is Burndown Chart?</span>}
        centered
        open={openTutorial}
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
