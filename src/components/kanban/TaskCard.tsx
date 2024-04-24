import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaTrash } from 'react-icons/fa';
import { Id, Issue } from './type.tsx';
import { Input } from 'antd';

interface TaskCardProps {
  task: Issue;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  deleteTask,
  updateTask,
}: TaskCardProps) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(true);

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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      // onClick={toggleEditMode}
      className="flex bg-white p-2.5 h-[100px] min-h-[100px] items-center border-1 border-hoverBg text-left rounded-lg cursor-grab relative task"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <p
        className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap"
        onDoubleClick={() => setEditMode(true)}
      >
        {task.content}
      </p>
      {mouseIsOver && (
        <button
          onClick={() => {
            deleteTask(task.id);
          }}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"
        >
          <FaTrash />
        </button>
      )}
    </div>
  );
};
