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
  Upload,
  UploadProps,
} from 'antd';
import { updateUser, userLogout } from '../../redux/slices/user.slice';
import { removeAccessToken } from '../../utils/storage.util';
import React, { useEffect } from 'react';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { IoIosMenu } from 'react-icons/io';
import { IoNotifications } from 'react-icons/io5';
import { AppState, useDispatch, useSelector } from '../../redux/store';
import { CircleButton } from '../../components/common/button/CircleButton';
import { useForm } from 'antd/es/form/Form';
import { updateUserInfo } from '../../requests/user.request.ts';
import { UploadOutlined } from '@ant-design/icons';
import { useNotificationContext } from '../../context/NotificationContext.tsx';
import { useSocketContext } from '../../context/SocketContext.tsx';

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
  const { notification, setNotification } = useNotificationContext();
  const { socket } = useSocketContext();

  const [openProfile, setOpenProfile] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState<string | null>();

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
  //@ts-ignore
  useEffect(() => {
    socket?.on('newMessage', (newMessage) => {
      newMessage.shouldShake = true;
      if (!notification.includes(newMessage)) setNotification([newMessage, ...notification]);
    });

    return () => socket?.off('newMessage');
  }, [socket, notification]);

  return (
    <>
      <Header className="bg-white flex flex-row items-center justify-between border-b border-border gap-2 px-4 h-12">
        <div className="flex gap-10 flex-row items-center">
          <Button
            className="border-none bg-transparent"
            onClick={toggleSidebar}
            icon={<IoIosMenu className="text-2xl text-gray-700" />}
          />
          <h2 className="text-secondary hover:cursor-pointer" onClick={() => navigate('/')}>
            HUST Workspace
          </h2>
        </div>
        <div className="flex gap-3">
          <Badge count={notification.length} offset={[-5, 10]}>
            <Dropdown
              menu={{
                items: notification.map((noti, index) => ({
                  key: `notification-${index}`,
                  label: (
                    <div>
                      ✉️ You have a new message from{' '}
                      <span className="text-secondary font-bold">
                        {noti.chat.users[0].firstname + ' ' + noti.chat.users[0].lastname}
                      </span>
                    </div>
                  ),
                  onClick: () => navigate('/messages'),
                })),
              }}
              trigger={['click']}
              placement="bottomRight"
              arrow={{ pointAtCenter: true }}
            >
              <CircleButton
                className="border-none shadow-none"
                icon={<IoNotifications className="text-2xl text-gray-700" />}
              ></CircleButton>
            </Dropdown>
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
