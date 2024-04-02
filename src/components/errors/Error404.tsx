import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';
import React from "react";

export const Error404: React.FC = () => (
    <Result
        status="404"
        title="Page not found"
        extra={
            <Link to="/">
                <Button type="primary">Back Home</Button>
            </Link>
        }
    />
);
