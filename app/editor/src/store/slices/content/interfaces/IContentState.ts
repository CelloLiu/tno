import {
  IContentListAdvancedFilter,
  IContentListFilter,
} from 'features/content/list-view/interfaces';
import { IMorningReportsFilter } from 'features/content/morning-papers/interfaces';
import { IContentModel, IPaged } from 'tno-core';

export interface IContentState {
  filter: IContentListFilter;
  filterAdvanced: IContentListAdvancedFilter;
  filterMorningReports: IMorningReportsFilter;
  filterMorningReportAdvanced: IContentListAdvancedFilter;
  content?: IPaged<IContentModel>;
}
