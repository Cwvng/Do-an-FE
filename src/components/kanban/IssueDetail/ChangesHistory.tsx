import React from 'react';
import { Avatar, Tooltip } from 'antd';
import { IssueHistory } from '../../../requests/types/issue.interface';
import moment from 'moment/moment';
import { toCapitalize } from '../../../utils/project.util.ts';
import { Comment } from '@ant-design/compatible';

interface ChangesHistoryProps {
  history: IssueHistory[] | undefined;
}

export const ChangesHistory: React.FC<ChangesHistoryProps> = ({ history }) => {
  const sortedHistory = history?.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return (
    <div className="h-full">
      {sortedHistory?.map((item, index) => (
        <div key={index} className="flex gap-2 items-center mb-2">
          <Comment
            key={index}
            author={
              <a>
                {item.updatedBy.firstname} {item.updatedBy.lastname}
              </a>
            }
            avatar={<Avatar size="large" src={item.updatedBy.profilePic} alt="Profile Pic" />}
            content={
              <>
                {item.field === 'images' && (
                  <div>
                    Updated <span className="text-secondary font-bold">Images</span> at{' '}
                  </div>
                )}
                {item.field === 'dueDate' && (
                  <div className="truncate">
                    Changed <span className="text-secondary font-bold">Due date</span> from{' '}
                    <span className="text-secondary font-bold">
                      {moment(item.oldValue).format('DD/MM/YYYY')}
                    </span>{' '}
                    to{' '}
                    <span className="text-secondary font-bold">
                      {moment(item.newValue).format('DD/MM/YYYY')}
                    </span>{' '}
                  </div>
                )}
                {item.field === 'issue' && <div className="truncate">Create new issue</div>}
                {item.field === 'comment' && <div className="truncate">Posted new comment</div>}
                {!['dueDate', 'images', 'issue', 'comment'].includes(item.field) && (
                  <div className="truncate">
                    Changed{' '}
                    <span className="text-secondary font-bold">{toCapitalize(item.field)}</span>{' '}
                    from <span className="text-secondary font-bold">{item.oldValue}</span> to{' '}
                    <span className="text-secondary font-bold">{item.newValue}</span>{' '}
                  </div>
                )}
              </>
            }
            datetime={
              <Tooltip title={moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')}>
                <span>{moment(item.updatedAt).fromNow()}</span>
              </Tooltip>
            }
          />
        </div>
      ))}
    </div>
  );
};
