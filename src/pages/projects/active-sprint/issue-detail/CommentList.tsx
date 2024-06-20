import React, { useEffect } from 'react';
import { Avatar, Button, Form, FormProps, message, Spin, Tooltip } from 'antd';
import { Comment } from '@ant-design/compatible';
import moment from 'moment';
import {
  CreateIssueCommentBody,
  IssueComment,
} from '../../../../requests/types/issue.interface.ts';
import { AppState, useSelector } from '../../../../redux/store';
import TextArea from 'antd/es/input/TextArea';
import { useForm } from 'antd/es/form/Form';
import { useParams } from 'react-router-dom';
import { createIssueComment, getIssueComment } from '../../../../requests/issue.request.ts';

export const CommentList: React.FC = () => {
  const user = useSelector((app: AppState) => app.user.userInfo);
  const [form] = useForm();
  const { issueId } = useParams();

  const [loading, setLoading] = React.useState(false);
  const [commentList, setCommentList] = React.useState<IssueComment[]>();

  const getIssueCommentList = async () => {
    try {
      if (issueId) {
        setLoading(true);
        const res = await getIssueComment(issueId);
        setCommentList(res);
      }
    } finally {
      setLoading(false);
    }
  };

  const createNewComment: FormProps['onFinish'] = async (values) => {
    try {
      if (issueId) {
        setLoading(true);
        const body: CreateIssueCommentBody = {
          content: values.content,
          sender: user?._id!,
        };
        await createIssueComment(issueId, body);
        await getIssueCommentList();
        form.resetFields();
        message.success('Created successfully');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getIssueCommentList();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center">
          <Spin />
        </div>
      ) : (
        <div>
          {commentList?.map((comment, index) => (
            <Comment
              key={index}
              author={<a>{comment.sender?.firstname + comment.sender?.lastname}</a>}
              avatar={<Avatar size="large" src={comment.sender?.profilePic} />}
              content={<p>{comment.content}</p>}
              datetime={
                <Tooltip title={moment(comment.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                  <span>{moment(comment.createdAt).fromNow()}</span>
                </Tooltip>
              }
            />
          ))}
          <Form form={form} className="flex gap-2 mr-3 mb-2" onFinish={createNewComment}>
            <Avatar size="large" src={user?.profilePic} />
            <div className="w-full">
              <div className="text-md text-secondary">Add a comment</div>
              <Form.Item className="m-0" name="content">
                <TextArea className="w-full" size="large" autoSize />
              </Form.Item>
              <div className="flex justify-end mt-1">
                <Button loading={loading} onClick={form.submit} type="primary">
                  Send
                </Button>
              </div>
            </div>
          </Form>
        </div>
      )}
    </>
  );
};
