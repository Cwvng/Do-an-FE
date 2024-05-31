import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import React, { useEffect } from 'react';
import { Project } from '../../../requests/types/project.interface.ts';
import { Issue } from '../../../requests/types/issue.interface.ts';
import {
  Avatar,
  Col,
  Divider,
  Form,
  FormProps,
  Input,
  message,
  Modal,
  Row,
  Select,
  SelectProps,
  Space,
  theme,
} from 'antd';
import { FaEdit } from 'react-icons/fa';
import { getAllOtherUsers } from '../../../requests/user.request.ts';
import { useForm } from 'antd/es/form/Form';
import { updateProjectById } from '../../../requests/project.request.ts';
import { AppState, dispatch, useSelector } from '../../../redux/store';
import { getProjectDetail } from '../../../redux/slices/user.slice.ts';
import { useParams } from 'react-router-dom';

interface PMDashBoardProps {
  project: Project | null;
}
export const PMDashBoard: React.FC<PMDashBoardProps> = ({ project }) => {
  const { token } = theme.useToken();
  const [form] = useForm();
  const { id } = useParams();
  const user = useSelector((app: AppState) => app.user.userInfo);

  const [options, setOptions] = React.useState<SelectProps['options']>([]);
  const [isEdit, setIsEdit] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const calculateIssueStatistics = (issues: Issue[]) => {
    const statusCount = {
      new: 0,
      in_progress: 0,
      waiting_review: 0,
      feedback: 0,
      done: 0,
      others: 0,
    };
    issues.forEach((issue) => {
      switch (issue.status) {
        case 'done':
          statusCount.done++;
          break;
        case 'in progress':
          statusCount.in_progress++;
          break;
        case 'waiting review':
          statusCount.waiting_review++;
          break;
        case 'feedback':
          statusCount.feedback++;
          break;
        case 'new':
          statusCount.new++;
          break;
        default:
          statusCount.others++;
          break;
      }
    });
    return Object.values(statusCount);
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

  const updateProjectDetail: FormProps['onFinish'] = async (values) => {
    try {
      setLoading(true);
      if (project?._id && id) {
        const index = values.members.findIndex((id: string) => id === user?._id);
        if (index < 0) values.members.push(user?._id);

        await updateProjectById(project._id, values);
        dispatch(getProjectDetail(id));
        message.success('Updated successfully');
      }
    } finally {
      setLoading(false);
      form.resetFields();
      setIsEdit(false);
    }
  };

  useEffect(() => {
    getUserList();
  }, []);

  if (!project) return;
  return (
    <div className="flex flex-row gap-10 p-5">
      <div className="w-1/3 shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-5 rounded-lg">
        <div className="flex items-center justify-between">
          <h2 className="m-0 text-secondary">General information</h2>

          <FaEdit
            className="text-primary text-xl hover:cursor-pointer"
            title="Edit"
            onClick={() => setIsEdit(true)}
          />
        </div>
        <Divider />
        <div className="mt-5  flex flex-col gap-3">
          <Row className="flex items-center">
            <Col span={12}>
              <div>Project name</div>
            </Col>
            <Col span={12}>
              <div className="text-secondary"> {project.name}</div>
            </Col>
          </Row>
          <Row className="flex justify-between">
            <Col span={12}>
              <div>Project members</div>
            </Col>
            <Col span={12}>
              <Avatar.Group
                maxCount={3}
                maxStyle={{ color: token.colorError, backgroundColor: token.colorErrorBg }}
              >
                {project.members.map((member, index) => (
                  <Avatar key={index} src={member.profilePic} />
                ))}
              </Avatar.Group>
            </Col>
          </Row>
          <Row className="flex justify-between">
            <Col span={12}>
              <div>Project manager</div>
            </Col>
            <Col span={12}>
              <div className="text-secondary">
                {project.projectManager.firstname} {project.projectManager.lastname}
              </div>
            </Col>
          </Row>
          <Row className="flex justify-between">
            <Col span={12}>
              <div>Contact </div>
            </Col>
            <Col span={12}>
              <div className="text-secondary"> {project.projectManager.email}</div>
            </Col>
          </Row>
          <Row className="flex justify-between">
            <Col span={12}>
              <div>Created </div>
            </Col>
            <Col span={12}>
              <div className="text-secondary"> {new Date(project.updatedAt).toDateString()}</div>
            </Col>
          </Row>
          <Row className="flex justify-between">
            <Col span={12}>
              <div>Last updated at </div>
            </Col>
            <Col span={12}>
              <div className="text-secondary">
                {new Date(project.updatedAt).toDateString()},
                {new Date(project.updatedAt).toLocaleTimeString('vi-VN')}
              </div>{' '}
            </Col>
          </Row>
        </div>
      </div>

      <div className="w-1/3 shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-5 rounded-lg">
        <h2 className="m-0 text-secondary">Issues summary ({project?.issues.length})</h2>
        <Divider />
        <Doughnut
          data={{
            labels: ['New', 'In progress', 'Waiting review', 'Feedback', 'Done', 'Others'],
            datasets: [
              {
                data: calculateIssueStatistics(project.issues),
                backgroundColor: [
                  token.colorInfoTextHover,
                  token.colorPrimary,
                  token.yellow4,
                  token.red4,
                  token.green4,
                  token.colorWarning,
                ],
                borderColor: [
                  token.colorInfoTextHover,
                  token.colorPrimary,
                  token.yellow4,
                  token.red4,
                  token.green4,
                  token.colorWarning,
                ],
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'right',
              },
            },
          }}
        />
      </div>
      <Modal
        title={<span className="text-xl font-bold text-secondary">Update project detail</span>}
        centered
        open={isEdit}
        onCancel={() => {
          form.resetFields();
          setIsEdit(false);
        }}
        okText="Submit"
        confirmLoading={loading}
        onOk={form.submit}
      >
        <Form
          initialValues={{
            name: project.name,
            members: project.members.map((item) => ({
              value: item._id,
              label: item.firstname + ' ' + item.lastname,
              emoji: item.profilePic,
              desc: item.email,
            })),
          }}
          layout="vertical"
          requiredMark={false}
          form={form}
          onFinish={updateProjectDetail}
        >
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Group name is required',
              },
            ]}
            name="name"
            label={<span className="font-medium">Project name</span>}
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
