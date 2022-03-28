import { defaultEnvelope, extractResponseData, ILifecycleToasts } from 'tno-core';

import { ITonePoolModel, useApi } from '..';

/**
 * Common hook to make requests to the PIMS APi.
 * @returns CustomAxios object setup for the PIMS API.
 */
export const useApiTonePools = (
  options: {
    lifecycleToasts?: ILifecycleToasts;
    selector?: Function;
    envelope?: typeof defaultEnvelope;
    baseURL?: string;
  } = {},
) => {
  const api = useApi(options);

  return {
    getTonePools: () => {
      return extractResponseData<ITonePoolModel[]>(() => api.get(`/editor/tone/pools`));
    },
  };
};
