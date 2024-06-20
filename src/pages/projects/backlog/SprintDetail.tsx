import React, { useEffect } from 'react';
import { ProjectSprint } from '../../../requests/types/sprint.interface.ts';
import { getSprintDetail } from '../../../requests/sprint.request.ts';
import { Col, Divider, Progress, Row, Tag, theme } from 'antd';
import moment from 'moment';
import { getRemainingDaysPercent } from '../../../utils/project.util.ts';
import { Status } from '../../../constants';

interface SprintDetailProps {
  sprintId: string;
}
export const SprintDetail: React.FC<SprintDetailProps> = ({ sprintId }) => {
  const { token } = theme.useToken();

  const [sprint, setSprint] = React.useState<ProjectSprint>();

  const getSprintInfor = async () => {
    try {
      const res = await getSprintDetail(sprintId);
      setSprint(res);
    } finally {
    }
  };

  useEffect(() => {
    getSprintInfor();
  }, [sprintId]);

  useEffect(() => {
    getSprintInfor();
  }, []);

  return (
    <div className="flex flex-col gap-2 justify-between">
      <Divider className="m-1 mb-3" />
      <Row>
        <Col span={12} className="font-bold text-secondary">
          Ordinary
        </Col>
        <Col span={12} className="font-bold text-secondary">
          Sprint goal
        </Col>
        <Col span={12}>{sprint?.ordinary}</Col>
        <Col span={12}>{sprint?.sprintGoal}</Col>
      </Row>
      <Row>
        <Col span={12} className="font-bold text-secondary">
          Status
        </Col>
        <Col span={12} className="font-bold text-secondary">
          Total issues
        </Col>
        <Col span={12}>
          {sprint?.isActive ? <Tag color="green">Active</Tag> : <Tag>Inactive</Tag>}
        </Col>{' '}
        <Col span={12}>{sprint?.issues.length}</Col>
      </Row>
      <Row>
        <Col span={12} className="font-bold text-secondary">
          Start date
        </Col>
        <Col span={12} className="font-bold text-secondary">
          End date
        </Col>
        <Col span={12}>{moment(sprint?.startDate).format('DD/MM/YYYY')}</Col>
        <Col span={12}>{moment(sprint?.endDate).format('DD/MM/YYYY')}</Col>
      </Row>
      <Row>
        <Col span={24}>
          <div>
            Time{' '}
            <span className="text-primary">
              (Total {moment(sprint?.endDate).diff(moment(sprint?.startDate), 'days')} days)
            </span>
          </div>
        </Col>
        <Col span={24}>
          <Progress
            percent={getRemainingDaysPercent(sprint?.endDate!)}
            strokeColor={{
              '0%': token.colorPrimary,
              '100%': '#87d068',
            }}
          />{' '}
        </Col>
      </Row>{' '}
      <Row>
        <Col span={24}>
          <div>
            Issue completion{' '}
            <span className="text-primary">(Total {sprint?.issues.length} issues)</span>
          </div>
        </Col>
        <Col span={24}>
          <Progress
            percent={Math.floor(
              (sprint?.issues.filter((item) => item.status === Status.DONE).length! /
                sprint?.issues.length!) *
                100,
            )}
            strokeColor={{
              '0%': token.colorPrimary,
              '100%': '#87d068',
            }}
          />
        </Col>
      </Row>
    </div>
  );
};
