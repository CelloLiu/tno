import { IContentModel, IPage } from 'tno-core';

export const defaultPage: IPage<IContentModel> = {
  pageIndex: 0,
  pageSize: 50,
  pageCount: -1,
  items: [],
  total: 0,
};
