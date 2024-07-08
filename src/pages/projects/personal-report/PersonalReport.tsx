import { Breadcrumb, Row, Spin } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState, useSelector } from '../../../redux/store';
import { UserInfo } from './components/UserInfo.tsx';
import { getUserIssueSummary } from '../../../requests/user.request.ts';
import { UserIssueSummaryResponse } from '../../../requests/types/user.interface.ts';
import { getIssueList } from '../../../requests/issue.request.ts';
import { Issue } from '../../../requests/types/issue.interface.ts';
import { Status } from '../../../constants';
import { GeneralReport } from './components/GeneralReport.tsx';
import { CompleteIssueReport } from './components/CompleteIssueReport.tsx';

export const PersonalReport: React.FC = () => {
  const navigate = useNavigate();
  const project = useSelector((app: AppState) => app.user.selectedProject!);
  const user = useSelector((app: AppState) => app.user.userInfo!);

  const [loading, setLoading] = React.useState(false);
  const [summary, setSummary] = React.useState<UserIssueSummaryResponse>();
  const [issueList, setIssueList] = React.useState<Issue[]>();
  const [doneIssueList, setDoneIssueList] = React.useState<Issue[]>();

  const getUserIssueSummaryDetail = async () => {
    try {
      if (user?._id) {
        setLoading(true);
        const res = await getUserIssueSummary(user._id, { sprintId: project?.activeSprint });
        setSummary(res);
      }
    } finally {
      setLoading(false);
    }
  };
  const getUserAssignedIssue = async () => {
    try {
      if (user?._id) {
        setLoading(true);
        const res = await getIssueList({ sprintId: project?.activeSprint, assignee: user._id });
        setIssueList(res);
        setDoneIssueList(res.filter((item) => item.status === Status.DONE));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserIssueSummaryDetail();
    getUserAssignedIssue();
  }, [project]);

  return (
    <div className="bg-white gap-3 flex flex-col p-5 h-full">
      <Row>
        <Breadcrumb
          items={[
            {
              title: (
                <span className="cursor-pointer" onClick={() => navigate('/projects')}>
                  Project
                </span>
              ),
            },
            {
              title: <span>{project?.name}</span>,
            },
            {
              title: <span className="font-bold text-primary">Personal Report</span>,
            },
          ]}
        />
      </Row>
      <Row className="flex flex-1 items-center justify-between">
        <div className="text-secondary text-2xl m-0 font-bold">Personal Report</div>
      </Row>
      {loading ? (
        <Spin />
      ) : (
        <div className="h-full flex gap-3">
          <UserInfo user={user!} />

          <GeneralReport summary={summary!} doneIssueList={doneIssueList!} issueList={issueList!} />

          <CompleteIssueReport
            summary={summary!}
            doneIssueList={doneIssueList!}
            issueList={issueList!}
          />
        </div>
      )}
    </div>
  );
};
