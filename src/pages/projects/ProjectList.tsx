import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Divider, Input, theme } from 'antd';
import { getAllProject } from '../../requests/project.request.ts';
import { Project } from '../../requests/types/project.interface.ts';
import { useNavigate } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Issue } from '../../requests/types/issue.interface.ts';
import { Loading } from '../../components/loading/Loading.tsx';
import { FaPlus, FaSearch } from 'react-icons/fa';

export const ProjectList: React.FC = () => {
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();
  const { token } = theme.useToken();

  const getProjectList = async () => {
    try {
      setLoading(true);
      const res = await getAllProject();
      setProjectList(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProjectList();
  }, []);

  const calculateIssueStatistics = (issues: Issue[]) => {
    const statusCount = {
      new: 0,
      in_progress: 0,
      waiting_review: 0,
      feedback: 0,
      done: 0,
      others: 0,
    };
    issues.forEach((issue) => {
      switch (issue.status) {
        case 'done':
          statusCount.done++;
          break;
        case 'in progress':
          statusCount.in_progress++;
          break;
        case 'waiting review':
          statusCount.waiting_review++;
          break;
        case 'feedback':
          statusCount.feedback++;
          break;
        case 'new':
          statusCount.new++;
          break;
        default:
          statusCount.others++;
          break;
      }
    });
    return Object.values(statusCount);
  };

  if (loading) return <Loading />;
  return (
    <div className="h-full flex flex-col bg-white p-5">
      <span className="text-secondary font-bold text-xl">Your project ({projectList.length})</span>
      <Divider className="mt-3" />
      <div>
        <Input className="w-1/3" size="large" suffix={<FaSearch className="text-primary" />} />
        <Button
          shape="circle"
          className="ml-3"
          title="Create new project"
          type="primary"
          icon={<FaPlus />}
        />
      </div>
      <div className="flex overflow-x-auto gap-5 p-1 mt-3">
        {projectList?.map((project, index) => {
          const issueData = calculateIssueStatistics(project.issues);

          return (
            <Card
              key={index}
              className="border-1 w-[500px] border-border shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:cursor-pointer"
              title={
                <div className="text-white flex items-center justify-between">
                  {project.name} ({new Date(project.createdAt).getFullYear()})
                  <Avatar.Group
                    maxCount={3}
                    maxStyle={{ color: token.colorError, backgroundColor: token.colorErrorBg }}
                  >
                    {project.members.map((member, index) => (
                      <Avatar key={index} src={member.profilePic} />
                    ))}
                  </Avatar.Group>
                </div>
              }
              onClick={() => navigate(`/projects/${project._id}`)}
            >
              <div className="flex flex-col items-center">
                <div>
                  {project.issues.length > 0 && (
                    <Doughnut
                      data={{
                        labels: [
                          'New',
                          'In progress',
                          'Waiting review',
                          'Feedback',
                          'Done',
                          'Others',
                        ],
                        datasets: [
                          {
                            data: issueData,
                            backgroundColor: [
                              token.colorInfoTextHover,
                              token.colorPrimary,
                              token.yellow4,
                              token.red4,
                              token.green4,
                              token.colorWarning,
                            ],
                            borderColor: [
                              token.colorInfoTextHover,
                              token.colorPrimary,
                              token.yellow4,
                              token.red4,
                              token.green4,
                              token.colorWarning,
                            ],
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            display: true,
                            position: 'right',
                          },
                        },
                      }}
                    />
                  )}
                </div>
                <div>
                  <div className="text-xs">
                    Project manager{' '}
                    <span className="text-secondary">
                      {project.projectManager.firstname} {project.projectManager.lastname} (
                      {project.projectManager.email})
                    </span>
                  </div>
                  <div className="text-xs">
                    Last update at{' '}
                    <span className="text-secondary">
                      {new Date(project.updatedAt).toDateString()},{' '}
                      {new Date(project.updatedAt).toLocaleTimeString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
