import { Tab, Tabs } from 'components/tabs';
import React from 'react';
import { Outlet } from 'react-router-dom';

import * as styled from './styled';

interface IScheduleProps {}

export const Schedule: React.FC<IScheduleProps> = () => {
  return (
    <styled.Schedule className="schedule" flex="1">
      <h2>Schedule</h2>
      <Tabs
        tabs={
          <>
            <Tab exact navigateTo="schedules/continuos" label="Continuos" />
            <Tab exact navigateTo="schedules/daily" label="Start/Stop" />
            <Tab exact navigateTo="schedules/advanced" label="Advanced" />
          </>
        }
      >
        <Outlet />
      </Tabs>
    </styled.Schedule>
  );
};
