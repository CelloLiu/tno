import { IContentListAdvancedFilter } from 'features/content/list-view/interfaces';
import { applySortBy, setTimeFrame } from 'features/content/list-view/utils';
import { IContentFilter } from 'tno-core';

import { IMorningReportsFilter } from '../interfaces';

/**
 * Creates a IContentFilter that can be passed to the API hook endpoint.
 * Cleans up the data to ensure it matches what is expected by the API.
 * @param filter Filter object
 * @returns new IContentFilter object.
 */
export const makeFilter = (
  filter: IMorningReportsFilter & Partial<IContentListAdvancedFilter>,
): IContentFilter => {
  const result: IContentFilter & Partial<IContentListAdvancedFilter> = {
    page: filter.pageIndex + 1,
    quantity: filter.pageSize,
    contentTypes: filter.contentTypes,
    ownerId: +filter.ownerId !== 0 ? +filter.ownerId : undefined,
    userId: +filter.userId !== 0 ? +filter.userId : undefined,
    hasTopic: filter.hasTopic ? true : undefined,
    includeHidden: filter.includeHidden,
    onlyHidden: filter.onlyHidden ? true : undefined,
    onlyPublished: filter.onlyPublished ? true : undefined,
    productIds: filter.productIds,
    sourceIds: filter.sourceIds,
    publishedStartOn: setTimeFrame(filter.timeFrame as number)?.toISOString(),
    actions: applyActions(filter),
    fieldType: filter.searchTerm?.trim() !== '' ? filter.fieldType : undefined,
    searchTerm: filter.searchTerm?.trim() !== '' ? filter.searchTerm?.trim() : undefined,
    sort: applySortBy(filter.sort),
    logicalOperator:
      filter.searchTerm !== '' && filter.logicalOperator !== ''
        ? filter.logicalOperator
        : undefined,
  };
  return result;
};

/**
 * Creates an array of actions from the provided filter information.
 * Cleans up the data to ensure it matches what is expected by the API.
 * @param filter Filter object
 * @returns An array of actions.
 */
const applyActions = (filter: IMorningReportsFilter) => {
  const actions = [];
  if (filter.onTicker) actions.push('On Ticker');
  if (filter.commentary) actions.push('Commentary');
  if (filter.topStory) actions.push('Top Story');
  return actions;
};
