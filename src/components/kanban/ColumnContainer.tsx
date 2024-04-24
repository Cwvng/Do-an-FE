import { SortableContext, useSortable } from '@dnd-kit/sortable';
import React, { useMemo, useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { Column, Id, Issue } from './type.tsx';
import { FaPlus } from 'react-icons/fa';
import { IssueCard } from './IssueCard.tsx';
import { Button, Input } from 'antd';
import { IoClose } from 'react-icons/io5';

interface ColumnContainerProps {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  tasks: Issue[];
}

export const ColumnContainer: React.FC<ColumnContainerProps> = ({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}: ColumnContainerProps) => {
  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-secondary w-[200px]h-full max-h-[500px] rounded-md flex flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-lightBg w-[250px] h-[500px] max-h-[500px] rounded-md flex flex-col text-secondary px-2"
    >
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className=" text-md cursor-grab py-3 font-bold flex items-center justify-between"
      >
        <div className="flex gap-2">
          {!editMode && column.title}
          {editMode && (
            <Input
              className="bg-white focus:border-primary border rounded outline-none px-2"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <IoClose
          className="text-xl hover:cursor-pointer"
          onClick={() => {
            deleteColumn(column.id);
          }}
        />
      </div>

      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-4 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <IssueCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
          ))}
        </SortableContext>
      </div>
      {/* Column footer */}
      <Button
        className="flex items-center gap-5 text-secondary hover:bg-hoverBg p-5 bg-lightBg border-none"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <FaPlus />
        Create issue
      </Button>
    </div>
  );
};
