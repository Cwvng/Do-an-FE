import { Doughnut } from 'react-chartjs-2';
import React from 'react';
import { theme } from 'antd';

export const StatusChart: React.FC = () => {
  const { token } = theme.useToken();
  const data = {
    labels: ['Closed', 'Waiting review', 'Feedback', 'New'],
    datasets: [
      {
        label: '# of Votes',
        data: [40, 30, 20, 10],
        backgroundColor: [token.colorPrimary, token.red4, token.yellow4, token.green4],
        borderColor: [token.colorPrimary, token.red4, token.yellow4, token.green4],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
  };
  return (
    // @ts-ignore
    <Doughnut data={data} options={options} />
  );
};
