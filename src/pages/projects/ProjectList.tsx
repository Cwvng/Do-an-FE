import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Breadcrumb,
  Button,
  Dropdown,
  Form,
  FormProps,
  Input,
  message,
  Modal,
  Select,
  SelectProps,
  Space,
  Table,
  Tag,
  theme,
} from 'antd';
import { createProject, deleteProject, getAllProject } from '../../requests/project.request.ts';
import { Project } from '../../requests/types/project.interface.ts';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaEllipsisV, FaPlus, FaSearch } from 'react-icons/fa';
import { useForm } from 'antd/es/form/Form';
import { getAllOtherUsers } from '../../requests/user.request.ts';
import { User } from '../../requests/types/chat.interface.ts';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Message } from '../../constants';
import { createGroupChat } from '../../requests/chat.request.ts';
import { useSelector } from '../../redux/store';
import moment from 'moment';
export const ProjectList: React.FC = () => {
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [options, setOptions] = useState<SelectProps['options']>([]);

  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [form] = useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useSelector((app) => app.user);

  const getProjectList = async (name?: string) => {
    try {
      setLoading(true);
      const res = await getAllProject({ name: name! });
      setProjectList(res);
    } finally {
      setLoading(false);
    }
  };

  const debouncedGetProjectList = async (name: string) => {
    setSearchParams({ name });
    await getProjectList(name);
  };

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

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedGetProjectList(e.target.value);
  };

  const createNewProject: FormProps['onFinish'] = async (values) => {
    try {
      setLoading(true);
      await createProject(values);
      await createGroupChat({ name: values.name, users: values.members });
      message.success(Message.CREATED);
      setOpenModal(false);
      getProjectList();
    } finally {
      setLoading(false);
    }
  };

  const deleteSelectedProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      message.success(Message.DELETED);
      await getProjectList();
    } finally {
    }
  };

  useEffect(() => {
    getProjectList();
    getUserList();
  }, []);

  return (
    <div className="h-full flex flex-col bg-white p-5">
      <Breadcrumb
        items={[
          {
            title: (
              <span className="cursor-pointer text-gray-400" onClick={() => navigate('/projects')}>
                Project
              </span>
            ),
          },
        ]}
      ></Breadcrumb>
      <h2 className="mt-5 text-secondary">Your project ({projectList.length})</h2>
      <div>
        <Input
          className="w-1/3"
          size="large"
          value={searchParams.get('name') || ''}
          onChange={handleSearch}
          suffix={<FaSearch className="text-primary" />}
        />
        <Button
          shape="circle"
          className="ml-3"
          title="Create new project"
          type="primary"
          onClick={() => setOpenModal(true)}
          icon={<FaPlus />}
        />
      </div>
      <Table
        className="mt-3"
        dataSource={projectList}
        loading={loading}
        pagination={{
          position: ['bottomCenter'],
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '30'],
        }}
        columns={[
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => <Link to={`/projects/${record._id}`}>{name}</Link>,
          },
          {
            title: 'Role',
            dataIndex: 'projectManager',
            key: 'projectManager',

            render: (projectManager) => (
              <>
                {projectManager._id === user.userInfo?._id ? (
                  <Tag color="blue">PM</Tag>
                ) : (
                  <Tag color="yellow">Dev</Tag>
                )}
              </>
            ),
          },
          {
            title: 'Created at',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: {
              compare: (a: any, b: any) => a.createdAt.localeCompare(b.createdAt),
              multiple: 1,
            },
            render: (createdAt) => <>{moment(createdAt).format('DD/MM/YYYY')}</>,
          },
          {
            title: 'Total issues',
            dataIndex: 'issues',
            key: 'issues',
            align: 'center',
            render: (issues) => <>{issues.length}</>,
          },
          {
            title: 'Project manager',
            dataIndex: 'projectManager',
            key: 'projectManager',
            render: (data) => (
              <>
                {data.firstname} {data.lastname}
              </>
            ),
          },
          {
            title: 'Contact',
            dataIndex: 'projectManager',
            key: 'contact',
            render: (data) => <>{data.email}</>,
          },
          {
            title: 'Members',
            dataIndex: 'members',
            key: 'subject',
            render: (members) => (
              <Avatar.Group
                maxCount={3}
                maxStyle={{ color: token.colorError, backgroundColor: token.colorErrorBg }}
              >
                {members.map((member: User, index: number) => (
                  <Avatar key={index} src={member.profilePic} />
                ))}
              </Avatar.Group>
            ),
          },

          {
            title: 'Last updated at',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (updatedAt) => <span> {moment(updatedAt).format('DD/MM/YYYY')}</span>,
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
                      onClick: () => navigate(`/projects/${record._id}`),
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
                            deleteSelectedProject(record._id);
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

      <Modal
        title={<span className="text-xl font-bold text-primary">Create new project</span>}
        centered
        open={openModal}
        onCancel={() => setOpenModal(false)}
        okText="Create"
        confirmLoading={loading}
        onOk={form.submit}
      >
        <Form layout="vertical" form={form} requiredMark={false} onFinish={createNewProject}>
          <Form.Item
            name="name"
            label={<span className="font-medium">Project name</span>}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
              },
            ]}
            name="members"
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
                  <Avatar shape="square" src={option.data.emoji} alt="avatar" />
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
