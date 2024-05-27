import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaCheck, FaTrash } from 'react-icons/fa';
import { Id } from './type.tsx';
import { Breadcrumb, Button, Form, FormProps, Input, Modal, Spin } from 'antd';
import { CircleButton } from '../common/button/CircleButton.tsx';
import { MdEdit } from 'react-icons/md';
import { IssueDetail } from './IssueDetail';
import { useParams } from 'react-router-dom';
import { Issue, UpdateIssueBody } from '../../requests/types/issue.interface.ts';
import { UniqueIdentifier } from '@dnd-kit/core';
import { ExclamationCircleFilled, LoadingOutlined } from '@ant-design/icons';

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
  const [editMode, setEditMode] = useState(true);
  const [isEdit, setIsEdit] = React.useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const [form] = Form.useForm();
  const [issueForm] = Form.useForm();

  const submitForm: FormProps<UpdateIssueBody>['onFinish'] = async (values) => {
    try {
      setLoading(true);
      console.log('submit', values);
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
        <div
          onClick={() => setOpenModal(true)}
          className=" w-full overflow-y-auto overflow-x-hidden hover:cursor-pointer whitespace-pre-wrap"
        >
          {issue.label}
        </div>
        {mouseIsOver && (
          <div className="flex flex-row gap-2 items-center absolute right-4 top-1/2 -translate-y-1/2 ">
            <CircleButton
              onClick={() => setEditMode(true)}
              className=" opacity-60 hover:opacity-100"
              icon={<MdEdit size={20} />}
            />
            <CircleButton
              onClick={() => {
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
              }}
              className=" opacity-60 hover:opacity-100"
              icon={<FaTrash />}
            />
          </div>
        )}
      </div>
      <Modal
        title={
          <Breadcrumb
            items={[
              {
                title: <span>Project {id}</span>,
              },
              {
                title: <span>Issue {issue._id}</span>,
              },
            ]}
          />
        }
        centered
        open={openModal}
        destroyOnClose
        footer={
          isEdit
            ? [
                <Button
                  key="cancel"
                  onClick={() => {
                    setOpenModal(false);
                    setIsEdit(false);
                  }}
                >
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => {
                    issueForm.submit();
                    setIsEdit(false);
                  }}
                >
                  Save
                </Button>,
              ]
            : [
                <Button
                  key="cancel"
                  onClick={() => {
                    setOpenModal(false);
                    setIsEdit(false);
                  }}
                >
                  Cancel
                </Button>,
                <Button type="primary" key="edit" onClick={() => setIsEdit(true)}>
                  Edit
                </Button>,
              ]
        }
        className="min-w-max"
        onCancel={() => {
          setOpenModal(false);
          setIsEdit(false);
        }}
        width="75vw"
      >
        <Form form={issueForm}>
          <IssueDetail form={issueForm} isEdit={isEdit} id={issue._id} />
        </Form>
      </Modal>
    </>
  );
};
