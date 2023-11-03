import {
  IContentListAdvancedFilter,
  IContentListFilter,
} from 'features/content/list-view/interfaces';
import moment from 'moment';
import { IActionModel, IFilterSettingsModel } from 'tno-core';

import { getActionFilters } from './getActionFilter';

export const filterFormat = (
  filter: IContentListFilter & Partial<IContentListAdvancedFilter>,
  actions: IActionModel[],
) => {
  const settings: IFilterSettingsModel = {
    from: 0,
    size: 100,
    startDate: !!filter.startDate ? filter.startDate : undefined,
    endDate: filter.endDate
      ? filter.endDate
      : filter.startDate
      ? `${moment(filter.startDate).endOf('day')}`
      : undefined,
    searchUnpublished: filter.useUnpublished ?? false,
    inHeadline: filter.inHeadline ?? false,
    inByline: filter.inByline ?? false,
    sentiment: filter.sentiment ?? [],
    inStory: filter.inStory ?? false,
    sourceIds: filter.sourceIds ?? [],
    productIds: filter.productIds ?? [],
    topStory: filter.topStory ?? false,
    search: filter.searchTerm,
    seriesIds: [],
    contributorIds: [],
    actions: getActionFilters(filter, actions),
    contentTypes: filter.contentTypes,
    tags: [],
  };

  return settings;
};
