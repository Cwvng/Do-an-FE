import React, { useEffect } from 'react';
import {
  Button,
  Col,
  Form,
  FormProps,
  Image,
  Row,
  Select,
  SelectProps,
  Space,
  Tabs,
  TabsProps,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import { FaLink } from 'react-icons/fa';
import { FaShareNodes } from 'react-icons/fa6';
import TextArea from 'antd/es/input/TextArea';
import { ActivityCard } from './ActivityCard.tsx';
import { Issue } from '../../../requests/types/issue.interface.ts';
import { getIssueDetailById, updateIssueById } from '../../../requests/issue.request.ts';
import { Status } from '../../../constants';
import { Id } from '../type.tsx';
import { PlusOutlined } from '@ant-design/icons';
import SkeletonInput from 'antd/es/skeleton/Input';
import SkeletonAvatar from 'antd/es/skeleton/Avatar';
import { useForm } from 'antd/es/form/Form';
import toast from 'react-hot-toast';
import { AppState, useDispatch, useSelector } from '../../../redux/store';
import { getProjectDetail } from '../../../redux/slices/user.slice.ts';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'All',
    children: (
      <>
        <ActivityCard />
      </>
    ),
  },
  {
    key: '2',
    label: 'Comment',
    children: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    label: 'History',
    children: 'Content of Tab Pane 3',
  },
];
interface IssueDetailProps {
  id: Id;
}
export const IssueDetail: React.FC<IssueDetailProps> = ({ id }) => {
  const [issue, setIssue] = React.useState<Issue>();
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [fileList, setFileList] = React.useState<UploadFile[]>();
  const [options, setOptions] = React.useState<any[]>();

  const [form] = useForm();
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
  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const submitForm: FormProps['onFinish'] = async (values) => {
    try {
      if (id) {
        const formData = new FormData();
        if (values.images && values.images.length > 0)
          values.images.forEach((image: any) => {
            formData.append('images', image.originFileObj);
          });
        if (values.description) formData.append('description', values.description);
        if (values.status) formData.append('status', values.status);
        if (values.assignee) formData.append('assignee', values.assignee);

        await toast.promise(updateIssueById(id, formData), {
          loading: 'Saving...',
          success: <span>Issue updated!</span>,
          error: <span>Could not save.</span>,
        });
        await getIssueDetail();
      }
      if (issue?.project) dispatch(getProjectDetail(issue?.project));
    } finally {
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
        <Form.Item name="description" initialValue={issue?.description}>
          <TextArea autoSize />
        </Form.Item>

        <h4 className="m-0 mt-3 text-secondary">Activity</h4>
        <Tabs className="my-0" items={items} />
      </div>

      <div className="basis-1/3 h-full">
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
        <div className=" mt-3 border-1 border-border h-full w-full text-nowrap">
          <div className="border-b-1 border-border px-5 py-3 font-bold text-secondary">Detail</div>
          <div className="flex flex-col p-5 gap-3 " onClick={() => setEditMode(true)}>
            <Row>
              <Col span={10} className="text-secondary mt-2 ">
                Assignee
              </Col>
              <Col span={14}>
                {editMode ? (
                  <Form.Item name="assignee" initialValue={issue?.assignee?._id}>
                    <Select
                      className="w-full"
                      showSearch
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
            <Row>
              <Col span={10} className="text-secondary">
                Due date
              </Col>
              <Col span={14}>
                {loading ? (
                  <SkeletonInput size="small" active />
                ) : (
                  // @ts-ignore
                  new Date(issue?.dueDate).toLocaleString('vi-VN')
                )}
              </Col>
            </Row>
            <Row>
              <Col span={10} className="text-secondary">
                Subject
              </Col>
              <Col span={14}>
                {loading ? <SkeletonInput size="small" active /> : issue?.subject}
              </Col>
            </Row>
            <Row>
              <Col span={10} className="text-secondary">
                Priority
              </Col>
              <Col span={14}>
                {loading ? <SkeletonInput size="small" active /> : issue?.priority}
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
