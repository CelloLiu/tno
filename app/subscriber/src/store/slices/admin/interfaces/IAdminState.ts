import { IUserListFilter } from 'features/admin/users/interfaces/IUserListFilter';
import { IWorkOrderListFilter } from 'features/admin/work-orders/interfaces/IWorkOrderListFilter';
import { IMinisterModel } from 'store/hooks/subscriber/interfaces/IMinisterModel';
import {
  IActionModel,
  IConnectionModel,
  IDataLocationModel,
  IFolderModel,
  IIngestModel,
  IIngestTypeModel,
  ILicenseModel,
  IPaged,
  IProductModel,
  ISeriesModel,
  ISourceModel,
  ISystemMessageModel,
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
  ministers: IMinisterModel[];
  ingestTypes: IIngestTypeModel[];
  folders: IFolderModel[];
  userFilter: IUserListFilter;
  users: IPaged<IUserModel>;
  topics: ITopicModel[];
  rules: ITopicScoreRuleModel[];
  tags: ITagModel[];
  systemMessages: ISystemMessageModel[];
  actions: IActionModel[];
  series: ISeriesModel[];
  licenses: ILicenseModel[];
  workOrderFilter: IWorkOrderListFilter;
  workOrders: IPaged<IWorkOrderModel>;
}
