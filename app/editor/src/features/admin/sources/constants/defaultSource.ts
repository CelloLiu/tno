import { IDataSourceModel } from 'hooks/api-editor';

export const defaultSource: IDataSourceModel = {
  id: 0,
  name: '',
  code: '',
  description: '',
  enabled: false,
  dataLocationId: 0,
  mediaTypeId: 0,
  licenseId: 0,
  topic: '',
  connection: '',
  retryLimit: 0,
  failedAttempts: 0,
  actions: [],
  metrics: [],
  schedules: [],
};
