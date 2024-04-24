import React from 'react';
import { Avatar } from 'antd';

export const ActivityCard: React.FC = () => {
  return (
    <div className="flex gap-2 items-center">
      <Avatar src="https://i.pinimg.com/736x/b0/cd/e6/b0cde658985bd1a87b525592bf71da18.jpg" />
      <span className="text-secondary font-bold">User</span>
      created <span className="text-secondary font-bold">The issue</span>
      at <span className="text-secondary font-bold">11:12PM</span>
    </div>
  );
};
