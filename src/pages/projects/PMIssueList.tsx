import { Table, Tag, theme } from 'antd';
import React, { useEffect } from 'react';
import { Priority, Status } from '../../constants';
import { useParams } from 'react-router-dom';
import { getIssueList } from '../../requests/issue.request.ts';
import { Issue } from '../../requests/types/issue.interface.ts';
import { Loading } from '../../components/loading/Loading.tsx';

export const PMProjectList: React.FC = () => {
  const { token } = theme.useToken();
  const { id } = useParams();

  const [issueList, setIssueList] = React.useState<Issue[]>();
  const [loading, setLoading] = React.useState(false);
  const getIssueListByProjectId = async () => {
    try {
      if (id) {
        setLoading(true);
        const res = await getIssueList({ projectId: id });
        setIssueList(res);
        console.log(issueList);
      }
    } finally {
      setLoading(false);
    }
  };

  const getDueDateColor = (date: string) => {
    const today = new Date();
    const dueDate = new Date(date);
    return today > dueDate ? 'text-red-500' : '';
  };
  const getStatusTagColor = (status: string): string => {
    switch (status) {
      case Status.DONE:
        return token.colorInfoTextHover;
      case Status.IN_PROGRESS:
        return token.colorPrimary;
      case Status.WAITING_REVIEW:
        return token.orange4;
      case Status.FEEDBACK:
        return token.red4;
      case Status.NEW:
        return token.green4;
      case Priority.LOW:
        return token.yellow4;
      case Priority.MEDIUM:
        return token.red4;
      case Priority.HIGH:
        return token.green4;
      case Priority.URGENT:
        return token.green4;
      default:
        return token.colorWarning;
    }
  };
  useEffect(() => {
    getIssueListByProjectId();
  }, []);

  if (loading) return <Loading />;

  return (
    <Table
      className="mt-3"
      dataSource={issueList}
      pagination={{ position: ['bottomCenter'] }}
      columns={[
        {
          title: 'Label',
          dataIndex: 'label',
          key: 'Label',
        },
        {
          title: 'Subject',
          dataIndex: 'subject',
          key: 'subject',
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          render: (status) => {
            const color = getStatusTagColor(status);
            return (
              <Tag color={color} key={status}>
                {status?.toUpperCase()}
              </Tag>
            );
          },
        },
        {
          title: 'Priority',
          dataIndex: 'priority',
          key: 'priority',
          render: (priority) => {
            const color = getStatusTagColor(priority);
            return (
              <Tag color={color} key={priority}>
                {priority?.toUpperCase()}
              </Tag>
            );
          },
        },
        {
          title: 'Assignee',
          dataIndex: 'assignee',
          key: 'assignee',
          render: (assignee) => (
            <>
              {assignee.firstname} {assignee.lastname}
            </>
          ),
        },
        {
          title: 'Due date',
          dataIndex: 'dueDate',
          key: 'dueDate',
          render: (date) => (
            <span className={getDueDateColor(date)} key={date}>
              {new Date(date).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: 'numeric',
              })}
            </span>
          ),
        },
      ]}
    />
  );
};
