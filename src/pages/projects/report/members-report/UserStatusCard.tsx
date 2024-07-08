import { Avatar, Dropdown, Rate, Spin } from 'antd';
import React, { useEffect } from 'react';
import { User } from '../../../../requests/types/chat.interface.ts';
import { getUserIssueSummary } from '../../../../requests/user.request.ts';
import { ProjectSprint } from '../../../../requests/types/sprint.interface.ts';
import { UserIssueSummaryResponse } from '../../../../requests/types/user.interface.ts';
import { FaEllipsisV } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { createNewChat } from '../../../../requests/chat.request.ts';
import { AppState, useSelector } from '../../../../redux/store';

interface UserStatusCardProps {
  user: User;
  sprint: ProjectSprint;
}
export const UserStatusCard: React.FC<UserStatusCardProps> = ({ user, sprint }) => {
  const [loading, setLoading] = React.useState(false);
  const [chatLoading, setChatLoading] = React.useState(false);
  const [summary, setSummary] = React.useState<UserIssueSummaryResponse>();
  const [totalDone, setTotalDone] = React.useState<number>();

  const navigate = useNavigate();
  const userInfo = useSelector((app: AppState) => app.user.userInfo);

  const goToChat = async (userId: string) => {
    try {
      setChatLoading(true);
      await createNewChat({ userId: userId });
      navigate(`/messages/${userId}`);
    } finally {
      setChatLoading(false);
    }
  };

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
        <>
          <div className="h-min w-75 flex flex-col items-center p-5 gap-2 rounded-md shadow-md">
            <div className="flex w-full justify-end">
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'chat',
                      label: chatLoading ? <Spin /> : <span>Chat</span>,
                      onClick: () => goToChat(user._id),
                    },
                  ],
                }}
                trigger={['click']}
                placement="bottomRight"
                arrow={{ pointAtCenter: true }}
              >
                <FaEllipsisV className="text-secondary cursor-pointer" />
              </Dropdown>
            </div>
            <Avatar size={150} src={user?.profilePic} />
            <div className="text-secondary text-lg font-bold">
              {user?.firstname} {user?.lastname} {userInfo?._id === user._id && '<<Me>>'}
            </div>
            <Rate allowHalf disabled value={user?.rating! * 5} />
            <div className="mt-3 flex flex-col gap-2">
              <div>
                <span className="font-bold text-secondary">Email:</span> {user?.email}
              </div>
              <div>
                <span className="font-bold text-secondary ">Github:</span>{' '}
                <Link className="text-primary" target="_blank" to={user?.github!}>
                  {user?.github}
                </Link>
              </div>
              <div>
                <span className="font-bold text-secondary">Completed:</span>
                <span className="text-primary"> {totalDone} </span>issues
              </div>
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
          </div>
        </>
      )}
    </>
  );
};
