import React from 'react';
import { Avatar, Button, Col, Row, Select, Tabs, TabsProps } from 'antd';
import { FaFileUpload, FaLink } from 'react-icons/fa';
import { FaShareNodes } from 'react-icons/fa6';
import TextArea from 'antd/es/input/TextArea';
import { ActivityCard } from './ActivityCard.tsx';
import { Issue } from '../type.tsx';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'All',
    children: (
      <>
        <ActivityCard />
      </>
    ),
  },
  {
    key: '2',
    label: 'Comment',
    children: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    label: 'History',
    children: 'Content of Tab Pane 3',
  },
];
interface IssueDetailProps {
  issue: Issue;
}
export const IssueDetail: React.FC<IssueDetailProps> = ({ issue }) => {
  return (
    <div className="h-full flex flex-row gap-20">
      <div className="basis-2/3">
        <h2 className="text-secondary">{issue.content}</h2>
        <div className="flex gap-1">
          <Button icon={<FaFileUpload />} type="primary">
            Attach
          </Button>
          <Button icon={<FaShareNodes />} type="primary">
            Add a child issue
          </Button>
          <Button icon={<FaLink />} type="primary">
            Link issue
          </Button>
        </div>
        <h4 className="my-3 text-secondary">Description</h4>
        <TextArea autoSize placeholder="Add a description" />
        <h4 className="m-0 mt-3 text-secondary">Activity</h4>
        <Tabs className="my-0" items={items} />
      </div>

      <div className="basis-1/3 h-full">
        <Select
          size="large"
          defaultValue={issue.columnId}
          className="w-30 min-w-max text-white"
          options={[
            { value: 'in progress', label: 'In progress' },
            { value: 'waiting review', label: 'Waiting review' },
            { value: 'new', label: 'New' },
            { value: 'closed', label: 'Closed' },
          ]}
        />
        <div className=" mt-3  border-1 border-border h-full w-full text-nowrap">
          <div className="border-b-1 border-border px-5 py-3 font-bold text-secondary">Detail</div>
          <div className="flex flex-col p-5 gap-3">
            <Row>
              <Col span={20} className="text-secondary">
                Assignee
              </Col>
              <Col span={4}>
                <Avatar src="https://i.pinimg.com/736x/b0/cd/e6/b0cde658985bd1a87b525592bf71da18.jpg" />
              </Col>
            </Row>
            <Row>
              <Col span={20} className="text-secondary">
                Label
              </Col>
              <Col span={4}>None</Col>
            </Row>
            <Row>
              <Col span={20} className="text-secondary">
                Reporter
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};
