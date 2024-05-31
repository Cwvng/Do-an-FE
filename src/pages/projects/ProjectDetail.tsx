import React, { useEffect } from 'react';
import {
  Avatar,
  Breadcrumb,
  Form,
  FormProps,
  Input,
  message,
  Modal,
  Select,
  SelectProps,
  Space,
  Tabs,
  theme,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { KanbanBoard } from '../../components/kanban/KanbanBoard.tsx';
import { Loading } from '../../components/loading/Loading.tsx';
import { AppState, useDispatch, useSelector } from '../../redux/store';
import { getProjectDetail } from '../../redux/slices/user.slice.ts';
import { useForm } from 'antd/es/form/Form';
import { getAllOtherUsers } from '../../requests/user.request.ts';
import { updateProjectById } from '../../requests/project.request.ts';
import { PMDashBoard } from './project-manager/PMDashBoard.tsx';
import { PMProjectList } from './project-manager/PMIssueList.tsx';
import { getIssueList } from '../../requests/issue.request.ts';
import { Issue } from '../../requests/types/issue.interface.ts';

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
  const [issueList, setIssueList] = React.useState<Issue[]>();
  const [issueLoading, setIssueLoading] = React.useState(false);
  const [options, setOptions] = React.useState<SelectProps['options']>([]);
  const [query, setQuery] = React.useState<string>();

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

  const getIssueListByProjectId = async () => {
    try {
      if (id) {
        setIssueLoading(true);
        const res = await getIssueList({ projectId: id });
        setIssueList(res);
      }
    } finally {
      setIssueLoading(false);
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
    return project?.projectManager._id === user?._id;
  };

  useEffect(() => {
    if (id) dispatch(getProjectDetail(id));
    getUserList();
    getIssueListByProjectId();
  }, []);

  if (!project) return;
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
        {!isProjectManager() && `Assigned issues (${project?.issues.length})`}
      </h2>
      <div className="flex flex-row items-center max-w-100 gap-5 mt-5">
        {!isProjectManager() && (
          <>
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
              {project?.members?.map((member) => (
                <Avatar key={member._id} src={member.profilePic} />
              ))}
            </Avatar.Group>
          </>
        )}
      </div>
      {isProjectManager() ? (
        loading ? (
          <Loading />
        ) : (
          <>
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  key: '1',
                  label: 'Dashboard',
                  children: <PMDashBoard project={project} />,
                },
                {
                  key: '2',
                  label: `Issues (${project?.issues.length})`,
                  children: (
                    <PMProjectList issueList={issueList!} onActionEnd={getIssueListByProjectId} />
                  ),
                },
              ]}
            />
          </>
        )
      ) : (
        <div>{issueList && <KanbanBoard data={issueList} loading={issueLoading} />}</div>
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
