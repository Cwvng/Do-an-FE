import React, { useEffect } from 'react';
import {
  Avatar,
  Breadcrumb,
  Button,
  Col,
  Form,
  FormProps,
  Image,
  Input,
  message,
  Modal,
  Progress,
  Row,
  Select,
  SelectProps,
  Space,
  Tag,
  theme,
  Tooltip,
} from 'antd';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { KanbanBoard } from './KanbanBoard.tsx';
import { AppState, useDispatch, useSelector } from '../../../redux/store';
import { getProjectDetail } from '../../../redux/slices/user.slice.ts';
import { useForm } from 'antd/es/form/Form';
import { getAllOtherUsers } from '../../../requests/user.request.ts';
import { updateProjectById } from '../../../requests/project.request.ts';
import { IoIosTimer } from 'react-icons/io';
import { FaSearch } from 'react-icons/fa';
import { getRemainingDay, getRemainingDaysPercent } from '../../../utils/project.util.ts';
import { Priority, Status } from '../../../constants';
import { ProjectSprint } from '../../../requests/types/sprint.interface.ts';
import { getSprintDetail, updateSprint } from '../../../requests/sprint.request.ts';
import moment from 'moment';
import { updateIssueById } from '../../../requests/issue.request.ts';
import { FaBug, FaQuestion } from 'react-icons/fa6';
import { SiTask } from 'react-icons/si';
import { TiFlowChildren } from 'react-icons/ti';

export const ActiveSprint: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [form] = useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const project = useSelector((app: AppState) => app.user.selectedProject);
  const user = useSelector((app: AppState) => app.user.userInfo);

  const [addModal, setAddModal] = React.useState(false);
  const [openCompleteSprint, setOpenCompleteSprint] = React.useState(false);
  const [options, setOptions] = React.useState<SelectProps['options']>([]);
  const [sprint, setSprint] = React.useState<ProjectSprint>();
  const [loading, setLoading] = React.useState(false);
  const [openGuide, setOpenGuide] = React.useState(false);

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const getUserList = async () => {
    try {
      const data = await getAllOtherUsers();
      const userList: SelectProps['options'] = [];
      userList.push({
        value: user?._id,
        label: '<<Me>>',
      });
      data.forEach((item) => {
        userList.push({
          value: item._id,
          label: item.firstname + ' ' + item.lastname,
        });
      });

      setOptions(userList);
    } catch (error) {
      console.log(error);
    }
  };

  const getSprintInfor = async () => {
    try {
      if (project?.activeSprint) {
        const res = await getSprintDetail(project.activeSprint);
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

  const handleSearchEnter = () => {};

  const completeSprint: FormProps['onFinish'] = async (values) => {
    try {
      if (project?.activeSprint && id) {
        setLoading(true);
        //move opened sprint to new sprint
        const updatePromises = sprint?.issues.map((item) => {
          if (item.status !== Status.DONE && item._id) {
            return updateIssueById(item._id, { sprint: values.sprintId });
          }
        });

        if (updatePromises) {
          await Promise.all(updatePromises);
        }

        //close old sprint
        const body = {
          isActive: false,
          projectId: id,
        };
        await updateSprint(project.activeSprint, body);

        message.success(`Moved opened issues to sprint ${values.sprintId}`);

        message.success('Sprint completed');
      }
    } finally {
      setLoading(false);
      setOpenCompleteSprint(false);
    }
  };

  useEffect(() => {
    getUserList();
    getSprintInfor();
  }, []);

  return (
    <div className="bg-white flex flex-col gap-3 p-5 h-full">
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

          <>
            <Row className="flex flex-1 items-center justify-between">
              <Col>
                <div className="flex gap-4">
                  <div className="text-secondary text-2xl m-0 font-bold">
                    {`${project?.name} Sprint ${sprint.ordinary}`}{' '}
                  </div>
                  <Avatar.Group
                    maxCount={5}
                    maxStyle={{ color: token.colorError, backgroundColor: token.colorErrorBg }}
                  >
                    {sprint?.members?.map((member) => (
                      <Tooltip key={member._id} placement="top" color="fff" title={member.email}>
                        <Avatar src={member.profilePic} />
                      </Tooltip>
                    ))}
                  </Avatar.Group>{' '}
                </div>

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
                    <span>
                      {+getRemainingDay(sprint.endDate) > 0 ? getRemainingDay(sprint.endDate) : 0}
                    </span>
                  </Tooltip>
                </div>

                <Button
                  className="max-w-min"
                  type="primary"
                  onClick={() => setOpenCompleteSprint(true)}
                >
                  Complete sprint
                </Button>
                <Button
                  className="w-[50px] flex items-center justify-center"
                  type="primary"
                  onClick={() => setOpenGuide(true)}
                  icon={<FaQuestion />}
                />
              </Col>
            </Row>
            <Row className="w-2/3 flex gap-2">
              <Col span={4}>
                <Input
                  value={searchParams.get('label') || ''}
                  onChange={(e) => setSearchParams({ label: e.target.value })}
                  onPressEnter={handleSearchEnter}
                  placeholder="Label"
                  suffix={<FaSearch className="text-primary" />}
                />
              </Col>
              <Col span={4}>
                <Select
                  className="min-w-full"
                  showSearch
                  mode="multiple"
                  placeholder="Assignee"
                  optionFilterProp="children"
                  onChange={(e) => setSearchParams({ assignee: e })}
                  filterOption={filterOption}
                  // @ts-ignore
                  options={options}
                  optionRender={(option) => (
                    <Space>
                      <div className="flex flex-col">
                        <span className="font-medium">{option.data.label}</span>
                        <span className="text-sm">{option.data.desc}</span>
                      </div>
                    </Space>
                  )}
                />
              </Col>
              <Col span={4}>
                <Select
                  placeholder="Priority"
                  allowClear
                  mode="multiple"
                  className="w-full"
                  onChange={(e) => setSearchParams({ priority: e })}
                  options={[
                    { value: Priority.LOW, label: 'Low' },
                    { value: Priority.MEDIUM, label: 'Medium' },
                    { value: Priority.HIGH, label: 'High' },
                    { value: Priority.URGENT, label: 'Urgent' },
                  ]}
                />
              </Col>
            </Row>
            <div className="h-full overflow-auto">
              <KanbanBoard />
            </div>
          </>
          <Modal
            title={<span className="text-xl font-bold text-secondary">Complete sprint 🎯</span>}
            centered
            open={openCompleteSprint}
            onCancel={() => {
              setOpenCompleteSprint(false);
            }}
            onOk={form.submit}
            okText="Complete sprint"
            cancelText="Close"
            confirmLoading={loading}
          >
            <span>This sprints contains</span>
            <ul>
              <li>
                {sprint.issues?.filter((issue) => issue.status === Status.DONE).length} Closed
                issues
              </li>
              <li>
                {sprint.issues?.filter((issue) => issue.status !== Status.DONE).length} Opened
                issues
              </li>
            </ul>
            <Form form={form} onFinish={completeSprint} className="flex items-center gap-2">
              Move opened issues to sprint:{' '}
              <Form.Item
                className="m-0"
                name="sprintId"
                rules={[{ required: true, message: 'Choose a sprint to move opened issue' }]}
              >
                <Select
                  className="w-30 min-w-max text-white"
                  allowClear
                  options={project?.backlog
                    .filter((item) => item._id !== sprint._id)
                    .map((item) => ({
                      value: item._id,
                      label: `Sprint ${item.ordinary}`,
                    }))}
                />
              </Form.Item>
            </Form>
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
          <Modal
            title={<span className="text-xl font-bold text-secondary">Sprint workflow</span>}
            centered
            open={openGuide}
            onCancel={() => setOpenGuide(false)}
            onOk={() => setOpenGuide(false)}
            okText="OK"
            width="60vw"
          >
            By default, business projects come with three standard issue type:
            <ul>
              <li>
                <b>Task: </b>A task (represent by icon{' '}
                <Tag color="blue-inverse">
                  <SiTask />
                </Tag>
                ) represents work that needs to be done. Alternatively, a complex task can be
                divided into smaller subtasks.
              </li>
              <li>
                <b>Subtask: </b>A subtask (represent by icon{' '}
                <Tag color="geekblue-inverse">
                  <TiFlowChildren />
                </Tag>
                ) is a piece of work that is required to complete a task.
              </li>
              <li>
                <b>Bug: </b>A bug (represent by icon{' '}
                <Tag color="orange-inverse">
                  <FaBug />
                </Tag>
                ) is a problem which impairs or prevents the functions of a product.
              </li>
            </ul>
            Managing issues follows the workflow as shown below, with the following notes:
            <ul>
              <li>Only the assigned person can change the status of the issue.</li>
              <li>
                For issues of type <i>Task</i>, the <i>Testing</i> status can be skipped and moved
                directly to <i>Done</i>.
              </li>
              <li>
                An issue of type <i>Task</i> cannot be moved to the <i>Done</i> status if any of its
                <i>Subtasks</i> (if any) are not in the <i>Done</i> status.
              </li>
              <li>
                To move an issue with an accompanying pull request from the <i>Waiting Review</i>{' '}
                status to other statuses, the pull request must be merged
              </li>
            </ul>
            <div className="flex justify-center">
              <Image className="w-full" src="../../../src/assets/images/workflow.png" />
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};
