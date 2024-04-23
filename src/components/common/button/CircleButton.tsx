import { Button, ButtonProps } from 'antd';
import React from 'react';

export const CircleButton: React.FC<ButtonProps> = (props) => {
    return <Button className="border-none shadow-none flex items-center justify-center" shape="circle" {...props} />;
};
