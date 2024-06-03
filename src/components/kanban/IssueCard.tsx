import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaCheck, FaEllipsisV } from 'react-icons/fa';
import { Id } from './type.tsx';
import { Avatar, Dropdown, Form, FormProps, Input, Modal, Spin, Tag, Tooltip } from 'antd';
import { CircleButton } from '../common/button/CircleButton.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { Issue, UpdateIssueBody } from '../../requests/types/issue.interface.ts';
import { UniqueIdentifier } from '@dnd-kit/core';
import { ExclamationCircleFilled, LoadingOutlined } from '@ant-design/icons';
import { getStatusTagColor, toCapitalize } from '../../utils/project.util.ts';
import { RiEditFill } from 'react-icons/ri';

interface IssueCardProps {
  issue: Issue;
  deleteIssue: (id: Id) => void;
  updateIssue: (id: Id, values: string) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  deleteIssue,
  updateIssue,
}: IssueCardProps) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const submitForm: FormProps<UpdateIssueBody>['onFinish'] = async (values) => {
    try {
      setLoading(true);
      if (values.label) updateIssue(issue._id, values.label.trim());
    } finally {
      setLoading(false);
      toggleEditMode();
    }
  };
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: issue._id as UniqueIdentifier,
    data: {
      type: 'Issue',
      issue,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        opacity-30 bg-hoverBg p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-lg cursor-grab relative
      "
      />
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="flex bg-white p-2.5 h-[100px] min-h-[100px] items-start border-1 border-hoverBg text-left rounded-lg cursor-grab relative issue"
      >
        <Form form={form} onFinish={submitForm}>
          <Form.Item name="label" initialValue={issue.label}>
            <Input
              className="w-full resize-none border-none rounded bg-transparent text-secondary focus:outline-none"
              autoFocus
              placeholder="Issue's label"
              onBlur={form.submit}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.shiftKey) {
                  toggleEditMode();
                }
              }}
            />
          </Form.Item>

          <div className="flex flex-row gap-2 items-center absolute right-4 top-2/3 -translate-y-1/2 ">
            <CircleButton
              className=" opacity-60 hover:opacity-100"
              onClick={form.submit}
              htmlType="submit"
              icon={<FaCheck size={20} />}
            />
            {loading && <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />}
          </div>
        </Form>
      </div>
    );
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        // onClick={toggleEditMode}
        className="flex bg-white p-2.5 h-[100px] min-h-[100px] items-start border-1 border-hoverBg text-left rounded-lg cursor-grab relative issue"
        onMouseEnter={() => {
          setMouseIsOver(true);
        }}
        onMouseLeave={() => {
          setMouseIsOver(false);
        }}
      >
        <div className="flex w-full flex-col gap-2">
          <div className=" w-full flex items-center gap-1 overflow-y-auto overflow-x-hidden hover:cursor-pointer whitespace-pre-wrap">
            <span onClick={() => navigate(`/projects/${id}/issue/${issue._id}`)}>
              {issue.label}
            </span>
            <RiEditFill
              className="text-primary opacity-0 hover:opacity-100"
              onClick={() => setEditMode(true)}
            />
            {mouseIsOver && (
              <div className="flex flex-row gap-2 items-center absolute right-4 top-1-translate-y-1 ">
                <Dropdown
                  menu={{
                    items: [
                      {
                        label: <span>Detail</span>,
                        key: 'detail',
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
                              deleteIssue(issue._id);
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
              </div>
            )}
          </div>
          <div className="mt-2 flex flex-row items-center justify-between">
            <div>
              <Tag color={getStatusTagColor(issue.priority!)} key={issue.priority}>
                {toCapitalize(issue.priority!)}
              </Tag>
              {issue.remainingDays && +issue.remainingDays < 7 && (
                <Tag
                  color={
                    (+issue.remainingDays > 0 && +issue.remainingDays < 5) ||
                    +issue.remainingDays <= 0
                      ? 'red'
                      : 'lime'
                  }
                  key={issue._id}
                >
                  {+issue.remainingDays === 0 && 'Today'}
                  {+issue.remainingDays > 0 && issue.remainingDays + ' days'}
                  {+issue.remainingDays < 0 && 'Overdue'}
                </Tag>
              )}
            </div>
            <Tooltip key={issue._id} placement="right" color="fff" title={issue.assignee?.email}>
              <Avatar src={issue.assignee?.profilePic} />
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  );
};
