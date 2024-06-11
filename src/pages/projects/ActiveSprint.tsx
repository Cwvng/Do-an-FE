import React, { useEffect } from 'react';
import {
  Avatar,
  Breadcrumb,
  Button,
  Col,
  Form,
  FormProps,
  Input,
  message,
  Modal,
  Progress,
  Row,
  Select,
  SelectProps,
  Space,
  theme,
  Tooltip,
} from 'antd';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { KanbanBoard } from '../../components/kanban/KanbanBoard.tsx';
import { AppState, useDispatch, useSelector } from '../../redux/store';
import { getProjectDetail } from '../../redux/slices/user.slice.ts';
import { useForm } from 'antd/es/form/Form';
import { getAllOtherUsers } from '../../requests/user.request.ts';
import { updateProjectById } from '../../requests/project.request.ts';
import { IoIosTimer } from 'react-icons/io';
import { FaEllipsisV, FaSearch } from 'react-icons/fa';
import { getRemainingDay, getRemainingDaysPercent } from '../../utils/project.util.ts';
import { Status } from '../../constants';
import { ProjectSprint } from '../../requests/types/sprint.interface.ts';
import { getSprintDetail } from '../../requests/sprint.request.ts';
import moment from 'moment';

export const ActiveSprint: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [form] = useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const { sprintId } = useParams();
  const project = useSelector((app: AppState) => app.user.selectedProject);

  const [addModal, setAddModal] = React.useState(false);
  const [cfModal, setCfModal] = React.useState(false);
  const [options, setOptions] = React.useState<SelectProps['options']>([]);
  const [sprint, setSprint] = React.useState<ProjectSprint>();

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const getUserList = async () => {
    try {
      const data = await getAllOtherUsers();
      const userList: SelectProps['options'] = [];
      data.forEach((item) => {
        userList.push({
          value: item._id,
          label: item.firstname + ' ' + item.lastname,
          emoji: item.profilePic,
          desc: item.email,
        });
      });
      setOptions(userList);
    } catch (error) {
      console.log(error);
    }
  };

  const getSprintInfor = async () => {
    try {
      if (sprintId) {
        const res = await getSprintDetail(sprintId);
        setSprint(res);
      }
    } finally {
    }
  };

  const addNewMember: FormProps['onFinish'] = async (values) => {
    try {
      if (id) {
        await updateProjectById(id, { members: values.members });
        dispatch(getProjectDetail(id));
        message.success('Updated project information');
        form.resetFields();
        setAddModal(false);
      }
    } finally {
    }
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ label: e.target.value });
  };
  const handleSearchEnter = () => {};

  useEffect(() => {
    getUserList();
    getSprintInfor();
  }, []);

  if (!sprint) return;
  return (
    <div className="bg-white flex flex-col gap-3 p-5 h-full">
      <Row>
        <Breadcrumb
          items={[
            {
              title: (
                <span className="cursor-pointer" onClick={() => navigate('/projects')}>
                  Project
                </span>
              ),
            },
            {
              title: <span>{project?.name}</span>,
            },
            {
              title: <span className="font-bold text-primary">Active sprint</span>,
            },
          ]}
        />
      </Row>
      {!sprint ? (
        <div className="flex flex-col items-center gap-3 justify-center">
          <img
            alt=""
            className="object-contain w-100"
            src="https://i.pinimg.com/originals/23/8e/a6/238ea679ba9cecce8b3f8c4ebf9d151d.jpg"
          />{' '}
          <h2 className="text-secondary m-0">Your project has not started</h2>
          <div>Create a sprint to start the project</div>
          <Button type="primary" onClick={() => navigate(`/projects/${project?._id}/backlog`)}>
            Go to backlog to create sprint
          </Button>
        </div>
      ) : (
        <>
          <Row className="flex flex-1 items-center justify-between">
            <Col>
              <div className="text-secondary text-2xl m-0 font-bold">{`${project?.name} Sprint ${sprint.ordinary}`}</div>
              <span title="Sprint goal" className="text-gray-500">
                {sprint.sprintGoal}
              </span>
            </Col>
            <Col span={8} className="flex items-center gap-3">
              <Progress
                percent={getRemainingDaysPercent(sprint.endDate)}
                strokeColor={{
                  '0%': token.colorPrimary,
                  '100%': '#87d068',
                }}
              />
              <div className="flex min-w-max items-center gap-1">
                <Tooltip
                  placement="bottom"
                  color={token.colorPrimary}
                  title={`${moment(sprint.startDate).format('DD/MM/YYYY')} - ${moment(sprint.endDate).format('DD/MM/YYYY')}`}
                >
                  <IoIosTimer />
                  <span>{getRemainingDay(sprint.endDate)}</span>
                </Tooltip>
              </div>

              <Button className="max-w-min" type="primary" onClick={() => setCfModal(true)}>
                Complete sprint
              </Button>
              <Button className="w-[80px]" type="primary" icon={<FaEllipsisV />} />
            </Col>
          </Row>
          <Row className="w-1/2">
            <Col span={8}>
              <Input
                value={searchParams.get('label') || ''}
                onChange={handleSearchChange}
                onPressEnter={handleSearchEnter}
                suffix={<FaSearch className="text-primary" />}
              />
            </Col>
            <Col className="ml-3" span={10}>
              {project?.members?.map((member) => (
                <Tooltip key={member._id} placement="top" color="fff" title={member.email}>
                  <Avatar src={member.profilePic} />
                </Tooltip>
              ))}
            </Col>
          </Row>
          <div className="h-full overflow-auto">
            <KanbanBoard />
          </div>
        </>
      )}
      <Modal
        title={<span className="text-xl font-bold text-secondary">Complete sprint</span>}
        centered
        open={cfModal}
        onCancel={() => {
          setCfModal(false);
        }}
        okText="Complete"
        cancelText="Close"
      >
        <span>This sprints contains</span>
        <ul>
          <li>
            {sprint.issues?.filter((issue) => issue.status === Status.DONE).length} Closed issues
          </li>
          <li>
            {sprint.issues?.filter((issue) => issue.status !== Status.DONE).length} Open issues
          </li>
        </ul>
        <div className="flex items-center gap-2">
          Move open issues to sprint:{' '}
          <Form.Item className="m-0" name="sprint">
            <Select
              className="w-30 min-w-max text-white"
              options={[{ value: '2', label: 'Sprint 2' }]}
            />
          </Form.Item>
        </div>
      </Modal>
      <Modal
        title={<span className="text-xl font-bold text-primary">Add new member</span>}
        centered
        open={addModal}
        onCancel={() => {
          setAddModal(false);
          form.resetFields();
        }}
        onOk={form.submit}
        okText="Add"
      >
        <Form layout="vertical" form={form} onFinish={addNewMember}>
          <Form.Item
            name="members"
            initialValue={project?.members.map((item) => ({
              value: item._id,
              label: item.firstname + ' ' + item.lastname,
              emoji: item.profilePic,
              desc: item.email,
            }))}
            label={<span className="font-medium">Members</span>}
          >
            <Select
              className="w-full"
              showSearch
              mode="multiple"
              size="large"
              optionFilterProp="children"
              filterOption={filterOption}
              // @ts-ignore
              options={options}
              optionRender={(option) => (
                <Space>
                  <img src={option.data.emoji} className="w-10" alt="avatar" />
                  <div className="flex flex-col">
                    <span className="font-medium">{option.data.label}</span>
                    <span className="text-sm">{option.data.desc}</span>
                  </div>
                </Space>
              )}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
