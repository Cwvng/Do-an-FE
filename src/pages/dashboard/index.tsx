import React from 'react';
import { Divider, Tabs, TabsProps } from 'antd';
import { ProjectCard } from './ProjectCard';
import { StatusChart } from './StatusChart';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'In progress',
    children: 'Content of Tab Pane 1',
  },
  {
    key: '2',
    label: 'Viewed',
    children: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    label: 'Assigned to me',
    children: 'Content of Tab Pane 3',
  },
  {
    key: '4',
    label: 'Starred',
    children: 'Content of Tab Pane 3',
  },
];

export const Dashboard: React.FC = () => {
  const onChange = (key: string) => {
    console.log(key);
  };
  return (
    <div className="h-full flex flex-col bg-white p-5">
      <div className="flex flex-1 flex-row justify-between">
        <div className="basis-2/3">
          <span className="text-secondary font-bold text-xl">Your project (2)</span>
          <Divider className="mt-3" />
          <div className="flex overflow-x-auto gap-5">
            <ProjectCard projectId="1" />
            <ProjectCard projectId="2" />
          </div>
        </div>
        <div className="mr-10">
          <span className="text-secondary font-bold text-xl">Issues status</span>
          <Divider className="mt-3" />
          <StatusChart />
        </div>
      </div>
      <div className="flex-1">
        <div className="basis-2/3">
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
      </div>
    </div>
  );
};
