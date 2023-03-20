import { IScheduleModel, ScheduleMonthName, ScheduleTypeName, ScheduleWeekDayName } from 'tno-core';

export const defaultSchedule = (
  scheduleType: ScheduleTypeName,
): Omit<IScheduleModel, 'delayMS'> & { delayMS: number | '' } => ({
  id: 0,
  name: '',
  description: '',
  isEnabled: true,
  scheduleType: scheduleType,
  delayMS: '',
  runOnlyOnce: false,
  repeat: 0,
  runOnWeekDays: ScheduleWeekDayName.NA,
  runOnMonths: ScheduleMonthName.NA,
  dayOfMonth: 0,
});
