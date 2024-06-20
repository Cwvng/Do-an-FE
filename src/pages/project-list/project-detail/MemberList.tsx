import {
  Avatar,
  Col,
  Dropdown,
  Form,
  FormProps,
  Input,
  Modal,
  Rate,
  Row,
  Select,
  SelectProps,
  Space,
  Spin,
  Table,
  Tag,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { FaEllipsisV, FaPlus, FaSearch } from 'react-icons/fa';
import { CircleButton } from '../../../components/common/button/CircleButton.tsx';
import { useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'antd/es/form/Form';
import { getAllOtherUsers, getUserIssueSummary } from '../../../requests/user.request.ts';
import { getProjectById, updateProjectById } from '../../../requests/project.request.ts';
import { AppState, useSelector } from '../../../redux/store';
import { Project } from '../../../requests/types/project.interface.ts';
import { User } from '../../../requests/types/chat.interface.ts';
import { UserIssueSummaryResponse } from '../../../requests/types/user.interface.ts';

export const MemberList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [openAddMember, setOpenAddMember] = React.useState(false);
  const [options, setOptions] = useState<SelectProps['options']>([]);
  const user = useSelector((app: AppState) => app.user);
  const [project, setProject] = React.useState<Project>();
  const [selectedUser, setSelectedUser] = React.useState<User>();
  const [userStatic, setUserStatic] = React.useState<UserIssueSummaryResponse>();
  const [modalLoading, setModalLoading] = React.useState(false);

  const [form] = useForm();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const getProjectDetail = async () => {
    try {
      if (id) {
        setLoading(true);
        const res = await getProjectById(id);
        setProject(res);
      }
    } finally {
      setLoading(false);
    }
  };
  const getUserList = async () => {
    try {
      const data = await getAllOtherUsers();
      const membersList = project?.members.map((item) => item._id);
      const userList: SelectProps['options'] = [];
      data.forEach((item) => {
        if (!membersList?.includes(item._id))
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

  const getUserStatic = async (userId: string) => {
    try {
      setModalLoading(true);
      const res = await getUserIssueSummary(userId);
      setUserStatic(res);
    } finally {
      setModalLoading(false);
    }
  };

  const removeUserFromProject = async (userId: string) => {
    try {
      if (project) {
        setLoading(true);
        const newMembers = project?.members.filter((item) => item._id !== userId);
        await updateProjectById(project?._id, { members: newMembers });
        setOpenAddMember(false);
        await getProjectDetail();
      }
    } finally {
      setLoading(false);
    }
  };
  const addUserToProject: FormProps['onFinish'] = async (values) => {
    try {
      if (project && project?.members) {
        setLoading(true);
        const newMembers = [...values.members, ...project.members];
        await updateProjectById(project?._id, { members: newMembers });
        setOpenAddMember(false);
        await getProjectDetail();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProjectDetail();
    getUserList();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ label: e.target.value });
  };

  return (
    <div className="px-5">
      <div className="flex justify-between items-center">
        <Input
          className="w-1/4"
          value={searchParams.get('label') || ''}
          onChange={handleSearchChange}
          suffix={<FaSearch className="text-primary" />}
        />
        <CircleButton
          title="Create new issue"
          type="primary"
          onClick={() => setOpenAddMember(true)}
          icon={<FaPlus />}
        />
      </div>
      <Table
        className="mt-3"
        dataSource={project?.members.filter((item) => item._id !== user.userInfo?._id)}
        loading={loading}
        pagination={{
          position: ['bottomCenter'],
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '30'],
        }}
        columns={[
          {
            title: 'No',
            key: 'no',
            width: '5%',
            //@ts-ignore
            render: (item, record, index) => <>{index + 1}</>,
          },
          {
            title: 'Firstname',
            dataIndex: 'firstname',
            key: 'firstname',
            align: 'center',
          },
          {
            title: 'Lastname',
            dataIndex: 'lastname',
            key: 'lastname',
            align: 'center',
          },
          {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            align: 'center',
          },
          {
            title: 'Role',
            key: 'role',
            align: 'center',
            render: () => <Tag color="blue">DEV</Tag>,
          },
          {
            title: 'Work rating',
            dataIndex: 'rating',
            key: 'workrating',
            align: 'center',
            render: (rating) => <Rate allowHalf disabled value={rating * 5} />,
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
                      onClick: () => {
                        setSelectedUser(record);
                        getUserStatic(record._id);
                      },
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
                            removeUserFromProject(record._id);
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
        title={<span className="text-xl font-bold text-secondary">Add new member</span>}
        centered
        open={openAddMember}
        onCancel={() => {
          form.resetFields();
          setOpenAddMember(false);
        }}
        confirmLoading={loading}
        okText="Add"
        onOk={form.submit}
      >
        <Form layout="vertical" requiredMark={false} form={form} onFinish={addUserToProject}>
          <Form.Item name="members" label={<span className="font-medium">Members</span>}>
            <Select
              className="w-full"
              showSearch
              mode="multiple"
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
        </Form>
      </Modal>

      <Modal
        title={<span className="text-xl font-bold text-secondary">Member detail</span>}
        centered
        open={Boolean(selectedUser)}
        onCancel={() => {
          form.resetFields();
          setSelectedUser(undefined);
        }}
        confirmLoading={loading}
        okText="Ok"
        onOk={form.submit}
      >
        {modalLoading ? (
          <div className="flex items-center justify-center">
            <Spin />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="bg-primary flex justify-center h-20 p-5 relative">
              <Avatar className="absolute" size={100} src={selectedUser?.profilePic} />
            </div>
            <Row className="flex items-center mt-15">
              <Col span={12}>
                <div>First name</div>
              </Col>
              <Col span={12}>
                <div>Last name</div>
              </Col>
              <Col span={12}>
                <div className="text-secondary"> {selectedUser?.firstname}</div>
              </Col>
              <Col span={12}>
                <div className="text-secondary"> {selectedUser?.lastname}</div>
              </Col>
            </Row>
            <Row className="flex items-center">
              <Col span={12}>
                <div>Email</div>
              </Col>
              <Col span={12}>
                <div>Rating</div>
              </Col>
              <Col span={12}>
                <div className="text-secondary"> {selectedUser?.email}</div>
              </Col>
              <Col span={12}>
                <div className="text-secondary font-bold">
                  <Rate allowHalf disabled value={userStatic?.rating! * 5} />
                </div>
              </Col>
            </Row>
            <Row className="flex items-center">
              <Col span={12}>
                <div>Issue complete on time</div>
              </Col>
              <Col span={12}>
                <div>Issue complete without feedback</div>
              </Col>
              <Col span={12}>
                <div className="text-secondary">{userStatic?.issuesCompletedOnTime}</div>
              </Col>{' '}
              <Col span={12}>
                <div className="text-secondary">{userStatic?.issuesCompletedWithoutFeedback}</div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};
