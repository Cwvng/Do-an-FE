import React, { useEffect } from 'react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  FormInstance,
  FormProps,
  Image,
  Input,
  Row,
  Select,
  SelectProps,
  Space,
  Tabs,
  Tag,
  theme,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import { FaLink } from 'react-icons/fa';
import { FaShareNodes } from 'react-icons/fa6';
import TextArea from 'antd/es/input/TextArea';
import { ChangesHistory } from './ChangesHistory.tsx';
import { Issue, UpdateIssueBody } from '../../../requests/types/issue.interface.ts';
import { getIssueDetailById, updateIssueById } from '../../../requests/issue.request.ts';
import { Priority, Status } from '../../../constants';
import { Id } from '../type.tsx';
import { PlusOutlined } from '@ant-design/icons';
import SkeletonInput from 'antd/es/skeleton/Input';
import SkeletonAvatar from 'antd/es/skeleton/Avatar';
import toast from 'react-hot-toast';
import { AppState, useDispatch, useSelector } from '../../../redux/store';
import { getProjectDetail } from '../../../redux/slices/user.slice.ts';
import moment from 'moment';
import { toCapitalize } from '../../../utils/project.util.ts';
interface IssueDetailProps {
  id: Id;
  isEdit: boolean;
  form: FormInstance<UpdateIssueBody>;
}
export const IssueDetail: React.FC<IssueDetailProps> = ({ id, isEdit, form }) => {
  const [issue, setIssue] = React.useState<Issue>();
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [fileList, setFileList] = React.useState<UploadFile[]>();
  const [options, setOptions] = React.useState<any[]>();

  const { token } = theme.useToken();
  const dispatch = useDispatch();
  const project = useSelector((app: AppState) => app.user.selectedProject);

  const getIssueDetail = async () => {
    try {
      if (id) {
        setLoading(true);
        const res = await getIssueDetailById(id);
        setIssue(res);
      }
    } finally {
      setLoading(false);
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
  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const submitForm: FormProps['onFinish'] = async (values) => {
    try {
      if (id) {
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
        if (values.subject) formData.append('subject', values.subject);
        if (values.dueDate) formData.append('dueDate', values.dueDate);

        await toast.promise(updateIssueById(id, formData), {
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

  if (!issue) return;
  return (
    <Form
      id="detailForm"
      form={form}
      onFinish={submitForm}
      className="max-h-full overflow-auto flex flex-row gap-20 "
    >
      <div className="basis-2/3 h-full">
        <h2 className="text-secondary">
          {loading ? <SkeletonInput className="w-2/3" size="small" active /> : issue?.label}
        </h2>
        {/*Upload file*/}
        <div className="flex gap-1">
          <Button icon={<FaShareNodes />} type="primary">
            Add a child issue
          </Button>
          <Button icon={<FaLink />} type="primary">
            Link issue
          </Button>
        </div>
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
        <h4 className="mt-3 mb-0 text-secondary">Description</h4>
        {isEdit ? (
          <Form.Item name="description" initialValue={issue?.description}>
            <TextArea autoSize />
          </Form.Item>
        ) : (
          <span>{issue?.description}</span>
        )}

        <h4 className="m-0 mt-3 text-secondary">Activity</h4>
        <Tabs
          className="h-[150px] w-full overflow-auto"
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
              children: 'Content of Tab Pane 2',
            },
          ]}
        />
      </div>

      <div className="basis-1/3 h-full">
        {isEdit ? (
          <Form.Item initialValue={issue?.status} name="status">
            <Select
              size="large"
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
          <Tag className="text-base" color={getStatusTagColor(issue?.status!)} key={issue?.status}>
            {toCapitalize(issue?.status!)}
          </Tag>
        )}
        <div className=" mt-3 border-1 border-border h-full w-full text-nowrap">
          <div className="border-b-1 border-border px-5 py-3 font-bold text-secondary">Detail</div>
          <div className="flex flex-col p-5 w-full mr-8 gap-3">
            <Row>
              <Col span={10} className="text-secondary mt-2 ">
                Assignee
              </Col>
              <Col span={14}>
                {isEdit ? (
                  <Form.Item name="assignee" className="m-0" initialValue={issue?.assignee?._id}>
                    <Select
                      className="w-full"
                      showSearch
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
                ) : (
                  <Space>
                    <img src={issue?.assignee?.profilePic} className="w-7" alt="avatar" />
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
                  <Form.Item className="m-0" name="dueDate" initialValue={moment(issue?.dueDate)}>
                    <DatePicker className="w-full" format="YYYY/MM/DD" />
                  </Form.Item>
                ) : (
                  <span>{moment(issue?.dueDate).calendar()}</span>
                )}
              </Col>
            </Row>
            <Row className="flex items-center">
              <Col span={10} className="text-secondary">
                Subject
              </Col>
              <Col span={14}>
                {loading ? (
                  <SkeletonInput size="small" active />
                ) : isEdit ? (
                  <Form.Item className="m-0" name="subject" initialValue={issue?.subject}>
                    <Input />
                  </Form.Item>
                ) : (
                  issue?.subject
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
                  issue?.priority
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
                    <img src={issue?.creator?.profilePic} className="w-7" alt="avatar" />
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
    </Form>
  );
};
