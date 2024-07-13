import { UserStatusCard } from './UserStatusCard.tsx';
import React from 'react';
import { ReportChartInterface } from '../utils.ts';

export const MembersReport: React.FC<ReportChartInterface> = ({ sprint }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-1 gap-4">
        {sprint?.members.map((item, index) => (
          <UserStatusCard key={index} user={item} sprint={sprint} />
        ))}
      </div>
    </div>
  );
};
