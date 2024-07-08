import { Avatar, Rate } from 'antd';
import React from 'react';
import { User } from '../../../../requests/types/chat.interface.ts';
import moment from 'moment';
import { Link } from 'react-router-dom';

interface UserCardProps {
  user: User;
}
export const UserInfo: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="h-full w-1/5 flex flex-col items-center p-5 gap-2 shadow-lg">
      <Avatar size={150} src={user?.profilePic} />
      <div className="text-secondary text-lg font-bold">
        {user?.firstname} {user?.lastname}
      </div>
      <Rate allowHalf disabled value={user?.rating! * 5} />
      <div className="mt-3 flex flex-col gap-2">
        <div className="font-bold text-secondary">Email:</div>
        {user?.email}
        <div className="font-bold text-secondary">DoB: </div>
        {moment(user?.dob).format('DD/MM/YYYY')}
        <div className="font-bold text-secondary">Role: </div>
        Developer
        <div className="font-bold text-secondary">Github: </div>
        <Link className="text-primary" target="_blank" to={user?.github!}>
          {user?.github}
        </Link>
      </div>
    </div>
  );
};
