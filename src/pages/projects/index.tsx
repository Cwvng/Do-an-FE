import React, { useEffect } from 'react';
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
  Tag,
  theme,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { MdPersonAdd } from 'react-icons/md';
import { KanbanBoard } from '../../components/kanban/KanbanBoard.tsx';
import { Loading } from '../../components/loading/Loading.tsx';
import { AppState, useDispatch, useSelector } from '../../redux/store';
import { getProjectDetail } from '../../redux/slices/user.slice.ts';
import { useForm } from 'antd/es/form/Form';
import { getAllOtherUsers } from '../../requests/user.request.ts';
import { updateProjectById } from '../../requests/project.request.ts';
import { Priority, Status } from '../../constants';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const project = useSelector((app: AppState) => app.user.selectedProject);
  const loading = useSelector((app: AppState) => app.user.isLoading);
  const user = useSelector((app: AppState) => app.user.userInfo);
  const [form] = useForm();

  const [addModal, setAddModal] = React.useState(false);
  const [options, setOptions] = React.useState<SelectProps['options']>([]);
  const [query, setQuery] = React.useState<string>();

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  const getStatusTagColor = (status: string): string => {
    switch (status) {
      case Status.DONE:
        return token.colorInfoTextHover;
      case Status.IN_PROGRESS:
        return token.colorPrimary;
      case Status.WAITING_REVIEW:
        return token.orange4;
      case Status.FEEDBACK:
        return token.red4;
      case Status.NEW:
        return token.green4;
      case Priority.LOW:
        return token.yellow4;
      case Priority.MEDIUM:
        return token.red4;
      case Priority.HIGH:
        return token.green4;
      case Priority.URGENT:
        return token.green4;
      default:
        return token.colorWarning;
    }
  };

  const getDueDateColor = (date: string) => {
    const today = new Date();
    const dueDate = new Date(date);
    return today > dueDate ? 'text-red-500' : '';
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

  const isProjectManager = () => {
    return project?.projectManager === user?._id;
  };

  useEffect(() => {
    if (id) dispatch(getProjectDetail(id));
    getUserList();
  }, []);

  if (loading) return <Loading />;
  return (
    <div className="bg-white h-full p-5">
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
        ]}
      ></Breadcrumb>
      <h2 className="mt-5 text-secondary">
        {isProjectManager() ? `Issues` : 'Assigned issues'} ({project?.issues.length})
      </h2>
      <div className="flex flex-row items-center max-w-100 gap-5 mt-5">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="large"
          suffix={<FaSearch className="text-primary" />}
        />
        <Avatar.Group
          maxCount={5}
          maxStyle={{ color: token.colorError, backgroundColor: token.colorErrorBg }}
        >
          {project?.members?.map((member) => <Avatar key={member._id} src={member.profilePic} />)}
        </Avatar.Group>
        {isProjectManager() && (
          <Button
            title="Add new members"
            type="primary"
            shape="circle"
            icon={<MdPersonAdd size="19" />}
            onClick={() => setAddModal(true)}
          />
        )}
      </div>
      {isProjectManager() ? (
        <Table
          className="mt-3"
          dataSource={project?.issues}
          columns={[
            {
              title: 'Id',
              dataIndex: '_id',
              key: 'id',
            },
            {
              title: 'Label',
              dataIndex: 'label',
              key: 'Label',
            },
            {
              title: 'Subject',
              dataIndex: 'subject',
              key: 'subject',
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
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
              render: (priority) => {
                const color = getStatusTagColor(priority);
                return (
                  <Tag color={color} key={priority}>
                    {priority?.toUpperCase()}
                  </Tag>
                );
              },
            },
            {
              title: 'Assignee',
              dataIndex: 'assignee',
              key: 'assignee',
            },
            {
              title: 'Due date',
              dataIndex: 'dueDate',
              key: 'dueDate',
              render: (date) => (
                <span className={getDueDateColor(date)} key={date}>
                  {new Date(date).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: 'numeric',
                  })}
                </span>
              ),
            },
          ]}
        />
      ) : (
        <div>{project?.issues && <KanbanBoard data={project.issues} />}</div>
      )}
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
