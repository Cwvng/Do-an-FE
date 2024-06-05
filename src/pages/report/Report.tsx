import React from 'react';
import { BurndownChart } from './BurndownChart.tsx';
import { Breadcrumb, Row, Tabs } from 'antd';
import { AppState, useSelector } from '../../redux/store';
import { useNavigate } from 'react-router-dom';

export const Report: React.FC = () => {
  const project = useSelector((app: AppState) => app.user.selectedProject!);
  const navigate = useNavigate();

  return (
    <div className="bg-white gap-3 flex flex-col p-5 h-full">
      <Row>
        <Breadcrumb
          items={[
            {
              title: (
                <span className="cursor-pointer" onClick={() => navigate('/projects')}>
                  Project
                </span>
              ),
            },
            {
              title: <span>{project?.name}</span>,
            },

            {
              title: <span>Report</span>,
            },
          ]}
        />
      </Row>
      <Tabs
        className="m-0"
        items={[
          {
            key: '1',
            label: 'Burndown',
            children: <BurndownChart burndownData={[20, 15, 10, 5, 0]} scopeChange={[0, 0, 0]} />,
          },
          {
            key: '2',
            label: 'Burnup',
          },
          {
            key: '3',
            label: 'Cumulative flow',
          },
        ]}
      />
    </div>
  );
};
