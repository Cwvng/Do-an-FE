import { Header } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Dropdown,
  Form,
  FormProps,
  GetProp,
  Input,
  message,
  Modal,
  Select,
  Upload,
  UploadProps,
} from 'antd';
import { setSelectedProject, updateUser, userLogout } from '../../redux/slices/user.slice';
import { removeAccessToken } from '../../utils/storage.util';
import React, { useEffect } from 'react';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { IoNotifications } from 'react-icons/io5';
import { AppState, useDispatch, useSelector } from '../../redux/store';
import { CircleButton } from '../../components/common/button/CircleButton';
import { useForm } from 'antd/es/form/Form';
import { updateUserInfo } from '../../requests/user.request.ts';
import { UploadOutlined } from '@ant-design/icons';
import { getAllProject } from '../../requests/project.request.ts';
import { Project } from '../../requests/types/project.interface.ts';
import { TiThMenu } from 'react-icons/ti';

interface AppHeaderProps {
  toggleSidebar: () => void;
}
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};
export const AppHeader: React.FC<AppHeaderProps> = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: AppState) => state.user);
  const navigate = useNavigate();
  const [form] = useForm();

  const [openProfile, setOpenProfile] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState<string | null>();
  const [projectList, setProjectList] = React.useState<Project[]>();

  const getProjectList = async () => {
    try {
      setLoading(true);
      const res = await getAllProject();
      setProjectList(res);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeAccessToken();
    dispatch(userLogout());
    navigate('/login');
  };

  const updateUserProfile: FormProps['onFinish'] = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      if (values.profilePic && values.profilePic.length > 0)
        values.profilePic.forEach((image: any) => {
          formData.append('profilePic', image.originFileObj);
        });
      if (values.firstname) formData.append('firstname', values.firstname);
      if (values.lastname) formData.append('lastname', values.lastname);

      const res = await updateUserInfo(formData);
      message.success('Updated successfully');
      dispatch(updateUser(res));
      setOpenProfile(false);
      setIsEdit(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProjectList();
    if (projectList && projectList.length > 0) dispatch(setSelectedProject(projectList[0]));
  }, []);

  return (
    <>
      <Header className="bg-primary flex flex-row items-center justify-between border-b border-border gap-2 px-4 h-12">
        <div className="flex gap-10 flex-row items-center">
          <Button
            className="border-none shadow-none bg-transparent"
            onClick={toggleSidebar}
            icon={<TiThMenu className="text-2xl font-bold text-white" />}
          />
          <h2 className="text-white hover:cursor-pointer" onClick={() => navigate('/')}>
            HUST Workspace
          </h2>
          <div className="w-[120px]">
            <Select
              className="w-full"
              showSearch
              allowClear
              defaultValue={projectList?.[0]?._id}
              optionFilterProp="children"
              filterOption={(input: string, option?: { label: string; value: string }) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              onSelect={(value) =>
                dispatch(
                  setSelectedProject(projectList?.filter((project) => project?._id === value)[0]!),
                )
              }
              onChange={(value) =>
                dispatch(
                  setSelectedProject(projectList?.filter((project) => project?._id === value)[0]!),
                )
              }
              options={projectList?.map((project) => ({
                value: project._id,
                label: project.name,
              }))}
              dropdownRender={(menu) => (
                <div>
                  {menu}
                  <Divider className="m-2" />
                  <Button
                    className="w-full text-start	"
                    type="primary"
                    onClick={() => navigate('/projects')}
                  >
                    Project list
                  </Button>
                </div>
              )}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Badge offset={[-5, 10]}>
            <CircleButton
              className="border-none bg-primary shadow-none"
              icon={<IoNotifications className="text-2xl text-white" />}
            ></CircleButton>
          </Badge>

          <Dropdown
            menu={{
              items: [
                {
                  key: 'username',
                  label: (
                    <span onClick={() => setOpenProfile(true)}>{user?.userInfo?.firstname}</span>
                  ),
                },
                {
                  key: 'logout',
                  label: <a onClick={handleLogout}>Logout</a>,
                  icon: <RiLogoutBoxRLine />,
                },
              ],
            }}
            trigger={['click']}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
          >
            <Button shape="circle" className="border-none bg-transparent	flex items-center px-0">
              <Avatar src={user.userInfo?.profilePic}></Avatar>
            </Button>
          </Dropdown>
        </div>
      </Header>
      <Modal
        title={<span className="text-xl font-bold text-secondary">Edit profile</span>}
        centered
        closable={false}
        className="w-1/3"
        open={openProfile}
        footer={
          isEdit
            ? [
                <Button
                  key="close"
                  onClick={() => {
                    setIsEdit(false);
                    setImageUrl(null);
                    setOpenProfile(false);
                  }}
                >
                  Close
                </Button>,
                <Button
                  key="cancel"
                  onClick={() => {
                    setIsEdit(false);
                  }}
                >
                  Cancel
                </Button>,
                <Button key="save" type="primary" loading={loading} onClick={() => form.submit()}>
                  Save
                </Button>,
              ]
            : [
                <Button
                  key="close"
                  onClick={() => {
                    setIsEdit(false);
                    setImageUrl(null);
                    setOpenProfile(false);
                  }}
                >
                  Close
                </Button>,
                <Button key="edit" type="primary" loading={loading} onClick={() => setIsEdit(true)}>
                  Edit
                </Button>,
              ]
        }
      >
        <div>
          <Divider className="m-0" />
          <Form layout="vertical" className="p-5" form={form} onFinish={updateUserProfile}>
            <div>
              <div className="flex items-center my-5">
                <div className="relative">
                  <Avatar
                    className={isEdit ? 'border-2 blur-[1px]' : 'border-2'}
                    size={100}
                    src={imageUrl || user.userInfo?.profilePic}
                  />
                  {isEdit && (
                    <Form.Item
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      name="profilePic"
                      getValueFromEvent={(e) => {
                        if (Array.isArray(e)) {
                          return e;
                        }
                        return e && e.fileList;
                      }}
                    >
                      <Upload
                        showUploadList={false}
                        beforeUpload={(file) => {
                          console.log(file);
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
                        onChange={(info) => {
                          if (info.file.status === 'uploading') {
                            setLoading(true);
                            return;
                          }
                          if (info.file.status === 'done') {
                            getBase64(info.file.originFileObj as FileType, (url) => {
                              setLoading(false);
                              setImageUrl(url);
                            });
                          }
                        }}
                        onRemove={(file) => {
                          console.log('remove', file);
                        }}
                      >
                        <CircleButton title="Upload avatar" icon={<UploadOutlined />} />
                      </Upload>
                    </Form.Item>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-5">
                  <div className="font-semibold text-primary text-xl">
                    {user.userInfo?.firstname} {user.userInfo?.lastname}
                  </div>
                  <div className="font-semibold">{user.userInfo?.email}</div>
                </div>
              </div>
              <Form.Item
                label={<span className="font-medium">Firstname</span>}
                name="firstname"
                initialValue={user.userInfo?.firstname}
              >
                <Input size="large" disabled={!isEdit} />
              </Form.Item>
              <Form.Item
                label={<span className="font-medium">Lastname</span>}
                name="lastname"
                initialValue={user.userInfo?.lastname}
              >
                <Input size="large" disabled={!isEdit} />
              </Form.Item>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};
