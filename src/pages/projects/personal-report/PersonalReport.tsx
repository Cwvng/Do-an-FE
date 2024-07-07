import { Breadcrumb, Row } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState, useSelector } from '../../../redux/store';
import { UserCard } from '../../../components/commons/UserCard.tsx';

export const PersonalReport: React.FC = () => {
  const navigate = useNavigate();
  const project = useSelector((app: AppState) => app.user.selectedProject);

  const user = useSelector((app: AppState) => app.user.userInfo);

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
              title: <span className="font-bold text-primary">Personal Report</span>,
            },
          ]}
        />
      </Row>
      <Row className="flex flex-1 items-center justify-between">
        <div className="text-secondary text-2xl m-0 font-bold">Personal Report</div>
      </Row>
      <div className="h-full flex">
        <UserCard user={user!} />

        <div></div>
      </div>
    </div>
  );
};
