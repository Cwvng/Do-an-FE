import React, { useEffect } from 'react';
import { getChatImagesList } from '../../../requests/message.request.ts';
import { Divider, Image } from 'antd';
import moment from 'moment';
import { useParams } from 'react-router-dom';

export const Attachment: React.FC = () => {
  const [imagesList, setImagesList] = React.useState<any[]>();
  const { id } = useParams();

  const getImagesList = async () => {
    try {
      if (id) {
        const res = await getChatImagesList(id);
        setImagesList(res);
      }
    } finally {
    }
  };

  useEffect(() => {
    getImagesList();
  }, [id]);

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
