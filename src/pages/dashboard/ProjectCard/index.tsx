import React from 'react';
import { Avatar, Card, Col, Row, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
interface ProjectCardProps {
  projectId: string;
}
export const ProjectCard: React.FC<ProjectCardProps> = ({ projectId }) => {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  return (
    <Card
      className="border-1 w-[280px] border-border shadow hover:cursor-pointer"
      title={<span className="text-white">Project {projectId}</span>}
      onClick={() => navigate(`/project/${projectId}`)}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-col w-full">
          <Row>
            <Col span={20} className="text-secondary">
              My open issues
            </Col>
            <Col span={4}>0</Col>
          </Row>
          <Row>
            <Col span={20} className="text-secondary">
              Closed issues
            </Col>
            <Col span={4}>10</Col>
          </Row>
        </div>
        <Avatar.Group
          maxCount={3}
          maxStyle={{ color: token.colorError, backgroundColor: token.colorErrorBg }}
        >
          <Avatar src="https://i.pinimg.com/736x/b0/cd/e6/b0cde658985bd1a87b525592bf71da18.jpg" />
          <Avatar src="https://i.pinimg.com/736x/b0/cd/e6/b0cde658985bd1a87b525592bf71da18.jpg" />
          <Avatar src="https://i.pinimg.com/736x/b0/cd/e6/b0cde658985bd1a87b525592bf71da18.jpg" />
          <Avatar src="https://i.pinimg.com/736x/b0/cd/e6/b0cde658985bd1a87b525592bf71da18.jpg" />
        </Avatar.Group>
      </div>
    </Card>
  );
};
