import { Dropdown, Input, message, Modal, Table, Tag } from 'antd';
import React from 'react';
import { Message, Priority, Status } from '../../../constants';
import { Issue } from '../../../requests/types/issue.interface.ts';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { FaEllipsisV, FaPlus, FaSearch } from 'react-icons/fa';
import { deleteIssueById } from '../../../requests/issue.request.ts';
import { CircleButton } from '../../../components/common/button/CircleButton.tsx';
import { getStatusTagColor, toCapitalize } from '../../../utils/project.util.ts';
import { Link, useNavigate, useParams } from 'react-router-dom';

interface PMProjectListProps {
  issueList: Issue[];
  onActionEnd: any;
}
export const PMProjectList: React.FC<PMProjectListProps> = ({ issueList, onActionEnd }) => {
  const [loading, setLoading] = React.useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const getDueDateColor = (date: string) => {
    const today = new Date();
    const dueDate = new Date(date);
    return today > dueDate ? 'text-red-500' : '';
  };
  const deleteIssue = async (id: string) => {
    try {
      setLoading(true);
      await deleteIssueById(id);
      await onActionEnd();
      message.success(Message.DELETED);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <Input size="large" className="w-1/4" suffix={<FaSearch className="text-primary" />} />
        <CircleButton title="Create new issue" type="primary" icon={<FaPlus />} />
      </div>
      <Table
        className="mt-3"
        dataSource={issueList}
        loading={loading}
        pagination={{ position: ['bottomCenter'] }}
        columns={[
          {
            title: 'Label',
            dataIndex: 'label',
            key: 'Label',
            render: (label, record) => (
              <Link to={`/projects/${id}/issue/${record._id}`}>{label}</Link>
            ),
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
            align: 'center',
            filters: [
              {
                text: 'New',
                value: Status.NEW,
              },
              {
                text: 'In progress',
                value: Status.IN_PROGRESS,
              },
              {
                text: 'Waiting review',
                value: Status.WAITING_REVIEW,
              },
              {
                text: 'Feedback',
                value: Status.FEEDBACK,
              },
              {
                text: 'Testing',
                value: Status.TESTING,
              },
              {
                text: 'Done',
                value: Status.DONE,
              },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0,
            sorter: {
              compare: (a: any, b: any) => a.status.localeCompare(b.status),
              multiple: 1,
            },
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
            align: 'center',
            filters: [
              {
                text: 'Low',
                value: Priority.LOW,
              },
              {
                text: 'Medium',
                value: Priority.MEDIUM,
              },
              {
                text: 'High',
                value: Priority.HIGH,
              },
              {
                text: 'Urgent',
                value: Priority.URGENT,
              },
            ],
            onFilter: (value, record) => record.priority.indexOf(value) === 0,
            sorter: {
              compare: (a: any, b: any) => a.priority.localeCompare(b.priority),
              multiple: 1,
            },
            render: (priority) => {
              const color = getStatusTagColor(priority);
              return (
                <span className={`text-${color}-500`} key={priority}>
                  {toCapitalize(priority)}
                </span>
              );
            },
          },
          {
            title: 'Assignee',
            dataIndex: 'assignee',
            key: 'assignee',
            render: (assignee) => (
              <>
                {assignee?.firstname} {assignee?.lastname}
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
          {
            title: 'Actions',
            key: 'actions',
            dataIndex: 'job_id',
            width: '50px',
            align: 'center',
            render: (_, record) => (
              <Dropdown
                menu={{
                  items: [
                    {
                      label: <span>Detail</span>,
                      key: 'detail',
                      onClick: () => navigate(`/projects/${id}/issue/${record._id}`),
                    },
                    {
                      label: <span className="text-red-500">Delete</span>,
                      key: 'delete',
                      onClick: () => {
                        Modal.confirm({
                          centered: true,
                          title: 'Do you want to delete these items?',
                          icon: <ExclamationCircleFilled />,
                          onOk() {
                            deleteIssue(record._id);
                          },
                          okText: 'Yes',
                          cancelText: 'No',
                          okButtonProps: { className: 'bg-primary' },
                        });
                      },
                    },
                  ],
                }}
                placement="bottomRight"
                arrow
              >
                <FaEllipsisV style={{ cursor: 'pointer' }} />
              </Dropdown>
            ),
          },
        ]}
      />
    </>
  );
};
