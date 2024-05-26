import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Breadcrumb,
  Button,
  Form,
  FormProps,
  Input,
  message,
  Modal,
  Select,
  SelectProps,
  Space,
  Table,
  theme,
} from 'antd';
import { createProject, getAllProject } from '../../requests/project.request.ts';
import { Project } from '../../requests/types/project.interface.ts';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loading } from '../../components/loading/Loading.tsx';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useForm } from 'antd/es/form/Form';
import { getAllOtherUsers } from '../../requests/user.request.ts';
import queryString from 'query-string';
import { User } from '../../requests/types/chat.interface.ts';

export const ProjectList: React.FC = () => {
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [options, setOptions] = React.useState<SelectProps['options']>([]);

  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [form] = useForm();
  const [searchParams, setSearchParams] = useSearchParams();

  const getProjectList = async () => {
    try {
      setLoading(true);
      const name = searchParams.get('name');
      const res = await getAllProject({ name });
      setProjectList(res);
    } finally {
      setLoading(false);
    }
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

  const handleNavigateQuery = () => {
    const qs = queryString.stringify({ name: searchParams.get('name') });
    navigate({ search: '?' + qs });
    getProjectList();
  };

  const createNewProject: FormProps['onFinish'] = async (values) => {
    try {
      setLoading(true);
      await createProject(values);
      message.success('Created new project');
      setOpenModal(false);
      getProjectList();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProjectList();
    getUserList();
  }, []);

  if (loading) return <Loading />;
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
          value={searchParams.get('name')!}
          onChange={(e) => setSearchParams({ name: e.target.value })}
          suffix={<FaSearch onClick={handleNavigateQuery} className="text-primary" />}
          onPressEnter={handleNavigateQuery}
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
        pagination={{ position: ['bottomCenter'] }}
        columns={[
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => <Link to={`/projects/${record._id}`}>{name}</Link>,
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
            title: 'Updated at',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (updatedAt) => (
              <>
                {new Date(updatedAt).toDateString()},{' '}
                {new Date(updatedAt).toLocaleTimeString('vi-VN')}
              </>
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
