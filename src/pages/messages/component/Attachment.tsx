import React, { useEffect } from 'react';
import { AppState, useSelector } from '../../../redux/store';
import { getChatImagesList } from '../../../requests/message.request.ts';
import { Divider, Image } from 'antd';
import moment from 'moment';

export const Attachment: React.FC = () => {
  const selectedChat = useSelector((app: AppState) => app.user.selectedChat);

  const [imagesList, setImagesList] = React.useState<any[]>();

  const getImagesList = async () => {
    try {
      if (selectedChat) {
        const res = await getChatImagesList(selectedChat._id);
        setImagesList(res);
      }
    } finally {
    }
  };

  useEffect(() => {
    getImagesList();
  }, [selectedChat]);

  return (
    <div className="flex h-full flex-col ">
      <div className="flex flex-row  justify-between items-center border-b-1 border-border px-5 py-1">
        <h2 className="text-secondary ">Attachment</h2>
      </div>
      <div className="p-5 flex flex-col gap-2 overflow-auto">
        {imagesList && imagesList.length > 0 ? (
          <Image.PreviewGroup>
            {imagesList.map((img, index) => (
              <div key={index}>
                <div className="text-primary">{moment(img?.createdAt).calendar()}</div>
                <Image className="w-full max-h-min" src={img.image} />
                <Divider />
              </div>
            ))}
          </Image.PreviewGroup>
        ) : (
          <span>No attachments</span>
        )}
      </div>
    </div>
  );
};
