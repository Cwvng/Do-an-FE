import React from 'react';
import { Avatar } from 'antd';
import { IssueHistory } from '../../../requests/types/issue.interface';

interface ChangesHistoryProps {
  history: IssueHistory[];
}

export const ChangesHistory: React.FC<ChangesHistoryProps> = ({ history }) => {
  const sortedHistory = history.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return (
    <div className="h-full">
      {sortedHistory.map((item, index) => (
        <div key={index} className="flex  gap-2 items-center mb-2">
          <Avatar
            shape="square"
            src={
              item.updatedBy.profilePic ||
              'https://i.pinimg.com/736x/b0/cd/e6/b0cde658985bd1a87b525592bf71da18.jpg'
            }
          />
          <div className="flex flex-col">
            <span className="text-secondary font-bold">
              {item.updatedBy.firstname} {item.updatedBy.lastname}
            </span>
            {item.field === 'images' ? (
              <div>
                uploaded <span className="text-secondary font-bold">{item.field} </span>
                at{' '}
                <span className="text-secondary font-bold">
                  {new Date(item.updatedAt).toLocaleString()}
                </span>
              </div>
            ) : (
              <div className="truncate">
                updated <span className="text-secondary font-bold">{item.field} </span>
                from <span className="text-secondary font-bold">{item.oldValue} </span>
                to <span className="text-secondary font-bold">{item.newValue} </span>
                at{' '}
                <span className="text-secondary font-bold">
                  {new Date(item.updatedAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
