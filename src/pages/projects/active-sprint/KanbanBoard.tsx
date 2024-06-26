import React, { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { Column, Id } from './type.tsx';
import { FaPlus } from 'react-icons/fa';
import { ColumnContainer } from './ColumnContainer.tsx';
import { IssueCard } from './IssueCard.tsx';
import { Button, message } from 'antd';
import { Issue, UpdateIssueBody } from '../../../requests/types/issue.interface.ts';
import { Status } from '../../../constants';
import {
  createNewIssue,
  deleteIssueById,
  getIssueList,
  updateIssueById,
} from '../../../requests/issue.request.ts';
import { useSearchParams } from 'react-router-dom';
import { AppState, useSelector } from '../../../redux/store';

export const KanbanBoard: React.FC = () => {
  const defaultCols: Column[] = [
    {
      id: Status.NEW,
      title: 'New',
    },
    {
      id: Status.IN_PROGRESS,
      title: 'In progress',
    },
    {
      id: Status.WAITING_REVIEW,
      title: 'Waiting review',
    },
    {
      id: Status.FEEDBACK,
      title: 'Feedback',
    },
    {
      id: Status.DONE,
      title: 'Done',
    },
  ];

  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = React.useState<Issue[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);

  const [searchParams] = useSearchParams();
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );
  const sprintId = useSelector((app: AppState) => app.user.selectedProject?.activeSprint);

  const updateIssueDetail = async (issueId: string, body: UpdateIssueBody) => {
    try {
      await updateIssueById(issueId, body);
    } finally {
    }
  };

  // CRUD issue
  const getSprintIssueList = async () => {
    try {
      if (sprintId) {
        setLoading(true);
        const label = searchParams.get('label') || '';
        const assignee = searchParams.getAll('assignee').join(',') || '';
        const priority = searchParams.getAll('priority').join(',') || '';
        const res = await getIssueList({
          label,
          assignee,
          priority,
          sprintId: sprintId,
        });
        setIssues(res);
      }
    } finally {
      setLoading(false);
    }
  };

  const createIssue = async (columnId: Id) => {
    try {
      if (sprintId) {
        const body = {
          status: columnId,
          label: `Issue ${issues.length + 1}`,
          sprint: sprintId,
        };
        const res = await createNewIssue(body);

        setIssues([...issues, res]);
        message.success('Created an issue');
      }
    } finally {
    }
  };

  const deleteIssue = async (id: Id) => {
    try {
      if (id) {
        await deleteIssueById(id);
        const newIssues = issues.filter((issue) => issue._id !== id);
        setIssues(newIssues);
        message.success('Deleted an issue');
      }
    } finally {
    }
  };

  const updateIssue = async (id: Id, content: string) => {
    try {
      if (id) {
        await updateIssueDetail(id, { label: content });
        const newIssues = issues.map((issue) => {
          if (issue._id !== id) return issue;
          return { ...issue, label: content };
        });

        setIssues(newIssues);
      }
    } finally {
    }
  };

  // CRUD Column
  const createNewColumn = () => {
    const columnToAdd: Column = {
      id: generateId().toString(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  };

  const deleteColumn = (id: Id) => {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newIssues = issues.filter((t) => t.status !== id);
    setIssues(newIssues);
  };

  const updateColumn = (id: Id, title: string) => {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  };

  // Drag handle
  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === 'Issue') {
      setActiveIssue(event.active.data.current.issue);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveIssue(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) {
      const issue = issues.filter((issue) => issue._id === activeId)[0];
      updateIssueDetail(activeId.toString(), { status: issue.status });
      return;
    }

    const isActiveAColumn = active.data.current?.type === 'Column';
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAIssue = active.data.current?.type === 'Issue';
    const isOverAIssue = over.data.current?.type === 'Issue';

    if (!isActiveAIssue) return;

    if (isActiveAIssue && isOverAIssue) {
      setIssues((issues) => {
        const activeIndex = issues.findIndex((t) => t._id === activeId);
        const overIndex = issues.findIndex((t) => t._id === overId);

        if (issues[activeIndex].status !== issues[overIndex].status) {
          issues[activeIndex].status = issues[overIndex].status;
          return arrayMove(issues, activeIndex, overIndex - 1);
        }

        return arrayMove(issues, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === 'Column';

    // Dropping an Issue over a column
    if (isActiveAIssue && isOverAColumn) {
      setIssues((issues) => {
        const activeIndex = issues.findIndex((t) => t._id === activeId);

        if (typeof overId === 'string') {
          issues[activeIndex].status = overId;
        }

        return arrayMove(issues, activeIndex, activeIndex);
      });
    }
  };

  const generateId = () => {
    return Math.floor(Math.random() * 10001);
  };

  useEffect(() => {
    getSprintIssueList();
  }, [searchParams]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-1 w-full overflow-x-auto overflow-y-hidden mt-3">
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <div className="flex gap-4 pb-2">
            <div className="flex gap-6">
              <SortableContext
                //@ts-ignore
                items={columnsId}
              >
                {columns.map((col) => (
                  <ColumnContainer
                    key={col.id}
                    column={col}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    createIssue={createIssue}
                    deleteIssue={deleteIssue}
                    updateIssue={updateIssue}
                    issues={issues.filter((issue) => issue.status === col.id)}
                    loading={loading}
                  />
                ))}
              </SortableContext>
            </div>
            <Button
              type="primary"
              onClick={() => {
                createNewColumn();
              }}
              className="bg-lightBg"
              icon={<FaPlus className="text-secondary" />}
            ></Button>
          </div>

          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnContainer
                  column={activeColumn}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createIssue={createIssue}
                  deleteIssue={deleteIssue}
                  updateIssue={updateIssue}
                  issues={issues.filter((issue) => issue.status === activeColumn.id)}
                  loading={loading}
                />
              )}
              {activeIssue && (
                <IssueCard
                  issue={activeIssue}
                  deleteIssue={deleteIssue}
                  updateIssue={updateIssue}
                />
              )}
            </DragOverlay>,
            document.body,
          )}
        </DndContext>
      </div>
    </div>
  );
};
