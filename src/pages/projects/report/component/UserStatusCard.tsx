import { Avatar, Rate, Spin } from 'antd';
import { Comment } from '@ant-design/compatible';
import React, { useEffect } from 'react';
import { User } from '../../../../requests/types/chat.interface.ts';
import { getUserIssueSummary } from '../../../../requests/user.request.ts';
import { ProjectSprint } from '../../../../requests/types/sprint.interface.ts';
import { UserIssueSummaryResponse } from '../../../../requests/types/user.interface.ts';

interface UserStatusCardProps {
  user: User;
  sprint: ProjectSprint;
}
export const UserStatusCard: React.FC<UserStatusCardProps> = ({ user, sprint }) => {
  const [loading, setLoading] = React.useState(false);
  const [summary, setSummary] = React.useState<UserIssueSummaryResponse>();
  const [totalDone, setTotalDone] = React.useState<number>();

  const getUserIssueSummaryDetail = async () => {
    try {
      setLoading(true);
      const res = await getUserIssueSummary(user._id, { sprintId: sprint._id });
      setSummary(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserIssueSummaryDetail();
    //@ts-ignore
    setTotalDone(sprint.issues.filter((item) => item.assignee === user._id).length);
  }, []);

  return (
    <>
      {loading ? (
        <Spin />
      ) : (
        <Comment
          className="shadow-md mb-2"
          author={
            <h3 className="font-bold m-0 text-secondary">{user.firstname + user.lastname}</h3>
          }
          avatar={<Avatar size="large" src={user.profilePic} />}
          content={
            <div className="flex justify-between p-2">
              <div className="flex flex-col justify-center text-gray w-1/2">
                <span>
                  Completed:<span className="text-primary"> {totalDone} </span>issues
                </span>
                <span> Issue completed:</span>
                <ul className="m-0">
                  <li>
                    <div>
                      On time:{' '}
                      <span className="text-primary">
                        {Math.round((summary?.issuesCompletedOnTime! / totalDone!) * 100)}%
                      </span>
                    </div>
                  </li>
                  <li>
                    Without feedback:{' '}
                    <span className="text-primary">
                      {Math.round((summary?.issuesCompletedWithoutFeedback! / totalDone!) * 100)}%
                    </span>
                  </li>
                </ul>
              </div>

              <Rate allowHalf disabled value={Math.round(summary?.rating! * 5)} />
            </div>
          }
        />
      )}
    </>
  );
};
