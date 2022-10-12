import { ContentStatusName, ContentTypeName, IContentModel } from '..';
import { mockLicenses, mockProducts, mockUsers } from '.';

export const mockContents: IContentModel[] = [
  {
    id: 1,
    status: ContentStatusName.Draft,
    contentType: ContentTypeName.Snippet,
    productId: mockProducts[0].id,
    product: mockProducts[0],
    licenseId: mockLicenses[0].id,
    license: mockLicenses[0],
    ownerId: mockUsers[0].id,
    owner: mockUsers[0],
    headline: 'test',
    otherSource: 'source',
    page: 'page',
    publishedOn: new Date().toISOString(),
    summary: '',
  },
  {
    id: 2,
    status: ContentStatusName.Draft,
    contentType: ContentTypeName.Snippet,
    productId: mockProducts[0].id,
    product: mockProducts[0],
    licenseId: mockLicenses[0].id,
    license: mockLicenses[0],
    ownerId: mockUsers[0].id,
    owner: mockUsers[0],
    headline: 'test',
    otherSource: 'source',
    page: 'page',
    publishedOn: new Date().toISOString(),
    summary: '',
  },
  {
    id: 3,
    status: ContentStatusName.Draft,
    contentType: ContentTypeName.Snippet,
    productId: mockProducts[0].id,
    product: mockProducts[0],
    licenseId: mockLicenses[0].id,
    license: mockLicenses[0],
    ownerId: mockUsers[0].id,
    owner: mockUsers[0],
    headline: 'test',
    otherSource: 'source',
    page: 'page',
    publishedOn: new Date().toISOString(),
    summary: '',
  },
  {
    id: 4,
    status: ContentStatusName.Draft,
    contentType: ContentTypeName.Snippet,
    productId: mockProducts[0].id,
    product: mockProducts[0],
    licenseId: mockLicenses[0].id,
    license: mockLicenses[0],
    ownerId: mockUsers[0].id,
    owner: mockUsers[0],
    headline: 'test',
    otherSource: 'source',
    page: 'page',
    publishedOn: new Date().toISOString(),
    summary: '',
  },
  {
    id: 5,
    status: ContentStatusName.Draft,
    contentType: ContentTypeName.Snippet,
    productId: mockProducts[0].id,
    product: mockProducts[0],
    licenseId: mockLicenses[0].id,
    license: mockLicenses[0],
    ownerId: mockUsers[0].id,
    owner: mockUsers[0],
    headline: 'test',
    otherSource: 'source',
    page: 'page',
    publishedOn: new Date().toISOString(),
    summary: '',
  },
  {
    id: 6,
    status: ContentStatusName.Draft,
    contentType: ContentTypeName.Snippet,
    productId: mockProducts[0].id,
    product: mockProducts[0],
    licenseId: mockLicenses[0].id,
    license: mockLicenses[0],
    ownerId: mockUsers[0].id,
    owner: mockUsers[0],
    headline: 'test',
    otherSource: 'source',
    page: 'page',
    publishedOn: new Date().toISOString(),
    summary: '',
  },
];
