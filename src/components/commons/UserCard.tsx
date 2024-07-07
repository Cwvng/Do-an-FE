import { Avatar, Rate } from 'antd';
import React from 'react';
import { User } from '../../requests/types/chat.interface.ts';

interface UserCardProps {
  user: User;
}
export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="h-min w-1/5 flex flex-col items-center p-5 gap-2 shadow-md">
      <Avatar size={150} src={user?.profilePic} />
      <div className="text-secondary text-lg font-bold">
        {user?.firstname} {user?.lastname}
      </div>
      <Rate allowHalf disabled value={user?.rating! * 5} />
      <div className="mt-3 flex flex-col gap-2">
        <div>
          <span className="font-bold text-secondary">Email:</span> {user?.email}
        </div>
        <div>
          <span className="font-bold text-secondary">DoB:</span>
        </div>
        <div>
          <span className="font-bold text-secondary">Github:</span>
        </div>
        <div>
          <span className="font-bold text-secondary">Joined:</span>
        </div>
      </div>
    </div>
  );
};
