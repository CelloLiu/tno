import {
  ContentStatusName,
  ContentTypeName,
  IAuditColumnsModel,
  ILicenseModel,
  IProductModel,
  ISeriesModel,
  IUserModel,
} from '..';
import {
  IContentActionModel,
  IContentCategoryModel,
  IContentLabelModel,
  IContentLinkModel,
  IContentTagModel,
  IContentTonePoolModel,
  IFileReferenceModel,
  ITimeTrackingModel,
} from '.';

export interface IContentModel extends IAuditColumnsModel {
  id: number;
  status: ContentStatusName;
  contentType: ContentTypeName;
  licenseId: number;
  license?: ILicenseModel;
  sourceId?: number;
  source?: ISeriesModel;
  otherSource: string;
  productId: number;
  product?: IProductModel;
  seriesId?: number;
  series?: ISeriesModel;
  otherSeries?: string;
  ownerId?: number;
  owner?: IUserModel;
  headline: string;
  byline: string;
  uid?: string;
  edition: string;
  section: string;
  page: string;
  publishedOn: string;
  summary: string;
  body?: string;
  sourceUrl?: string;
  actions?: IContentActionModel[];
  tags?: IContentTagModel[];
  labels?: IContentLabelModel[];
  categories?: IContentCategoryModel[];
  tonePools?: IContentTonePoolModel[];
  timeTrackings?: ITimeTrackingModel[];
  fileReferences?: IFileReferenceModel[];
  links?: IContentLinkModel[];

  // React-Table Properties
  isSelected?: boolean;
}
