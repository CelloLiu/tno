import { IContentListFilter } from '../interfaces';
import { defaultPage } from './defaultPage';

export const defaultFilter: IContentListFilter = {
  pageIndex: defaultPage.pageIndex,
  pageSize: defaultPage.pageSize,
  printContent: false,
  includedInCategory: false,
  sourceId: 0,
  otherSource: '',
  productId: 0,
  ownerId: 0,
  userId: '',
  timeFrame: 0,
  onTicker: '',
  commentary: '',
  topStory: '',
  sort: [],
};
