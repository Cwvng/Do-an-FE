import { Header } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Divider, Dropdown, Form, FormProps, Input, message, Modal } from 'antd';
import { updateUser, userLogout } from '../../redux/slices/user.slice';
import { removeAccessToken } from '../../utils/storage.util';
import React from 'react';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { IoIosMenu, IoMdSettings } from 'react-icons/io';
import { IoNotifications } from 'react-icons/io5';
import { AppState, useDispatch, useSelector } from '../../redux/store';
import { CircleButton } from '../../components/common/button/CircleButton';
import { useForm } from 'antd/es/form/Form';
import { updateUserInfo } from '../../requests/user.request.ts';

interface AppHeaderProps {
  toggleSidebar: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: AppState) => state.user);
  const navigate = useNavigate();
  const [form] = useForm();

  const [openProfile, setOpenProfile] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleLogout = () => {
    removeAccessToken();
    dispatch(userLogout());
    navigate('/login');
  };

  const updateUserProfile: FormProps['onFinish'] = async (values) => {
    try {
      setLoading(true);
      const res = await updateUserInfo(values);
      message.success('Updated successfully');
      dispatch(updateUser(res));
      setOpenProfile(false);
      setIsEdit(false);
    } finally {
      setLoading(false);
    }
  };

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
          <CircleButton
            icon={<IoNotifications className="text-2xl text-gray-700" />}
          ></CircleButton>
          <CircleButton icon={<IoMdSettings className="text-2xl text-gray-700" />}></CircleButton>
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
        open={openProfile}
        onCancel={() => setOpenProfile(false)}
        footer={[
          <Button key="2" onClick={() => setOpenProfile(false)}>
            Cancel
          </Button>,
          <Button
            key="1"
            type="primary"
            loading={loading}
            onClick={() => {
              if (isEdit) {
                form.submit();
              } else {
                setIsEdit(true);
              }
            }}
          >
            {isEdit ? 'Save' : 'Edit'}
          </Button>,
        ]}
      >
        <div>
          <Divider className="m-0" />
          <Form layout="vertical" className="p-5" form={form} onFinish={updateUserProfile}>
            <div>
              <div className="flex flex-col items-center justify-center my-5">
                <Avatar className="border-2" size={75} src={user.userInfo?.profilePic} />
                <div className="font-semibold">{user.userInfo?.email}</div>
              </div>
              <Form.Item
                label={<span className="font-medium">Firstname</span>}
                name="firstname"
                initialValue={user.userInfo?.firstname}
              >
                <Input disabled={!isEdit} />
              </Form.Item>
              <Form.Item
                label={<span className="font-medium">Lastname</span>}
                name="lastname"
                initialValue={user.userInfo?.lastname}
              >
                <Input disabled={!isEdit} />
              </Form.Item>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};
