import { IUserListFilter } from 'features/admin/users/interfaces/IUserListFilter';
import { IWorkOrderListFilter } from 'features/admin/work-orders/interfaces/IWorkOrderListFilter';
import {
  IActionModel,
  IConnectionModel,
  IDataLocationModel,
  IIngestModel,
  IIngestTypeModel,
  ILicenseModel,
  IPaged,
  IProductModel,
  ISeriesModel,
  ISourceModel,
  ITagModel,
  ITopicModel,
  ITopicScoreRuleModel,
  IUserModel,
  IWorkOrderModel,
} from 'tno-core';

export interface IAdminState {
  sources: ISourceModel[];
  connections: IConnectionModel[];
  dataLocations: IDataLocationModel[];
  products: IProductModel[];
  ingests: IIngestModel[];
  ingestTypes: IIngestTypeModel[];
  userFilter: IUserListFilter;
  users: IPaged<IUserModel>;
  topics: ITopicModel[];
  rules: ITopicScoreRuleModel[];
  tags: ITagModel[];
  actions: IActionModel[];
  series: ISeriesModel[];
  licenses: ILicenseModel[];
  workOrderFilter: IWorkOrderListFilter;
  workOrders: IPaged<IWorkOrderModel>;
}
