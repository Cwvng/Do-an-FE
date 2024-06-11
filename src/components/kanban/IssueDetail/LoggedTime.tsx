import React from 'react';
import { Avatar, Button, DatePicker, Input, message, Modal, Progress, Tooltip } from 'antd';
import { Issue } from '../../../requests/types/issue.interface.ts';
import { updateIssueById } from '../../../requests/issue.request.ts';
import moment from 'moment/moment';
import { Comment } from '@ant-design/compatible';

interface LoggedTimeProps {
  issue: Issue;
  onFinish: any;
}
export const LoggedTime: React.FC<LoggedTimeProps> = ({ issue, onFinish }) => {
  const [openLog, setOpenLog] = React.useState(false);
  const [newLoggedTime, setNewLoggedTime] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const updateLogTime = async () => {
    try {
      setLoading(true);
      await updateIssueById(issue._id!, { loggedTime: issue.loggedTime! + newLoggedTime });
      message.success('Updated successfully');
      await onFinish();
      setOpenLog(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {issue.loggedTime ? (
        <>
          {issue?.history?.map((item, index) => {
            if (item.field === 'loggedTime')
              return (
                <Comment
                  key={index}
                  author={
                    <a>
                      {item.updatedBy.firstname} {item.updatedBy.lastname}
                    </a>
                  }
                  avatar={<Avatar size="large" src={item.updatedBy?.profilePic} />}
                  content={
                    <p>
                      Logged <span className="text-secondary">{item.newValue} hours</span>
                    </p>
                  }
                  datetime={
                    <Tooltip title={moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')}>
                      <span>{moment(item.updatedAt).fromNow()}</span>
                    </Tooltip>
                  }
                />
              );
          })}
          <div className="flex justify-end">
            <Button onClick={() => setOpenLog(true)} type="primary">
              Logged time
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <img
            className="w-1/3"
            src="https://i.pinimg.com/originals/dd/3b/28/dd3b283e47743f60d0a2233523cd918d.png"
            alt=""
          />
          <Button onClick={() => setOpenLog(true)} type="primary">
            Logged time
          </Button>
        </div>
      )}
      <Modal
        title={<span className="text-xl font-bold text-secondary">Logged time</span>}
        centered
        open={openLog}
        onCancel={() => {
          setOpenLog(false);
        }}
        onOk={updateLogTime}
        okText="Save"
        confirmLoading={loading}
        cancelText="Close"
      >
        <div className="flex flex-col gap-3">
          <Progress
            percent={
              (Math.round(((newLoggedTime + issue.loggedTime!) / issue.estimateTime!) * 100) /
                100) *
              100
            }
          />
          <div>
            <span className="font-bold text-secondary">Time spent</span>
            <Input
              size="large"
              onChange={(e) => setNewLoggedTime(+e.target.value)}
              min={0}
              step={0.5}
              addonAfter="hours"
              max={issue.estimateTime! - issue.loggedTime!}
              type="number"
            />
          </div>
          <div>
            <span className="font-bold text-secondary">Date</span>
            <DatePicker size="large" className="w-full" format="YYYY/MM/DD" />
          </div>
        </div>
      </Modal>
    </>
  );
};
