import {
  Avatar,
  Col,
  DatePicker,
  Dropdown,
  Form,
  FormProps,
  Image,
  Input,
  message,
  Modal,
  Row,
  Select,
  SelectProps,
  Space,
  Table,
  Tag,
  Upload,
  UploadFile,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { Message, Priority, Status } from '../../../constants';
import { Issue } from '../../../requests/types/issue.interface.ts';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import { FaEllipsisV, FaPlus, FaSearch } from 'react-icons/fa';
import { createNewIssue, deleteIssueById, getIssueList } from '../../../requests/issue.request.ts';
import { CircleButton } from '../../../components/common/button/CircleButton.tsx';
import { getStatusTagColor, toCapitalize } from '../../../utils/project.util.ts';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'antd/es/form/Form';
import { getAllOtherUsers } from '../../../requests/user.request.ts';
import TextArea from 'antd/es/input/TextArea';

export const PMIssueList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [issueList, setIssueList] = useState<Issue[]>();
  const [openAddIssue, setOpenAddIssue] = React.useState(false);
  const [options, setOptions] = useState<SelectProps['options']>([]);
  const [fileList, setFileList] = React.useState<UploadFile[]>();
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState('');
  const [createLoading, setCreateLoading] = React.useState(false);

  const [form] = useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams();
  const navigate = useNavigate();

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
  const getDueDateColor = (date: string) => {
    const today = new Date();
    const dueDate = new Date(date);
    return today > dueDate ? 'text-red-500' : '';
  };

  const getIssueListByProjectId = async () => {
    try {
      if (id) {
        setLoading(true);
        const label = searchParams.get('label') || '';
        const res = await getIssueList({ projectId: id, label });
        setIssueList(res);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteIssue = async (id: string) => {
    try {
      setLoading(true);
      await deleteIssueById(id);
      await getIssueListByProjectId();
      message.success(Message.DELETED);
    } finally {
      setLoading(false);
    }
  };

  const createIssue: FormProps['onFinish'] = async (values) => {
    try {
      setCreateLoading(true);
      if (id) {
        const formData = new FormData();
        if (values.images && values.images.length > 0)
          values.images.forEach((image: any) => {
            formData.append('images', image.originFileObj);
          });
        formData.append('status', Status.NEW);
        formData.append('project', id);
        if (values.description) formData.append('description', values.description);
        if (values.assignee) formData.append('assignee', values.assignee);
        if (values.priority) formData.append('priority', values.priority);
        if (values.dueDate) formData.append('dueDate', values.dueDate);
        if (values.label) formData.append('label', values.label);
        await createNewIssue(formData);
        await getIssueListByProjectId();

        message.success('Created an issue');
        setOpenAddIssue(false);
        form.resetFields();
      }
    } finally {
      setCreateLoading(false);
    }
  };

  useEffect(() => {
    getIssueListByProjectId();
  }, [searchParams]);
  useEffect(() => {
    getUserList();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ label: e.target.value });
  };

  const handleSearchEnter = () => {
    getIssueListByProjectId();
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <Input
          size="large"
          className="w-1/4"
          value={searchParams.get('label') || ''}
          onChange={handleSearchChange}
          suffix={<FaSearch className="text-primary" onClick={handleSearchEnter} />}
          onPressEnter={handleSearchEnter}
        />
        <CircleButton
          title="Create new issue"
          type="primary"
          onClick={() => setOpenAddIssue(true)}
          icon={<FaPlus />}
        />
      </div>
      <Table
        className="mt-3"
        dataSource={issueList}
        loading={loading}
        pagination={{
          position: ['bottomCenter'],
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '30'],
        }}
        columns={[
          {
            title: 'Label',
            dataIndex: 'label',
            key: 'Label',
            render: (label, record) => (
              <Link to={`/projects/${id}/issue/${record._id}`}>{label}</Link>
            ),
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
            align: 'center',
            filters: Object.values(Status).map((status) => ({ text: status, value: status })),
            onFilter: (value, record) => record.status.indexOf(value) === 0,
            sorter: (a: any, b: any) => a.status.localeCompare(b.status),
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
            align: 'center',
            filters: Object.values(Priority).map((priority) => ({
              text: priority,
              value: priority,
            })),
            onFilter: (value, record) => record.priority.indexOf(value) === 0,
            sorter: (a, b) => a.priority.localeCompare(b.priority),
            render: (priority) => {
              const color = getStatusTagColor(priority);
              return (
                <span className={`text-${color}-500`} key={priority}>
                  {toCapitalize(priority)}
                </span>
              );
            },
          },
          {
            title: 'Assignee',
            dataIndex: 'assignee',
            key: 'assignee',
            render: (assignee) => (
              <>
                {assignee?.firstname} {assignee?.lastname}
              </>
            ),
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
                      onClick: () => navigate(`/projects/${id}/issue/${record._id}`),
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
                            deleteIssue(record._id);
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
        title={<span className="text-xl font-bold text-secondary">Create new issue</span>}
        centered
        open={openAddIssue}
        onCancel={() => {
          form.resetFields();
          setOpenAddIssue(false);
        }}
        okText="Submit"
        confirmLoading={createLoading}
        onOk={form.submit}
      >
        <Form layout="vertical" requiredMark={false} form={form} onFinish={createIssue}>
          <Row className="flex justify-between">
            <Col span={11}>
              <Form.Item name="label" label={<span className="font-medium">Label</span>}>
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item name="assignee" label={<span className="font-medium">Assignee</span>}>
                <Select
                  className="w-full"
                  showSearch
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
            </Col>
          </Row>
          <Row className="flex justify-between">
            <Col span={11}>
              <Form.Item name="priority" label={<span className="font-medium">Priority</span>}>
                <Select
                  size="large"
                  className="w-full text-white"
                  options={[
                    { value: Priority.LOW, label: 'Low' },
                    { value: Priority.MEDIUM, label: 'Medium' },
                    { value: Priority.HIGH, label: 'High' },
                    { value: Priority.URGENT, label: 'Urgent' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item name="dueDate" label={<span className="font-medium">Due date</span>}>
                <DatePicker size="large" className="w-full" format="YYYY/MM/DD" />
              </Form.Item>
            </Col>
          </Row>
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
              onPreview={async (file: UploadFile) => {
                setPreviewImage(file.url || (file.preview as string));
                setPreviewOpen(true);
              }}
              customRequest={async (options) => {
                const { onSuccess, onError, file } = options;

                try {
                  //@ts-ignore
                  onSuccess(file);
                } catch (error) {
                  //@ts-ignore
                  onError(error);
                }
              }}
              onChange={({ fileList: newFileList }) => {
                setFileList(newFileList);
                console.log(fileList);
              }}
              onRemove={(file) => {
                console.log('remove', file);
              }}
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
          <Row>
            <Col span={24}>
              <Form.Item
                name="description"
                label={<span className="font-medium">Description</span>}
              >
                <TextArea size="large" autoSize />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
