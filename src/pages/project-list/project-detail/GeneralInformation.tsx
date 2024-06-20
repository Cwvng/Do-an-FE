import { FaEdit } from 'react-icons/fa';
import {
  Avatar,
  Col,
  Divider,
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
  theme,
  Tooltip,
} from 'antd';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import { getProjectById, updateProjectById } from '../../../requests/project.request.ts';
import { AppState, useSelector } from '../../../redux/store';
import { useForm } from 'antd/es/form/Form';
import { getAllOtherUsers } from '../../../requests/user.request.ts';
import { getSprintDetail } from '../../../requests/sprint.request.ts';
import { ProjectSprint } from '../../../requests/types/sprint.interface.ts';
import { getRemainingDaysPercent } from '../../../utils/project.util.ts';
import { Status } from '../../../constants';
import { Project } from '../../../requests/types/project.interface.ts';

export const GeneralInformation: React.FC = () => {
  const [form] = useForm();
  const { id } = useParams();
  const { token } = theme.useToken();
  const user = useSelector((app: AppState) => app.user.userInfo);

  const [options, setOptions] = React.useState<SelectProps['options']>([]);
  const [isEdit, setIsEdit] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [activeSprint, setActiveSprint] = React.useState<ProjectSprint>();
  const [project, setProject] = React.useState<Project>();

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

  const getProjectDetail = async () => {
    try {
      if (id) {
        setLoading(true);
        const res = await getProjectById(id);
        setProject(res);
        const activeSprint = await getSprintDetail(res.activeSprint);
        setActiveSprint(activeSprint);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProjectDetail: FormProps['onFinish'] = async (values) => {
    try {
      setLoading(true);
      if (project?._id && id) {
        const index = values.members.findIndex((id: string) => id === user?._id);
        if (index < 0) values.members.push(user?._id);

        await updateProjectById(project?._id, values);
        await getProjectDetail();
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
    getProjectDetail();
  }, []);

  return (
    <div className="flex flex-row gap-10 h-ful">
      <div className="w-1/2 shadow-md p-5 rounded-lg">
        <div className="flex items-center justify-between">
          <h2 className="m-0 text-secondary">General information</h2>
          <FaEdit
            className="text-primary text-xl hover:cursor-pointer"
            title="Edit"
            onClick={() => setIsEdit(true)}
          />
        </div>
        <Divider />
        {loading ? (
          <Spin />
        ) : (
          <div className="mt-5  flex flex-col gap-3">
            <Row className="flex items-center">
              <Col span={24}>
                <div>Project name</div>
              </Col>
              <Col span={24}>
                <div className="text-secondary"> {project?.name}</div>
              </Col>
            </Row>
            <Row className="flex justify-between">
              <Col span={12}>
                <div>Project members</div>
              </Col>
              <Col span={12}>
                <div>Group chat</div>
              </Col>
              <Col span={12}>
                <Avatar.Group
                  maxCount={5}
                  maxStyle={{ color: token.colorError, backgroundColor: token.colorErrorBg }}
                >
                  {project?.members.map((member, index) => (
                    <Tooltip key={index} placement="top" color={'fff'} title={member.email}>
                      <Avatar src={member.profilePic} />
                    </Tooltip>
                  ))}
                </Avatar.Group>
              </Col>
              <Col span={12}>
                <Link to={`${import.meta.env.VITE_CLIENT}/messages`}>{project?.name}</Link>
              </Col>
            </Row>
            <Row className="flex justify-between">
              <Col span={12}>
                <div>Project manager</div>
              </Col>{' '}
              <Col span={12}>
                <div>Contact </div>
              </Col>
              <Col span={12}>
                <div className="text-secondary">
                  {project?.projectManager.firstname} {project?.projectManager.lastname}
                </div>
              </Col>
              <Col span={12}>
                <div className="text-secondary"> {project?.projectManager.email}</div>
              </Col>
            </Row>

            <Row className="flex justify-between">
              <Col span={12}>
                <div>Created at</div>
              </Col>{' '}
              <Col span={12}>
                <div>Last updated at </div>
              </Col>
              <Col span={12}>
                <div className="text-secondary">
                  {' '}
                  {moment(project?.createdAt).format('DD/MM/YYYY')}
                </div>
              </Col>
              <Col span={12}>
                <div className="text-secondary">
                  {moment(project?.updatedAt).format('DD/MM/YYYY')}
                </div>{' '}
              </Col>
            </Row>
          </div>
        )}
      </div>

      <div className="w-1/2 shadow-md p-5 rounded-lg">
        <div className="flex items-center justify-between">
          <h2 className="m-0 text-secondary">Project progress</h2>
        </div>
        <Divider />

        {loading ? (
          <Spin />
        ) : (
          <div className="mt-5  flex flex-col gap-3">
            <Row className="flex items-center">
              <Col span={12}>
                <div>Active sprint</div>
              </Col>
              <Col span={12}>
                <div>Sprint goal</div>
              </Col>
              <Col span={12}>
                <div className="text-secondary"> Sprint {activeSprint?.ordinary}</div>
              </Col>
              <Col span={12}>
                <div className="text-secondary">{activeSprint?.sprintGoal}</div>
              </Col>
            </Row>
            <Row className="flex items-center">
              <Col span={12}>
                <div>Start date</div>
              </Col>
              <Col span={12}>
                <div>End date</div>
              </Col>
              <Col span={12}>
                <div className="text-secondary">
                  {' '}
                  {moment(activeSprint?.startDate).format('DD/MM/YYYY')}
                </div>
              </Col>
              <Col span={12}>
                <div className="text-secondary">
                  {moment(activeSprint?.endDate).format('DD/MM/YYYY')}
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div>
                  Time{' '}
                  <span className="text-primary">
                    (Total{' '}
                    {moment(activeSprint?.endDate).diff(moment(activeSprint?.startDate), 'days')}{' '}
                    days)
                  </span>
                </div>
              </Col>
              <Col span={24}>
                <Progress
                  percent={getRemainingDaysPercent(activeSprint?.endDate!)}
                  strokeColor={{
                    '0%': token.colorPrimary,
                    '100%': '#87d068',
                  }}
                />{' '}
              </Col>
            </Row>{' '}
            <Row>
              <Col span={24}>
                <div>
                  Issue completion{' '}
                  <span className="text-primary">(Total {activeSprint?.issues.length} issues)</span>
                </div>
              </Col>
              <Col span={24}>
                <Progress
                  percent={Math.floor(
                    (activeSprint?.issues.filter((item) => item.status === Status.DONE).length! /
                      activeSprint?.issues.length!) *
                      100,
                  )}
                  strokeColor={{
                    '0%': token.colorPrimary,
                    '100%': '#87d068',
                  }}
                />
              </Col>
            </Row>
          </div>
        )}
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
            name: project?.name,
            members: project?.members.map((item) => ({
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
              filterOption={(input: string, option?: { label: string; value: string }) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
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
