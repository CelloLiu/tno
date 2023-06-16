import { FormikTouched, setIn, setNestedObjectValues, useFormikContext } from 'formik';
import React from 'react';
import {
  Button,
  ButtonVariant,
  IIngestModel,
  IScheduleModel,
  ScheduleTypeName,
  useNamespace,
} from 'tno-core';
import { Col, Row } from 'tno-core/dist/components/flex';
import { GridTable } from 'tno-core/dist/components/grid-table';
import { ValidationError } from 'yup';

import { defaultSchedule } from '../constants';
import { ScheduleDaily } from '.';
import { columns } from './constants';
import * as styled from './styled';

interface IScheduleAdvancedProps {}

export const ScheduleAdvanced: React.FC<IScheduleAdvancedProps> = () => {
  const { values, setFieldValue, validateForm, setTouched } = useFormikContext<IIngestModel>();
  const { field } = useNamespace('schedules');

  const [index, setIndex] = React.useState<number>();
  const [schedule, setSchedule] = React.useState<IScheduleModel>();

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setFieldValue('schedules', [...values.schedules, defaultSchedule()]);
    setIndex(values.schedules.length);
  };

  const handleDone = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (index !== undefined) {
      try {
        // Mock what formik does on submit, values must be "touched" for validation to fire.
        const errors = await validateForm();
        if (Object.keys(errors).length === 0) {
          setIndex(undefined);
        } else {
          console.debug(errors);
          setTouched(setNestedObjectValues<FormikTouched<IIngestModel>>(errors, true));
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          error.inner.reduce((formError, innerError) => {
            return setIn(formError, field(innerError.path ?? '', index), innerError.message);
          }, {});
        }
      }
    }
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setFieldValue(
      `schedules`,
      values.schedules.filter((s, i) => i !== index),
    );
    setIndex(undefined);
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setFieldValue(`schedules.${index}`, schedule);
    setIndex(undefined);
  };

  return (
    <styled.ScheduleForm className="schedule">
      <GridTable
        className="schedules"
        columns={columns}
        data={values.schedules}
        onRowClick={(row) => {
          setIndex(index !== row.index ? row.index : undefined);
          setSchedule(values.schedules[row.index]);
        }}
        paging={{ pageSizeOptions: { show: false } }}
      />
      <Col className="actions">
        {index !== undefined && (
          <ScheduleDaily index={index} scheduleType={ScheduleTypeName.Advanced} />
        )}
        <Row alignItems="flex-end" style={{ marginLeft: 'auto' }}>
          {index === undefined && (
            <Button onClick={handleAdd} variant={ButtonVariant.secondary}>
              Add
            </Button>
          )}
          {index !== undefined && (
            <Button onClick={handleDone} variant={ButtonVariant.secondary}>
              Done
            </Button>
          )}
          {index !== undefined && (
            <Button variant={ButtonVariant.danger} onClick={handleRemove}>
              Remove
            </Button>
          )}
          {index !== undefined && values.schedules[index].id !== 0 && (
            <Button variant={ButtonVariant.secondary} onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </Row>
      </Col>
    </styled.ScheduleForm>
  );
};
