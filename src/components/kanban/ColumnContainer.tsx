import { Column, Id } from './type.tsx';
import React, { useMemo, useState } from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Input, Spin } from 'antd';
import { IoClose } from 'react-icons/io5';
import { IssueCard } from './IssueCard.tsx';
import { FaPlus } from 'react-icons/fa';
import { Issue } from '../../requests/types/issue.interface.ts';

interface ColumnContainerProps {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createIssue: (columnId: Id) => void;
  updateIssue: (id: Id, content: string) => void;
  deleteIssue: (id: Id) => void;
  issues: Issue[];
  loading: boolean;
}

export const ColumnContainer: React.FC<ColumnContainerProps> = ({
  column,
  deleteColumn,
  updateColumn,
  createIssue,
  issues,
  deleteIssue,
  updateIssue,
  loading,
}: ColumnContainerProps) => {
  const [editMode, setEditMode] = useState(false);

  const issuesIds = useMemo(() => {
    return issues.map((issue) => issue._id);
  }, [issues]);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    //@ts-ignore
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
        className="bg-white border-dashed	border-1 border-secondary w-[220px] h-full max-h-[500px] rounded-md flex flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-lightBg w-[220px] h-[500px] max-h-[500px] rounded-md flex flex-col text-secondary px-2 shadow-md"
    >
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="text-md cursor-grab py-3 font-bold flex items-center justify-between"
      >
        <div className="flex gap-2">
          {editMode ? (
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
          ) : (
            column.title
          )}
        </div>
        <IoClose
          className="text-xl hover:cursor-pointer"
          onClick={() => {
            deleteColumn(column.id);
          }}
        />
      </div>
      {loading ? (
        <Spin />
      ) : (
        <>
          {/* Column issue container */}
          <div className="flex flex-grow flex-col p-1 gap-4 overflow-x-hidden overflow-y-auto">
            <SortableContext
              //@ts-ignore
              items={issuesIds}
            >
              {issues.map((issue) => (
                <IssueCard
                  key={issue._id}
                  issue={issue}
                  deleteIssue={deleteIssue}
                  updateIssue={updateIssue}
                />
              ))}
            </SortableContext>
          </div>
          {/* Column footer */}
          <Button
            className="flex items-center gap-5 text-secondary hover:bg-primary hover:text-white p-5 bg-lightBg border-none mb-1"
            onClick={() => {
              createIssue(column.id);
            }}
          >
            <FaPlus />
            Create issue
          </Button>
        </>
      )}
    </div>
  );
};
