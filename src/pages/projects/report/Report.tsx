import React, { useEffect } from 'react';
import { BurndownChart } from './component/BurndownChart.tsx';
import { Breadcrumb, Row, Spin, Tabs } from 'antd';
import { AppState, useSelector } from '../../../redux/store';
import { useNavigate } from 'react-router-dom';
import { CumulativeFlow } from './component/CumulativeFlow.tsx';
import moment from 'moment/moment';
import { ProjectSprint } from '../../../requests/types/sprint.interface.ts';
import { getSprintDetail } from '../../../requests/sprint.request.ts';
import { StatusChart } from './component/StatusChart.tsx';

export const Report: React.FC = () => {
  const project = useSelector((app: AppState) => app.user.selectedProject!);
  const navigate = useNavigate();

  const [sprint, setSprint] = React.useState<ProjectSprint>();
  const [loading, setLoading] = React.useState(false);

  const getSprintInfor = async () => {
    try {
      setLoading(true);

      if (project?.activeSprint) {
        const res = await getSprintDetail(project.activeSprint);
        setSprint(res);
      }
    } finally {
      setLoading(false);
    }
  };
  const generateLabels = () => {
    const labels = [];
    const start = moment(sprint?.startDate);
    const end = moment(sprint?.endDate);
    const duration = end.diff(start, 'days');
    for (let i = 0; i <= duration; i++) {
      const date = moment(start).add(i, 'days');
      labels.push(date.format('DD/MM/YYYY'));
    }
    return labels;
  };

  useEffect(() => {
    getSprintInfor();
  }, []);

  useEffect(() => {
    getSprintInfor();
  }, [project]);

  return (
    <div className="bg-white gap-3 flex flex-col p-5 flex-1 overflow-hidden">
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
              title: <span className="font-bold text-primary">Report</span>,
            },
          ]}
        />
      </Row>

      <div className="text-secondary text-2xl m-0 p-0 font-bold">
        Sprint {sprint?.ordinary} Report
      </div>
      {loading ? (
        <Spin />
      ) : (
        <Tabs
          className="m-0 flex-1 overflow-overlay overflow-scroll"
          items={[
            {
              key: 'Burndown',
              label: 'Burndown',
              children: <BurndownChart labels={generateLabels()} issueList={sprint?.issues} />,
            },
            {
              key: 'Cumulative',
              label: 'Cumulative flow',
              children: <CumulativeFlow labels={generateLabels()} issueList={sprint?.issues} />,
            },
            {
              key: 'Status',
              label: 'Status',
              children: <StatusChart issueList={sprint?.issues!} sprint={sprint!} />,
            },
          ]}
        />
      )}
    </div>
  );
};
