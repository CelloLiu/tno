import { Col, Row } from 'components/flex';
import { FieldSize, Text } from 'components/form';
import {
  FormikBitwiseCheckbox,
  FormikCheckbox,
  FormikHidden,
  FormikText,
  FormikTextArea,
} from 'components/formik';
import { useFormikContext } from 'formik';
import { useNamespace } from 'hooks';
import { IDataSourceModel, ScheduleType, WeekDays } from 'hooks/api-editor';
import React from 'react';

import { defaultSchedule } from '../constants';
import * as styled from './styled';

interface IScheduleContinuosProps {
  index: number;
}

export const ScheduleContinuos: React.FC<IScheduleContinuosProps> = ({ index }) => {
  const { values, setFieldValue } = useFormikContext<IDataSourceModel>();
  const { field } = useNamespace('schedules', index);

  const schedule = values.schedules.length > index ? values.schedules[index] : defaultSchedule;

  return (
    <styled.Schedule className="schedule">
      <p>A continuos schedule is for services that are required to run every X minutes.</p>
      <FormikHidden name={field('scheduleType')} value={ScheduleType.Repeating} />
      <Row alignItems="center" nowrap>
        <FormikText label="Name" name={field('name')} required />
        <FormikCheckbox label="Enabled" name={field('enabled')} />
      </Row>
      <FormikTextArea label="Description" name={field('description')} />
      <Row nowrap>
        <p>Run service every</p>
        <Text
          name={field('delayMS')}
          type="number"
          required
          width={FieldSize.Tiny}
          value={schedule.delayMS / 1000}
          min={1}
          onChange={(e) => {
            const value = Number(e.target.value) * 1000;
            setFieldValue(field('delayMS'), value);
          }}
        />
        <p>minutes on the following days;</p>
      </Row>
      <Col>
        <FormikBitwiseCheckbox
          label="Monday"
          name={field('runOnWeekDays')}
          value={WeekDays.Monday}
        />
        <FormikBitwiseCheckbox
          label="Tuesday"
          name={field('runOnWeekDays')}
          value={WeekDays.Tuesday}
        />
        <FormikBitwiseCheckbox
          label="Wednesday"
          name={field('runOnWeekDays')}
          value={WeekDays.Wednesday}
        />
        <FormikBitwiseCheckbox
          label="Thursday"
          name={field('runOnWeekDays')}
          value={WeekDays.Thursday}
        />
        <FormikBitwiseCheckbox
          label="Friday"
          name={field('runOnWeekDays')}
          value={WeekDays.Friday}
        />
        <FormikBitwiseCheckbox
          label="Saturday"
          name={field('runOnWeekDays')}
          value={WeekDays.Saturday}
        />
        <FormikBitwiseCheckbox
          label="Sunday"
          name={field('runOnWeekDays')}
          value={WeekDays.Sunday}
        />
      </Col>
    </styled.Schedule>
  );
};
