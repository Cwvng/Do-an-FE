import React, { useEffect } from 'react';
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Form,
  FormProps,
  Image,
  Input,
  Progress,
  Row,
  Select,
  SelectProps,
  Space,
  Tabs,
  Tag,
  Tooltip,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { ChangesHistory } from './ChangesHistory.tsx';
import { Issue } from '../../../../requests/types/issue.interface.ts';
import { getIssueDetailById, updateIssueById } from '../../../../requests/issue.request.ts';
import { IssueType, Priority, Status } from '../../../../constants';
import { PlusOutlined } from '@ant-design/icons';
import SkeletonInput from 'antd/es/skeleton/Input';
import SkeletonAvatar from 'antd/es/skeleton/Avatar';
import toast from 'react-hot-toast';
import { AppState, useDispatch, useSelector } from '../../../../redux/store';
import { getProjectDetail } from '../../../../redux/slices/user.slice.ts';
import moment from 'moment';
import { getStatusTagColor, toCapitalize } from '../../../../utils/project.util.ts';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'antd/es/form/Form';
import { Loading } from '../../../../components/loading/Loading.tsx';
import { CommentList } from './CommentList.tsx';
import { LoggedTime } from './LoggedTime.tsx';
import axios from 'axios';
import { getSprintDetail } from '../../../../requests/sprint.request.ts';
import { SiTask } from 'react-icons/si';
import { FaBug } from 'react-icons/fa6';
import { TiFlowChildren } from 'react-icons/ti';

export const IssueDetail: React.FC = () => {
  const [issue, setIssue] = React.useState<Issue>();
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [detailLoading, setDetailLoading] = React.useState(false);
  const [fileList, setFileList] = React.useState<UploadFile[]>();
  const [options, setOptions] = React.useState<any[]>();
  const [isEdit, setIsEdit] = React.useState(false);
  const [prStatus, setPrStatus] = React.useState(404);

  const { issueId } = useParams();
  const navigate = useNavigate();
  const [form] = useForm();
  const dispatch = useDispatch();
  const project = useSelector((app: AppState) => app.user.selectedProject);

  const getIssueDetail = async () => {
    try {
      if (issueId) {
        setDetailLoading(true);
        const res = await getIssueDetailById(issueId);
        setIssue(res);
        const git = res?.pullRequest?.split('/');
        const status = await axios.get(
          `https://api.github.com/repos/${git?.[3]}/${git?.[4]}/pulls/${git?.[6]}/merge`,
        );
        setPrStatus(status.status);
      }
    } finally {
      setDetailLoading(false);
    }
  };

  const uploadImage: UploadProps['customRequest'] = async (options) => {
    const { onSuccess, onError, file } = options;

    try {
      //@ts-ignore
      onSuccess(file);
    } catch (error) {
      //@ts-ignore
      onError(error);
    }
  };

  const handleRemove: UploadProps['onRemove'] = (file) => {
    console.log('remove', file);
  };
  //handle upload image ui
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    console.log(fileList);
  };
  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const submitForm: FormProps['onFinish'] = async (values) => {
    try {
      if (issueId) {
        setLoading(true);
        const formData = new FormData();
        if (values.images && values.images.length > 0)
          values.images.forEach((image: any) => {
            formData.append('images', image.originFileObj);
          });
        if (values.description) formData.append('description', values.description);
        if (values.status) formData.append('status', values.status);
        if (values.assignee) formData.append('assignee', values.assignee);
        if (values.priority) formData.append('priority', values.priority);
        if (values.type) formData.append('type', values.type);
        if (values.dueDate) formData.append('dueDate', values.dueDate);
        if (values.label) formData.append('label', values.label);
        if (values.estimateTime) formData.append('estimateTime', values.estimateTime);
        if (values.pullRequest) formData.append('pullRequest', values.pullRequest);

        await toast.promise(updateIssueById(issueId, formData), {
          loading: 'Saving...',
          success: <span>Issue updated!</span>,
          error: <span>Could not save.</span>,
        });
        await getIssueDetail();
      }
      if (issue?.project) dispatch(getProjectDetail(issue?.project));
    } finally {
      setLoading(false);
    }
  };
  const getUserList = async () => {
    try {
      if (project?.activeSprint) {
        const userList: SelectProps['options'] = [];
        const res = await getSprintDetail(project.activeSprint);
        res?.members.forEach((item) => {
          userList.push({
            value: item._id,
            label: item.firstname + ' ' + item.lastname,
            emoji: item.profilePic,
            desc: item.email,
            rating: item.rating,
          });
        });
        setOptions(userList);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getIssueTypeColor = (type: IssueType) => {
    switch (type) {
      case IssueType.BUG:
        return 'orange-inverse';
      case IssueType.SUB_TASK:
        return 'geekblue-inverse';
      default:
        return 'blue-inverse';
    }
  };

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  useEffect(() => {
    getIssueDetail();
    getUserList();
  }, []);

  useEffect(() => {
    const files: UploadFile[] | undefined = issue?.images?.map((img, index) => ({
      uid: String(-index - 1),
      name: `image${index + 1}.png`,
      status: 'done',
      url: img,
    }));

    setFileList(files);
  }, [issue?.images]);

  if (detailLoading) return <Loading />;
  if (!issue) return;
  return (
    <div className="bg-white h-full flex flex-col p-5">
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
            title: (
              <span
                className="cursor-pointer"
                onClick={() => navigate(`/projects/${project?._id}/sprint`)}
              >
                {project?.name}
              </span>
            ),
          },
          {
            title: <span>{issue.label}</span>,
          },
        ]}
      ></Breadcrumb>
      <Form
        id="detailForm"
        form={form}
        onFinish={submitForm}
        className="flex-1 overflow-auto flex flex-row gap-5"
      >
        <div className="basis-2/3 h-full overflow-auto">
          <div className="flex flex-col">
            <h2 className="text-secondary m-0">
              {loading ? (
                <SkeletonInput className="w-2/3" size="small" active />
              ) : isEdit ? (
                <Form.Item className="m-0 w-1/3" name="label" initialValue={issue?.label}>
                  <Input />
                </Form.Item>
              ) : (
                <span className="break-words">{issue?.label}</span>
              )}
            </h2>
            <h4 className="mt-3 mb-0 text-secondary">Description</h4>
            {isEdit ? (
              <Form.Item name="description" initialValue={issue?.description}>
                <TextArea autoSize />
              </Form.Item>
            ) : (
              <span className="break-words pr-5">{issue?.description}</span>
            )}
            {/*Upload file*/}
            {/*<div className="flex gap-1">*/}
            {/*  <Button icon={<FaShareNodes />} type="primary">*/}
            {/*    Add a child issue*/}
            {/*  </Button>*/}
            {/*  <Button icon={<FaLink />} type="primary">*/}
            {/*    Link issue*/}
            {/*  </Button>*/}
            {/*</div>*/}
            <Form.Item
              className="mt-5"
              name="images"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList;
              }}
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                disabled={!isEdit}
                beforeUpload={(file) => {
                  console.log(file);
                }}
                onPreview={handlePreview}
                customRequest={uploadImage}
                onChange={handleChange}
                onRemove={handleRemove}
              >
                <PlusOutlined className="text-primary text-xl" />
              </Upload>
            </Form.Item>
            {previewImage && (
              <Image
                wrapperStyle={{ display: 'none' }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(''),
                }}
                src={previewImage}
              />
            )}

            <h4 className="m-0 mt-5 text-secondary">Activity</h4>
            <Tabs
              className="m-0"
              items={[
                {
                  key: '1',
                  label: 'Changes history',
                  children: (
                    <div>
                      <ChangesHistory history={issue.history} />
                    </div>
                  ),
                },
                {
                  key: '2',
                  label: 'Comment',
                  children: <CommentList />,
                },
                {
                  key: '3',
                  label: 'Logged time',
                  children: <LoggedTime issue={issue} onFinish={getIssueDetail} />,
                },
              ]}
            />
          </div>
        </div>

        <div className="basis-1/3 h-full flex flex-col justify-between">
          <div>
            {isEdit ? (
              <Form.Item className="m-0" initialValue={issue?.status} name="status">
                <Select
                  value={issue?.status}
                  className="w-30 min-w-max text-white"
                  options={[
                    { value: Status.NEW, label: 'New' },
                    { value: Status.IN_PROGRESS, label: 'In progress' },
                    { value: Status.WAITING_REVIEW, label: 'Waiting review' },
                    { value: Status.TESTING, label: 'Testing' },
                    { value: Status.FEEDBACK, label: 'Feedback' },
                    { value: Status.DONE, label: 'Done' },
                  ]}
                />
              </Form.Item>
            ) : (
              <Tag
                className="text-base"
                color={getStatusTagColor(issue?.status!)}
                key={issue?.status}
              >
                {toCapitalize(issue?.status!)}
              </Tag>
            )}
            <div className="mt-3 border-1 border-border h-full w-full text-nowrap rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
              <div className="border-b-1 border-border px-5 py-3 font-bold text-secondary">
                Detail
              </div>
              <div className="flex flex-col p-5 w-full mr-8 gap-3">
                <Row>
                  <Col span={10} className="text-secondary mt-2 ">
                    Assignee
                  </Col>
                  <Col span={14}>
                    {isEdit ? (
                      <Form.Item
                        name="assignee"
                        className="m-0"
                        initialValue={issue?.assignee?._id}
                      >
                        <Select
                          className="w-full"
                          showSearch
                          optionFilterProp="children"
                          filterOption={filterOption}
                          // @ts-ignore
                          options={options?.sort((a, b) => b.rating - a.rating)}
                          optionRender={(option) => (
                            <Space>
                              <Badge.Ribbon
                                text={(option.data.rating * 5).toFixed(2)}
                                placement="end"
                                color="yellow"
                              >
                                <Avatar
                                  shape="square"
                                  src={option.data.emoji}
                                  className="w-12 h-12"
                                  alt="avatar"
                                />
                              </Badge.Ribbon>
                              <div className="flex flex-col">
                                <span className="font-medium">{option.data.label}</span>
                                <span className="text-sm">{option.data.desc}</span>
                              </div>
                            </Space>
                          )}
                        />
                      </Form.Item>
                    ) : (
                      <Space>
                        <Avatar src={issue?.assignee?.profilePic} alt="avatar" />
                        <div className="flex flex-col">
                          {issue?.assignee?.firstname} {issue?.assignee?.lastname}
                        </div>
                      </Space>
                    )}
                  </Col>
                </Row>
                <Row className="flex items-center">
                  <Col span={10} className="text-secondary">
                    Due date
                  </Col>
                  <Col span={14}>
                    {loading ? (
                      <SkeletonInput size="small" active />
                    ) : isEdit ? (
                      <Form.Item
                        className="m-0"
                        name="dueDate"
                        initialValue={moment(issue?.dueDate)}
                      >
                        <DatePicker className="w-full" format="YYYY/MM/DD" />
                      </Form.Item>
                    ) : (
                      <span>{moment(issue?.dueDate).format('MM/DD/YYYY')}</span>
                    )}
                  </Col>
                </Row>
                <Row className="flex items-center">
                  <Col span={10} className="text-secondary">
                    Type
                  </Col>
                  <Col span={14}>
                    {loading ? (
                      <SkeletonInput size="small" active />
                    ) : isEdit ? (
                      <Form.Item className="m-0" name="type" initialValue={issue?.type}>
                        <Select
                          value={issue?.type}
                          className="w-full text-white"
                          options={[
                            { value: IssueType.TASK, label: 'Task' },
                            { value: IssueType.SUB_TASK, label: 'Subtask' },
                            { value: IssueType.BUG, label: 'Bug' },
                          ]}
                        />
                      </Form.Item>
                    ) : (
                      <Tag color={getIssueTypeColor(issue?.type!)}>
                        <div className="flex items-center gap-1">
                          {issue.type === IssueType.TASK && <SiTask />}
                          {issue.type === IssueType.SUB_TASK && <TiFlowChildren />}
                          {issue.type === IssueType.BUG && <FaBug />}

                          {toCapitalize(issue?.type!)}
                        </div>
                      </Tag>
                    )}
                  </Col>
                </Row>
                <Row className="flex ">
                  <Col span={10} className="text-secondary">
                    Parent task
                  </Col>
                  <Col span={14}>
                    {loading ? (
                      <SkeletonInput size="small" active />
                    ) : isEdit ? (
                      <Form.Item
                        className="m-0"
                        name="parentIssue"
                        initialValue={issue?.parentIssue}
                      >
                        <Input />
                      </Form.Item>
                    ) : (
                      <>{issue?.parentIssue}</>
                    )}
                  </Col>
                </Row>
                <Row className="flex ">
                  <Col span={10} className="text-secondary">
                    Pull request
                  </Col>
                  <Col span={14}>
                    {loading ? (
                      <SkeletonInput size="small" active />
                    ) : isEdit ? (
                      <Form.Item
                        className="m-0"
                        name="pullRequest"
                        initialValue={issue?.pullRequest}
                      >
                        <Input />
                      </Form.Item>
                    ) : (
                      <Link
                        className="text-primary w-full text-wrap"
                        to={issue?.pullRequest!}
                        target="_blank"
                      >
                        {issue?.pullRequest}
                      </Link>
                    )}
                  </Col>
                </Row>
                {issue.pullRequest && (
                  <Row className="flex items-center">
                    <Col span={10} className="text-secondary">
                      Pull request status
                    </Col>
                    <Col span={14}>
                      {loading ? (
                        <SkeletonInput size="small" active />
                      ) : (
                        <Tag color="blue">{prStatus === 404 ? 'Not merge' : 'Merged'}</Tag>
                      )}
                    </Col>
                  </Row>
                )}
                <Row className="flex items-center">
                  <Col span={10} className="text-secondary">
                    Estimate time
                  </Col>
                  <Col span={14}>
                    {loading ? (
                      <SkeletonInput size="small" active />
                    ) : issue.estimateTime ? (
                      <Progress
                        className="w-2/3"
                        percent={
                          (Math.round((issue.loggedTime! / issue.estimateTime) * 100) / 100) * 100
                        }
                        format={() => (
                          <Tooltip
                            title={issue.estimateTime! - issue.loggedTime! + ' days remaining'}
                            placement="bottom"
                          >
                            {issue.estimateTime! - issue.loggedTime!}h
                          </Tooltip>
                        )}
                      />
                    ) : isEdit ? (
                      <Form.Item className="m-0" name="estimateTime">
                        <Input min={0} type="number" addonAfter="hours" />
                      </Form.Item>
                    ) : (
                      <span className="text-gray-300">no estimated time</span>
                    )}
                  </Col>
                </Row>
                <Row className="flex items-center">
                  <Col span={10} className="text-secondary">
                    Priority
                  </Col>
                  <Col span={14}>
                    {loading ? (
                      <SkeletonInput size="small" active />
                    ) : isEdit ? (
                      <Form.Item className="m-0" initialValue={issue?.priority} name="priority">
                        <Select
                          value={issue?.priority}
                          className="w-full text-white"
                          options={[
                            { value: Priority.LOW, label: 'Low' },
                            { value: Priority.MEDIUM, label: 'Medium' },
                            { value: Priority.HIGH, label: 'High' },
                            { value: Priority.URGENT, label: 'Urgent' },
                          ]}
                        />
                      </Form.Item>
                    ) : (
                      <Tag color={getStatusTagColor(issue?.priority!)}>
                        {toCapitalize(issue?.priority!)}
                      </Tag>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col span={10} className="text-secondary">
                    Create by
                  </Col>
                  <Col span={14}>
                    {loading ? (
                      <SkeletonAvatar active />
                    ) : (
                      <Space>
                        <Avatar src={issue?.creator?.profilePic} alt="avatar" />
                        <div className="flex flex-col">
                          {issue?.creator?.firstname} {issue?.creator?.lastname}
                        </div>
                      </Space>
                    )}
                  </Col>
                </Row>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-1">
            <Button
              onClick={() => {
                if (isEdit) {
                  form.resetFields();
                  setIsEdit(false);
                } else navigate(-1);
              }}
            >
              {isEdit ? 'Cancel' : 'Close'}
            </Button>
            {isEdit ? (
              <Button
                type="primary"
                onClick={() => {
                  form.submit();
                  setIsEdit(false);
                }}
              >
                Save
              </Button>
            ) : (
              <Button type="primary" onClick={() => setIsEdit(true)}>
                Edit
              </Button>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};
