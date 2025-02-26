import { getIn, useFormikContext } from 'formik';
import { useNamespace } from 'hooks';
import { IIngestModel, ScheduleTypeName, ScheduleWeekDayName } from 'hooks/api-editor';
import React from 'react';
import {
  FieldSize,
  FormikCheckbox,
  FormikHidden,
  FormikStringEnumCheckbox,
  FormikText,
  FormikTextArea,
  FormikTimeInput,
} from 'tno-core';
import { Col, Row } from 'tno-core/dist/components/flex';

import { defaultSchedule } from '../constants';
import * as styled from './styled';

interface IScheduleDailyProps {
  index: number;
  scheduleType?: ScheduleTypeName;
}

export const ScheduleDaily: React.FC<IScheduleDailyProps> = ({
  index,
  scheduleType = ScheduleTypeName.Daily,
}) => {
  const { setFieldValue, values } = useFormikContext<IIngestModel>();
  const { field } = useNamespace('schedules', index);
  const delayMS = getIn(values, field('delayMS'), '');

  React.useEffect(() => {
    if (index >= values.schedules.length)
      setFieldValue(`schedules[${index}]`, defaultSchedule(scheduleType));
    else if (values.schedules[index].scheduleType !== scheduleType) {
      setFieldValue(`schedules[${index}]`, {
        ...values.schedules[index],
        scheduleType,
        startAt: '',
        stopAt: '',
        delayMS: '',
      });
    }
  }, [field, index, scheduleType, setFieldValue, values.schedules]);

  return (
    <styled.ScheduleForm className="schedule">
      <FormikHidden name={field('scheduleType')} value={scheduleType} />
      <Row>
        <Col grow={2}>
          <Row alignItems="center" nowrap>
            <FormikText label="Name" name={field('name')} required />
            <FormikCheckbox label="Enabled" name={field('isEnabled')} />
          </Row>
          <FormikTextArea label="Description" name={field('description')} />
          <Row nowrap className="timing">
            <p>Start the service at</p>
            <FormikTimeInput
              name={field('startAt')}
              value={getIn(values, field('startAt')) ?? ''}
              width="7em"
              onChange={(e: any) => setFieldValue(field('startAt'), e.target.value)}
              placeholder="HH:MM:SS"
              required
            />
            <p>and stop it at</p>
            <FormikTimeInput
              name={field('stopAt')}
              value={getIn(values, field('stopAt')) ?? ''}
              width="7em"
              onChange={(e: any) => setFieldValue(field('stopAt'), e.target.value)}
              placeholder="HH:MM:SS"
              required
            />
            <p>on the following days;</p>
          </Row>
          <Row>
            <FormikText
              name={field('delayMS')}
              label="Delay (seconds)"
              type="number"
              required
              width={FieldSize.Tiny}
              value={!!delayMS ? +delayMS / 1000 : ''}
              min={1}
              onChange={(e) => {
                const value = Number(e.target.value) * 1000;
                setFieldValue(field('delayMS'), value);
              }}
            />
            <p>Control how often the service will perform an action.</p>
          </Row>
        </Col>
        <Row>
          <label>Run On</label>
          <FormikStringEnumCheckbox<ScheduleWeekDayName>
            label="Monday"
            name={field('runOnWeekDays')}
            value={ScheduleWeekDayName.Monday}
          />
          <FormikStringEnumCheckbox<ScheduleWeekDayName>
            label="Tuesday"
            name={field('runOnWeekDays')}
            value={ScheduleWeekDayName.Tuesday}
          />
          <FormikStringEnumCheckbox<ScheduleWeekDayName>
            label="Wednesday"
            name={field('runOnWeekDays')}
            value={ScheduleWeekDayName.Wednesday}
          />
          <FormikStringEnumCheckbox<ScheduleWeekDayName>
            label="Thursday"
            name={field('runOnWeekDays')}
            value={ScheduleWeekDayName.Thursday}
          />
          <FormikStringEnumCheckbox<ScheduleWeekDayName>
            label="Friday"
            name={field('runOnWeekDays')}
            value={ScheduleWeekDayName.Friday}
          />
          <FormikStringEnumCheckbox<ScheduleWeekDayName>
            label="Saturday"
            name={field('runOnWeekDays')}
            value={ScheduleWeekDayName.Saturday}
          />
          <FormikStringEnumCheckbox<ScheduleWeekDayName>
            label="Sunday"
            name={field('runOnWeekDays')}
            value={ScheduleWeekDayName.Sunday}
          />
        </Row>
      </Row>
    </styled.ScheduleForm>
  );
};
