import 'chart.js/auto';
import React, { useEffect } from 'react';
import { Breadcrumb, Row, Tabs } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { GeneralInformation } from './GeneralInformation.tsx';
import { Project } from '../../../requests/types/project.interface.ts';
import { getProjectById } from '../../../requests/project.request.ts';
import { MemberList } from './MemberList.tsx';

export const ProjectDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [project, setProject] = React.useState<Project>();

  const getProjectDetail = async () => {
    try {
      if (id) {
        const res = await getProjectById(id);
        setProject(res);
      }
    } finally {
    }
  };

  useEffect(() => {
    getProjectDetail();
  }, []);

  return (
    <div className="bg-white gap-3 flex flex-col p-5 h-full">
      <Row>
        <Breadcrumb
          items={[
            {
              title: (
                <span className="cursor-pointer" onClick={() => navigate('/project-list')}>
                  Project
                </span>
              ),
            },
            {
              title: <span className="font-bold text-primary">{project?.name}</span>,
            },
          ]}
        />
      </Row>
      <div className="text-secondary text-2xl m-0 p-0 font-bold">Project detail</div>
      <Tabs
        className="m-0 flex-1 overflow-overlay overflow-scroll"
        items={[
          {
            key: 'General Information',
            label: 'General',
            children: <GeneralInformation />,
          },
          {
            key: 'Members',
            label: 'Members',
            children: <MemberList />,
          },
        ]}
      />
    </div>
  );
};
