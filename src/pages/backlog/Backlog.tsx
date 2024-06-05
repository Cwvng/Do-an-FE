import React, { useEffect } from 'react';
import {
  Avatar,
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Dropdown,
  Form,
  FormProps,
  Input,
  Modal,
  Row,
  Select,
  SelectProps,
  Space,
  Table,
  Tag,
  theme,
  Tooltip,
} from 'antd';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import moment from 'moment/moment';
import { FaEllipsisV, FaPlus, FaSearch } from 'react-icons/fa';
import { AppState, useSelector } from '../../redux/store';
import { Link, useNavigate } from 'react-router-dom';
import { createProjectSprint, getProjectBacklog } from '../../requests/project.request.ts';
import { ProjectSprint } from '../../requests/types/project.interface.ts';
import { Loading } from '../../components/loading/Loading.tsx';
import TextArea from 'antd/es/input/TextArea';
import { useForm } from 'antd/es/form/Form';
import { Priority, Status } from '../../constants';
import { getStatusTagColor, toCapitalize } from '../../utils/project.util.ts';
import { ExclamationCircleFilled } from '@ant-design/icons';

export const Backlog: React.FC = () => {
  const project = useSelector((app: AppState) => app.user.selectedProject);
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [form] = useForm();

  const [backlog, setBacklog] = React.useState<ProjectSprint[]>();
  const [openCreate, setOpenCreate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [createLoading, setCreateLoading] = React.useState(false);
  const [options, setOptions] = React.useState<any[]>();
  const [openSprintTabs, setOpenSprintTabs] = React.useState<string[]>([]);

  const getProjectBacklogList = async () => {
    try {
      setLoading(true);
      if (project?._id) {
        const res = await getProjectBacklog(project._id);
        setBacklog(res);
        setOpenSprintTabs([res[0]._id]);
      }
    } finally {
      setLoading(false);
    }
  };

  const createNewSprint: FormProps['onFinish'] = async (values) => {
    try {
      setCreateLoading(true);
      if (project?._id) {
        values.projectId = project._id;
        await createProjectSprint(values);
        await getProjectBacklogList();
      }
    } finally {
      setCreateLoading(false);
    }
  };

  const getUserList = () => {
    try {
      const userList: SelectProps['options'] = [];
      project?.members.forEach((item) => {
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
  const isSprintTabOpen = (sprintId: string) => {
    return openSprintTabs.includes(sprintId);
  };

  useEffect(() => {
    getProjectBacklogList();
    getUserList();
  }, []);

  if (!project) return;
  if (loading) return <Loading />;

  return (
    <div className="bg-white gap-3 flex flex-col p-5 h-full">
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
              title: <span>Backlog</span>,
            },
          ]}
        />
      </Row>
      {backlog?.length == 0 ? (
        <div className="flex flex-col items-center gap-3 justify-center">
          <img
            alt=""
            className="object-contain w-100"
            src="https://i.pinimg.com/originals/23/8e/a6/238ea679ba9cecce8b3f8c4ebf9d151d.jpg"
          />{' '}
          <h2 className="text-secondary m-0">Your project has not started</h2>
          <div>Create a sprint to start the project</div>
          <Button onClick={() => setOpenCreate(true)} type="primary">
            Create sprint
          </Button>
        </div>
      ) : (
        <>
          <Row className="flex flex-1 items-center justify-between">
            <div>
              <div className="text-secondary text-xl font-bold">{`${project?.name}`}</div>
            </div>
            <div className="flex items-center gap-3">
              <Tooltip placement="left" color={token.colorPrimary}>
                <div className="flex items-center gap-1">
                  Created
                  <span>{moment(project?.createdAt).fromNow()}</span>
                </div>
              </Tooltip>

              <Button type="primary" icon={<FaEllipsisV />} />
            </div>
          </Row>
          <Row className="w-1/2">
            <Col span={8}>
              <Input
                // value={searchParams.get('label') || ''}
                // onChange={handleSearchChange}
                // onPressEnter={handleSearchEnter}
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
            {backlog &&
              backlog?.map((item, index) => (
                <div className="bg-hoverBg rounded-md p-2" key={index}>
                  <div
                    onClick={() => {
                      if (!isSprintTabOpen(item._id))
                        setOpenSprintTabs([...openSprintTabs, item._id]);
                      else setOpenSprintTabs(openSprintTabs.filter((tab) => tab !== item._id));
                    }}
                    className="flex gap-2 w-full items-center text-secondary bg-lightBg p-2 hover:cursor-pointer text-md"
                  >
                    {isSprintTabOpen(item._id) ? <IoIosArrowDown /> : <IoIosArrowUp />}
                    <div>
                      {project.name} Sprint {item.ordinary}
                    </div>
                  </div>
                  {isSprintTabOpen(item._id) && (
                    <>
                      <Table
                        className="mt-2"
                        dataSource={item.issues}
                        loading={loading}
                        pagination={false}
                        columns={[
                          {
                            title: 'Label',
                            dataIndex: 'label',
                            key: 'Label',
                            render: (label, record) => (
                              <Link to={`/projects/${project._id}/issue/${record._id}`}>
                                {label}
                              </Link>
                            ),
                          },
                          {
                            title: 'Subject',
                            dataIndex: 'subject',
                            key: 'subject',
                            align: 'center',
                            render: (subject) => <span>{subject || '-'}</span>,
                          },
                          {
                            title: 'Status',
                            dataIndex: 'status',
                            key: 'status',
                            align: 'center',
                            filters: Object.values(Status).map((status) => ({
                              text: status,
                              value: status,
                            })),
                            onFilter: (value, record) => record.status.indexOf(value) === 0,
                            sorter: (a: any, b: any) => a.status.localeCompare(b.status),
                            render: (status) => {
                              const color = getStatusTagColor(status);
                              return (
                                <Tag color={color} key={status}>
                                  {status?.toUpperCase()}
                                </Tag>
                              );
                            },
                          },
                          {
                            title: 'Priority',
                            dataIndex: 'priority',
                            key: 'priority',
                            align: 'center',
                            filters: Object.values(Priority).map((priority) => ({
                              text: priority,
                              value: priority,
                            })),
                            onFilter: (value, record) => record.priority.indexOf(value) === 0,
                            sorter: (a, b) => a.priority.localeCompare(b.priority),
                            render: (priority) => {
                              const color = getStatusTagColor(priority);
                              return (
                                <span className={`text-${color}-500`} key={priority}>
                                  {toCapitalize(priority)}
                                </span>
                              );
                            },
                          },
                          {
                            title: 'Assignee',
                            dataIndex: 'assignee',
                            key: 'assignee',
                            render: (assignee) => (
                              <>
                                {assignee?.firstname} {assignee?.lastname}
                              </>
                            ),
                          },
                          {
                            title: 'Due date',
                            dataIndex: 'dueDate',
                            key: 'dueDate',
                            render: (date) => (
                              <span key={date}>
                                {new Date(date).toLocaleDateString('vi-VN', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: 'numeric',
                                })}
                              </span>
                            ),
                          },
                          {
                            title: 'Estimate time',
                            dataIndex: 'estimateTime',
                            key: 'estimateTime',
                            align: 'center',
                            render: (estimateTime) => (
                              <span key={estimateTime}>{estimateTime}h</span>
                            ),
                          },
                          {
                            title: 'Actions',
                            key: 'actions',
                            dataIndex: 'job_id',
                            width: '50px',
                            align: 'center',
                            render: (_, record) => (
                              <Dropdown
                                menu={{
                                  items: [
                                    {
                                      label: <span>Detail</span>,
                                      key: 'detail',
                                      onClick: () =>
                                        navigate(`/projects/${project._id}/issue/${record._id}`),
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
                                            // deleteIssue(record._id);
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
                            ),
                          },
                        ]}
                      />
                      <Button
                        type="text"
                        className=" mt-2 bg-lightBg flex items-center gap-2 text-secondary"
                      >
                        <FaPlus />
                        Create issue
                      </Button>
                    </>
                  )}
                </div>
              ))}
          </div>
        </>
      )}
      <Modal
        title={<span className="text-xl font-bold text-secondary">Create new sprint</span>}
        centered
        open={openCreate}
        onCancel={() => {
          form.resetFields();
          setOpenCreate(false);
        }}
        okText="Create"
        confirmLoading={createLoading}
        onOk={form.submit}
      >
        <Form layout="vertical" requiredMark={false} form={form} onFinish={createNewSprint}>
          <Row className="flex justify-between">
            <Col span={24}>
              <Form.Item name="members" label={<span className="font-medium">Members</span>}>
                <Select
                  className="w-full"
                  showSearch
                  size="large"
                  mode="multiple"
                  optionFilterProp="children"
                  filterOption={(input: string, option?: { label: string; value: string }) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  // @ts-ignore
                  options={options}
                  optionRender={(option) => (
                    <Space>
                      <Avatar shape="square" src={option.data.emoji} alt="avatar" />
                      <div className="flex flex-col">
                        <span className="font-medium">{option.data.label}</span>
                        <span className="text-sm">{option.data.desc}</span>
                      </div>
                    </Space>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row className="flex justify-between">
            <Col span={11}>
              <Form.Item name="startDate" label={<span className="font-medium">Start date</span>}>
                <DatePicker size="large" className="w-full" format="YYYY/MM/DD" />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item name="endDate" label={<span className="font-medium">End date</span>}>
                <DatePicker size="large" className="w-full" format="YYYY/MM/DD" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item name="sprintGoal" label={<span className="font-medium">Sprint goal</span>}>
                <TextArea size="large" autoSize />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
