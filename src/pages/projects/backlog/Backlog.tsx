import React, { useEffect } from 'react';
import {
  Avatar,
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Divider,
  Dropdown,
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
  Spin,
  Table,
  Tag,
  theme,
  Tooltip,
  Upload,
  UploadFile,
} from 'antd';
import { IoIosArrowDown, IoIosArrowUp, IoIosMore } from 'react-icons/io';
import moment from 'moment/moment';
import { FaEllipsisV, FaPlus, FaSearch } from 'react-icons/fa';
import { AppState, dispatch, useSelector } from '../../../redux/store';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProjectBacklog } from '../../../requests/project.request.ts';
import TextArea from 'antd/es/input/TextArea';
import { useForm } from 'antd/es/form/Form';
import { Priority, Status } from '../../../constants';
import {
  getRemainingDaysPercent,
  getStatusTagColor,
  toCapitalize,
} from '../../../utils/project.util.ts';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import {
  createProjectSprint,
  deleteSprint,
  updateSprint,
} from '../../../requests/sprint.request.ts';
import { ProjectSprint } from '../../../requests/types/sprint.interface.ts';
import { Id } from '../active-sprint/type.tsx';
import { createNewIssue, deleteIssueById } from '../../../requests/issue.request.ts';
import { getProjectDetail } from '../../../redux/slices/user.slice.ts';
import { SprintDetail } from './SprintDetail.tsx';

export const Backlog: React.FC = () => {
  const project = useSelector((app: AppState) => app.user.selectedProject);
  const user = useSelector((app: AppState) => app.user.userInfo);
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [form] = useForm();
  const { id } = useParams();

  const [backlog, setBacklog] = React.useState<ProjectSprint[]>();
  const [openCreate, setOpenCreate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [createLoading, setCreateLoading] = React.useState(false);
  const [options, setOptions] = React.useState<any[]>();
  const [openSprintTabs, setOpenSprintTabs] = React.useState<string[]>([]);
  const [openAddIssue, setOpenAddIssue] = React.useState(false);
  const [fileList, setFileList] = React.useState<UploadFile[]>();
  const [selectedSprint, setSelectedSprint] = React.useState<string>();
  const [openDetail, setOpenDetail] = React.useState(false);

  const getProjectBacklogList = async () => {
    try {
      setLoading(true);
      if (id) {
        const res = await getProjectBacklog(id);
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
        values.isActive = !project.activeSprint;
        await createProjectSprint(values);
        setOpenCreate(false);
        await getProjectBacklogList();
      }
    } finally {
      form.resetFields();
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

  const deleteIssue = async (id: Id) => {
    try {
      if (id) {
        await deleteIssueById(id);
        await getProjectBacklogList();
        message.success('Deleted an issue');
      }
    } finally {
    }
  };

  const createIssue: FormProps['onFinish'] = async (values) => {
    try {
      setCreateLoading(true);
      const formData = new FormData();
      if (values.images && values.images.length > 0)
        values.images.forEach((image: any) => {
          formData.append('images', image.originFileObj);
        });
      formData.append('status', Status.NEW);
      if (values.description) formData.append('description', values.description);
      if (values.assignee) formData.append('assignee', values.assignee);
      if (values.priority) formData.append('priority', values.priority);
      if (values.dueDate) formData.append('dueDate', values.dueDate);
      if (values.label) formData.append('label', values.label);
      if (values.estimateTime) formData.append('estimateTime', values.estimateTime);
      if (selectedSprint) formData.append('sprint', selectedSprint);
      await createNewIssue(formData);
      await getProjectBacklogList();

      message.success('Created an issue');
      setOpenAddIssue(false);
      form.resetFields();
    } finally {
      setCreateLoading(false);
    }
  };
  const isSprintTabOpen = (sprintId: string) => {
    return openSprintTabs.includes(sprintId);
  };

  const startSprint = async (sprintId: string) => {
    try {
      if (id) {
        setLoading(true);
        await updateSprint(sprintId, { isActive: true, projectId: id });
        message.success('Started new sprint');
        await getProjectBacklogList();
        dispatch(getProjectDetail(id));
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteSelectedSprint = async (sprintId: string) => {
    try {
      setLoading(true);
      await deleteSprint(sprintId);
      await getProjectBacklogList();
      message.success('Deleted successfully');
    } finally {
      setLoading(false);
    }
  };

  const isConfirmToDelete = (sprintId: string) => {
    Modal.confirm({
      centered: true,
      title: 'Do you want to delete these items?',
      icon: <ExclamationCircleFilled />,
      onOk() {
        deleteSelectedSprint(sprintId);
      },
      okText: 'Yes',
      cancelText: 'No',
    });
  };

  useEffect(() => {
    getProjectBacklogList();
    getUserList();
  }, []);
  useEffect(() => {
    getProjectBacklogList();
    getUserList();
  }, [project]);

  if (!project) return;

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
              title: <span className="font-bold text-primary">Backlog</span>,
            },
          ]}
        />
      </Row>
      {loading ? (
        <Spin />
      ) : (
        <>
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
                <div className="text-secondary text-2xl m-0 font-bold">
                  {`${project?.name}`} Backlog
                </div>
                <div className="flex items-center gap-3">
                  <Tooltip placement="left" color={token.colorPrimary}>
                    <div className="flex items-center gap-1">
                      Created
                      <span>{moment(project?.createdAt).fromNow()}</span>
                    </div>
                  </Tooltip>
                  <Dropdown
                    className="w-8"
                    trigger={['click']}
                    menu={{
                      items: [
                        {
                          label: <span>Detail</span>,
                          key: `complete`,
                          onClick: () => navigate(`/project-list/${project?._id}`),
                        },
                        {
                          label: <span>Create new sprint</span>,
                          key: `createSprint`,
                          onClick: () => {
                            if (project.projectManager._id === user?._id) setOpenCreate(true);
                          },
                          disabled: project.projectManager._id !== user?._id,
                        },
                      ],
                    }}
                    placement="bottomRight"
                    arrow={{ pointAtCenter: true }}
                  >
                    <Button type="primary" icon={<FaEllipsisV />} />
                  </Dropdown>
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

              <div className="h-full flex flex-col gap-4 overflow-auto px-3">
                {backlog &&
                  backlog?.map((item, index) => (
                    <div className="bg-lightBg rounded-md p-2" key={index}>
                      <div className="flex gap-2 w-full items-center justify-between p-2 hover:cursor-pointer text-md">
                        <div
                          onClick={() => {
                            if (!isSprintTabOpen(item._id))
                              setOpenSprintTabs([...openSprintTabs, item._id]);
                            else
                              setOpenSprintTabs(openSprintTabs.filter((tab) => tab !== item._id));
                          }}
                          className="flex text-secondary font-bold items-center gap-2"
                        >
                          {isSprintTabOpen(item._id) ? <IoIosArrowDown /> : <IoIosArrowUp />}
                          {project.name} Sprint {item.ordinary}
                          {item.isActive && <Tag color="green-inverse">Active</Tag>}
                        </div>
                        <div className="flex gap-2 w-1/5">
                          <Progress
                            percent={getRemainingDaysPercent(item.endDate)}
                            strokeColor={{
                              '0%': token.colorPrimary,
                              '100%': '#87d068',
                            }}
                          />
                          <Button
                            type="primary"
                            onClick={() => {
                              setOpenAddIssue(true);
                              setSelectedSprint(item._id);
                            }}
                            className="flex items-center gap-2"
                          >
                            <FaPlus />
                            Create issue
                          </Button>

                          <Dropdown
                            className="w-10"
                            trigger={['click']}
                            menu={{
                              items: item.isActive
                                ? [
                                    {
                                      label: <span>Detail</span>,
                                      key: `edit${index}`,
                                      onClick: () => {
                                        setOpenDetail(true);
                                        setSelectedSprint(item._id);
                                      },
                                    },
                                    {
                                      label: <span>Complete sprint</span>,
                                      key: `complete${index}`,
                                      disabled: project.projectManager._id !== user?._id,
                                    },
                                  ]
                                : [
                                    {
                                      label: <span>Detail</span>,
                                      key: `edit${index}`,
                                      onClick: () => {
                                        setOpenDetail(true);
                                        setSelectedSprint(item._id);
                                      },
                                    },
                                    {
                                      label: (
                                        <span
                                          onClick={() => {
                                            if (project.projectManager._id === user?._id)
                                              startSprint(item._id);
                                          }}
                                        >
                                          Start sprint
                                        </span>
                                      ),
                                      key: `start${index}`,
                                      disabled: project.projectManager._id !== user?._id,
                                    },
                                    {
                                      label: <span className="text-red-500">Delete</span>,
                                      key: `delete${index}`,
                                      onClick: () => {
                                        if (project.projectManager._id === user?._id)
                                          isConfirmToDelete(item._id);
                                      },
                                      disabled: project.projectManager._id !== user?._id,
                                    },
                                  ],
                            }}
                            placement="bottomRight"
                            arrow={{ pointAtCenter: true }}
                          >
                            <Button type="primary" icon={<FaEllipsisV />} />
                          </Dropdown>
                        </div>
                      </div>
                      {isSprintTabOpen(item._id) && (
                        <>
                          <Table
                            className="mt-2"
                            pagination={{
                              position: ['bottomRight'],
                              defaultPageSize: 5,
                              showSizeChanger: true,
                              pageSizeOptions: ['5', '10', '30'],
                            }}
                            dataSource={item.issues}
                            loading={loading}
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
                                title: 'Type',
                                dataIndex: 'type',
                                key: 'type',
                                align: 'center',
                                render: (type) => <span>{type || '-'}</span>,
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
                                            navigate(
                                              `/projects/${project._id}/issue/${record._id}`,
                                            ),
                                        },
                                        {
                                          label: <span>Move</span>,
                                          key: 'move',
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
                                                deleteIssue(record._id);
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
                        </>
                      )}
                    </div>
                  ))}

                <Divider>
                  <IoIosMore
                    title="Load more"
                    className="text-2xl text-primary hover:cursor-pointer"
                  />
                </Divider>

                {/*<div className="bg-lightBg rounded-md mt-2 p-2">*/}
                {/*  <div className="flex gap-2 w-full items-center justify-between  bg-lightBg p-2 hover:cursor-pointer text-md">*/}
                {/*    <div className="flex items-center text-secondary font-bold gap-2">*/}
                {/*      <IoIosArrowDown />*/}
                {/*      Backlog*/}
                {/*    </div>*/}
                {/*    <Button*/}
                {/*      type="primary"*/}
                {/*      className="flex items-center gap-2"*/}
                {/*    >*/}
                {/*      Create sprint*/}
                {/*    </Button>*/}
                {/*  </div>*/}
                {/*</div>*/}
              </div>
            </>
          )}
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
      <Modal
        title={<span className="text-xl font-bold text-secondary">Create new issue</span>}
        centered
        open={openAddIssue}
        onCancel={() => {
          form.resetFields();
          setOpenAddIssue(false);
        }}
        okText="Create"
        confirmLoading={createLoading}
        onOk={form.submit}
      >
        <Form layout="vertical" requiredMark={false} form={form} onFinish={createIssue}>
          <Row className="flex justify-between">
            <Col span={11}>
              <Form.Item
                rules={[{ required: true, message: 'Label is required' }]}
                name="label"
                label={<span className="font-medium">Label</span>}
              >
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item
                rules={[{ required: true, message: 'Assignee is required' }]}
                name="assignee"
                label={<span className="font-medium">Assignee</span>}
              >
                <Select
                  className="w-full"
                  showSearch
                  size="large"
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
              <Form.Item
                rules={[{ required: true, message: 'Priority is required' }]}
                name="priority"
                label={<span className="font-medium">Priority</span>}
              >
                <Select
                  size="large"
                  className="w-full text-white"
                  options={[
                    { value: Priority.LOW, label: 'Low' },
                    { value: Priority.MEDIUM, label: 'Medium' },
                    { value: Priority.HIGH, label: 'High' },
                    { value: Priority.URGENT, label: 'Urgent' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item
                rules={[{ required: true, message: 'Due date is required' }]}
                name="dueDate"
                label={<span className="font-medium">Due date</span>}
              >
                <DatePicker size="large" className="w-full" format="YYYY/MM/DD" />
              </Form.Item>
            </Col>
          </Row>
          <Row className="flex justify-between">
            <Col span={11}>
              <Form.Item
                rules={[{ required: true, message: 'Estimate time is required' }]}
                name="estimateTime"
                label={<span className="font-medium">Estimate time</span>}
              >
                <Input type="number" size="large" min={0} addonAfter="hours" />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label={<span className="font-medium">Description</span>}
                >
                  <TextArea size="large" autoSize />
                </Form.Item>
              </Col>
            </Col>
          </Row>

          <Form.Item
            className="mt-5"
            name="images"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
            label={<span className="font-medium">Images</span>}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={(file) => {
                console.log(file);
              }}
              customRequest={async (options) => {
                const { onSuccess, onError, file } = options;

                try {
                  //@ts-ignore
                  onSuccess(file);
                } catch (error) {
                  //@ts-ignore
                  onError(error);
                }
              }}
              onChange={({ fileList: newFileList }) => {
                setFileList(newFileList);
                console.log(fileList);
              }}
              onRemove={(file) => {
                console.log('remove', file);
              }}
            >
              <PlusOutlined className="text-primary text-xl" />
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={<span className="text-xl font-bold text-secondary">Sprint detail</span>}
        centered
        open={openDetail}
        onCancel={() => setOpenDetail(false)}
        onOk={() => setOpenDetail(false)}
        cancelButtonProps={{ className: 'border-primary text-primary' }}
      >
        <SprintDetail sprintId={selectedSprint!} />
      </Modal>
    </div>
  );
};
