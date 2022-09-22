import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserListFilter } from 'features/admin/users/interfaces/IUserListFilter';
import {
  IActionModel,
  ICategoryModel,
  IConnectionModel,
  IIngestModel,
  ILicenseModel,
  IMediaTypeModel,
  IPaged,
  IProductModel,
  ISeriesModel,
  ISourceModel,
  ITagModel,
  IUserModel,
} from 'hooks/api-editor';

import { IAdminState } from './interfaces';

export const initialAdminState: IAdminState = {
  sources: [],
  connections: [],
  products: [],
  ingests: [],
  mediaTypes: [],
  users: { page: 1, quantity: 10, items: [], total: 0 },
  categories: [],
  tags: [],
  actions: [],
  series: [],
  licenses: [],
  userFilter: {
    pageIndex: 0,
    pageSize: 10,
    sort: [],
  },
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState: initialAdminState,
  reducers: {
    storeSources(state: IAdminState, action: PayloadAction<ISourceModel[]>) {
      state.sources = action.payload;
    },
    storeIngests(state: IAdminState, action: PayloadAction<IIngestModel[]>) {
      state.ingests = action.payload;
    },
    storeConnections(state: IAdminState, action: PayloadAction<IConnectionModel[]>) {
      state.connections = action.payload;
    },
    storeProducts(state: IAdminState, action: PayloadAction<IProductModel[]>) {
      state.products = action.payload;
    },
    storeLicenses(state: IAdminState, action: PayloadAction<ILicenseModel[]>) {
      state.licenses = action.payload;
    },
    storeMediaTypes(state: IAdminState, action: PayloadAction<IMediaTypeModel[]>) {
      state.mediaTypes = action.payload;
    },
    storeUsers(state: IAdminState, action: PayloadAction<IPaged<IUserModel>>) {
      state.users = action.payload;
    },
    storeCategories(state: IAdminState, action: PayloadAction<ICategoryModel[]>) {
      state.categories = action.payload;
    },
    storeTags(state: IAdminState, action: PayloadAction<ITagModel[]>) {
      state.tags = action.payload;
    },
    storeActions(state: IAdminState, action: PayloadAction<IActionModel[]>) {
      state.actions = action.payload;
    },
    storeSeries(state: IAdminState, action: PayloadAction<ISeriesModel[]>) {
      state.series = action.payload;
    },
    storeUserFilter(state: IAdminState, action: PayloadAction<IUserListFilter>) {
      state.userFilter = action.payload;
    },
  },
});

export const {
  storeSources: storeAdminSources,
  storeConnections: storeAdminConnections,
  storeProducts: storeAdminProducts,
  storeLicenses: storeAdminLicenses,
  storeIngests: storeAdminIngests,
  storeMediaTypes: storeAdminMediaTypes,
  storeUsers: storeAdminUsers,
  storeCategories: storeAdminCategories,
  storeTags: storeAdminTags,
  storeActions: storeAdminActions,
  storeSeries: storeAdminSeries,
  storeUserFilter: storeAdminUserFilter,
} = adminSlice.actions;
