import React from 'react';
import { Avatar } from 'antd';
import TextArea from 'antd/es/input/TextArea';

export const ChatContainer: React.FC = () => {
    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center border-b-1 border-border px-5 py-3 gap-3">
                <Avatar
                    size="large"
                    src="https://cdn.lazi.vn/storage/uploads/users/avatar/1632122203_lazi_519492.jpg"
                />
                <div className="flex flex-col">
                    <span className="text-lg">Username</span>
                    <span>🟢 Active now</span>
                </div>
            </div>
            <div className="bg-lightBg flex-1 flex flex-col justify-between p-5">
                <div>Message</div>
                <div>
                    <TextArea className="p-3" autoSize={{ minRows: 1, maxRows: 3 }} />
                </div>
            </div>
        </div>
    );
};
