import { IUserListFilter } from 'features/admin/users/interfaces/IUserListFilter';
import { IWorkOrderListFilter } from 'features/admin/work-orders/interfaces/IWorkOrderListFilter';
import React from 'react';
import { ActionDelegate, useAppDispatch, useAppSelector } from 'store';
import { IMinisterModel } from 'store/hooks/subscriber/interfaces/IMinisterModel';
import {
  IActionModel,
  IAlertModel,
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

import {
  storeAdminActions,
  storeAdminAlerts,
  storeAdminConnections,
  storeAdminDataLocations,
  storeAdminIngests,
  storeAdminIngestTypes,
  storeAdminLicenses,
  storeAdminMinisters,
  storeAdminProducts,
  storeAdminSeries,
  storeAdminSources,
  storeAdminTags,
  storeAdminTopics,
  storeAdminTopicScoreRules,
  storeAdminUserFilter,
  storeAdminUsers,
  storeAdminWorkOrderFilter,
  storeAdminWorkOrders,
} from '.';
import { IAdminState } from './interfaces';

export interface IAdminProps {}

export interface IAdminStore {
  storeSources: (sources: ISourceModel[]) => void;
  storeConnections: (connections: IConnectionModel[]) => void;
  storeDataLocations: (dataLocations: IDataLocationModel[]) => void;
  storeProducts: (products: IProductModel[]) => void;
  storeLicenses: (licenses: ILicenseModel[]) => void;
  storeIngests: (ingests: IIngestModel[]) => void;
  storeIngestTypes: (ingestTypes: IIngestTypeModel[]) => void;
  storeTopics: (topics: ITopicModel[]) => void;
  storeTopicScoreRules: (rules: ITopicScoreRuleModel[]) => void;
  storeUserFilter: (filter: IUserListFilter) => void;
  storeUsers: (users: IPaged<IUserModel>) => void;
  storeTags: (tags: ITagModel[]) => void;
  storeAlerts: (alerts: IAlertModel[] | ActionDelegate<IAlertModel[]>) => void;
  storeActions: (actions: IActionModel[]) => void;
  storeSeries: (series: ISeriesModel[]) => void;
  storeWorkOrderFilter: (filter: IWorkOrderListFilter) => void;
  storeWorkOrders: (users: IPaged<IWorkOrderModel>) => void;
  storeMinisters: (ministers: IMinisterModel[]) => void;
}

export const useAdminStore = (props?: IAdminProps): [IAdminState, IAdminStore] => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((store) => store.admin);

  const controller = React.useMemo(
    () => ({
      storeSources: (sources: ISourceModel[]) => {
        dispatch(storeAdminSources(sources));
      },
      storeConnections: (connections: IConnectionModel[]) => {
        dispatch(storeAdminConnections(connections));
      },
      storeDataLocations: (dataLocations: IDataLocationModel[]) => {
        dispatch(storeAdminDataLocations(dataLocations));
      },
      storeProducts: (products: IProductModel[]) => {
        dispatch(storeAdminProducts(products));
      },
      storeLicenses: (licenses: ILicenseModel[]) => {
        dispatch(storeAdminLicenses(licenses));
      },
      storeIngests: (ingests: IIngestModel[]) => {
        dispatch(storeAdminIngests(ingests));
      },
      storeIngestTypes: (ingestTypes: IIngestTypeModel[]) => {
        dispatch(storeAdminIngestTypes(ingestTypes));
      },
      storeUserFilter: (filter: IUserListFilter) => {
        dispatch(storeAdminUserFilter(filter));
      },
      storeAlerts: (alerts: IAlertModel[] | ActionDelegate<IAlertModel[]>) => {
        if (typeof alerts === 'function') {
          dispatch(storeAdminAlerts(alerts(state.alerts)));
        } else dispatch(storeAdminAlerts(alerts));
      },
      storeUsers: (users: IPaged<IUserModel>) => {
        dispatch(storeAdminUsers(users));
      },
      storeTopics: (topics: ITopicModel[]) => {
        dispatch(storeAdminTopics(topics));
      },
      storeTopicScoreRules: (rules: ITopicScoreRuleModel[]) => {
        dispatch(storeAdminTopicScoreRules(rules));
      },
      storeTags: (tags: ITagModel[]) => {
        dispatch(storeAdminTags(tags));
      },
      storeMinisters: (ministers: IMinisterModel[]) => {
        dispatch(storeAdminMinisters(ministers));
      },
      storeActions: (actions: IActionModel[]) => {
        dispatch(storeAdminActions(actions));
      },
      storeSeries: (series: ISeriesModel[]) => {
        dispatch(storeAdminSeries(series));
      },
      storeWorkOrderFilter: (filter: IWorkOrderListFilter) => {
        dispatch(storeAdminWorkOrderFilter(filter));
      },
      storeWorkOrders: (workOrders: IPaged<IWorkOrderModel>) => {
        dispatch(storeAdminWorkOrders(workOrders));
      },
    }),
    [dispatch, state.alerts],
  );

  return [state, controller];
};
