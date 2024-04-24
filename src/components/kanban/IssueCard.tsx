import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaTrash } from 'react-icons/fa';
import { Id, Issue } from './type.tsx';
import { Breadcrumb, Input, Modal } from 'antd';
import { CircleButton } from '../common/button/CircleButton.tsx';
import { MdEdit } from 'react-icons/md';
import { IssueDetail } from './IssueDetail';
import { useParams } from 'react-router-dom';

interface TaskCardProps {
  task: Issue;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

export const IssueCard: React.FC<TaskCardProps> = ({
  task,
  deleteTask,
  updateTask,
}: TaskCardProps) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const { id } = useParams();

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
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
        className="flex bg-white p-2.5 h-[100px] min-h-[100px] items-start border-1 border-hoverBg text-left rounded-lg cursor-grab relative task"
      >
        <Input
          className="w-full resize-none border-none rounded bg-transparent text-secondary focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="Issue's title"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.shiftKey) {
              toggleEditMode();
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        />
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
        className="flex bg-white p-2.5 h-[100px] min-h-[100px] items-start border-1 border-hoverBg text-left rounded-lg cursor-grab relative task"
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
          {task.content}
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
                deleteTask(task.id);
              }}
              className=" opacity-60 hover:opacity-100"
              icon={<FaTrash />}
            />
          </div>
        )}
      </div>
      <Modal
        title={
          <Breadcrumb>
            <Breadcrumb.Item>
              <span>Project {id}</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <span>Issue {task.id}</span>
            </Breadcrumb.Item>
          </Breadcrumb>
        }
        centered
        open={openModal}
        onOk={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}
        className="min-w-max"
        width="75vw"
        okText="Save"
        cancelText="Close"
      >
        <IssueDetail issue={task} />
      </Modal>
    </>
  );
};
