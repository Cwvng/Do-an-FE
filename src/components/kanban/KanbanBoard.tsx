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
import { Button, Col, Input, message, Row, Select, SelectProps, Space } from 'antd';
import { Issue, UpdateIssueBody } from '../../requests/types/issue.interface.ts';
import { Priority, Status } from '../../constants';
import {
  createNewIssue,
  deleteIssueById,
  getIssueList,
  updateIssueById,
} from '../../requests/issue.request.ts';
import { useParams, useSearchParams } from 'react-router-dom';
import { AppState, useSelector } from '../../redux/store';

const defaultCols: Column[] = [
  {
    id: Status.NEW,
    title: 'New ✨',
  },
  {
    id: Status.IN_PROGRESS,
    title: 'In progress 🔄',
  },
  {
    id: Status.WAITING_REVIEW,
    title: 'Waiting review ⏳',
  },
  {
    id: Status.FEEDBACK,
    title: 'Feedback 🧐',
  },
  {
    id: Status.DONE,
    title: 'Done ✔️',
  },
];

export const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const [options, setOptions] = useState<SelectProps['options']>([]);

  const project = useSelector((app: AppState) => app.user.selectedProject);
  const [searchParams, setSearchParams] = useSearchParams();
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const user = useSelector((app: AppState) => app.user.userInfo);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );
  const { id } = useParams();

  const updateIssueDetail = async (issueId: string, body: UpdateIssueBody) => {
    try {
      await updateIssueById(issueId, body);
    } finally {
    }
  };

  const getUserList = () => {
    try {
      const userList: SelectProps['options'] = [];
      project?.members.forEach((item) => {
        userList.push({
          value: item._id,
          label: item._id === user?._id ? '<<Me>>' : item.firstname + ' ' + item.lastname,
          emoji: item.profilePic,
          desc: item.email,
        });
      });
      setOptions(userList);
    } catch (error) {
      console.log(error);
    }
  };

  // CRUD issue
  const getIssueListByProjectId = async () => {
    try {
      if (id) {
        setLoading(true);
        const label = searchParams.get('label') || '';
        const assignee = searchParams.getAll('assignee').join(',') || '';
        const priority = searchParams.getAll('priority').join(',') || '';
        const res = await getIssueList({ projectId: id, label, assignee, priority });
        setIssues(res);
      }
    } finally {
      setLoading(false);
    }
  };

  const createIssue = async (columnId: Id) => {
    try {
      if (id) {
        const body: Issue = {
          status: columnId,
          label: `Issue ${issues.length + 1}`,
          project: id,
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
    getIssueListByProjectId();
    getUserList();
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ label: e.target.value });
  };

  const handleAssigneeChange = (values: string[]) => {
    setSearchParams((prevParams) => {
      prevParams.delete('assignee');
      values.forEach((value) => prevParams.append('assignee', value));
      return prevParams;
    });
  };

  const handlePriorityChange = (values: string[]) => {
    setSearchParams((prevParams) => {
      prevParams.delete('priority');
      values.forEach((value) => prevParams.append('priority', value));
      return prevParams;
    });
  };

  const handleSearchEnter = () => {
    getIssueListByProjectId();
  };

  return (
    <div className="flex flex-col">
      <h2 className="mt-5 text-secondary">{`Assigned issues (${project?.issues.length})`}</h2>
      <Row className="flex items-center justify-start gap-5">
        <Col span={1} className="text-secondary">
          Label
        </Col>
        <Col className="flex flex-row items-center gap-5 " span={4}>
          <Input
            value={searchParams.get('label') || ''}
            onChange={handleSearchChange}
            onPressEnter={handleSearchEnter}
          />
        </Col>

        <Col span={1} className="text-secondary">
          Assignee
        </Col>
        <Col span={4}>
          <Select
            className="w-full"
            showSearch
            optionFilterProp="children"
            mode="multiple"
            filterOption={(input: string, option?: { label: string; value: string }) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            onChange={handleAssigneeChange}
            // @ts-ignore
            options={options}
            optionRender={(option) => (
              <Space>
                <div className="flex flex-col">
                  <span>{option.data.label}</span>
                </div>
              </Space>
            )}
          />
        </Col>
        <Col span={1} className="text-secondary">
          Priority
        </Col>
        <Col span={4}>
          <Select
            mode="multiple"
            className="w-full"
            options={[
              { value: Priority.LOW, label: 'Low' },
              { value: Priority.MEDIUM, label: 'Medium' },
              { value: Priority.HIGH, label: 'High' },
              { value: Priority.URGENT, label: 'Urgent' },
            ]}
            onChange={handlePriorityChange}
          />
        </Col>
        {/*<Avatar.Group*/}
        {/*  maxCount={5}*/}
        {/*  maxStyle={{ color: token.colorError, backgroundColor: token.colorErrorBg }}*/}
        {/*>*/}
        {/*  {project?.members?.map((member) => (*/}
        {/*    <Tooltip key={member._id} placement="top" color="fff" title={member.email}>*/}
        {/*      <Avatar src={member.profilePic} />*/}
        {/*    </Tooltip>*/}
        {/*  ))}*/}
        {/*</Avatar.Group>*/}
      </Row>

      <div className="flex flex-1 w-full overflow-x-auto overflow-y-hidden mt-3">
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <div className="flex gap-4 pb-2">
            <div className="flex gap-4">
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
