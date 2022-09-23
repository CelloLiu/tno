import { render, waitFor } from '@testing-library/react';
import { ContentStatusName, ContentTypeName } from 'hooks';
import { mockContent, TestWrapper } from 'test/utils';

import { ContentListView } from './ContentListView';

jest.mock('store', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

const mockUseLookups = [
  {
    products: [{ name: 'Product 1', id: 1 }],
    licenses: [{ name: 'License 1', id: 1 }],
    ingestTypes: [{ name: 'Ingest 1', id: 1 }],
    users: [{ name: 'user', id: 1, displayName: 'displayName', username: 'test' }],
  },
];

const mockUseContent = [
  {
    filter: {},
    filterAdvanced: {},
    content: {
      items: [
        {
          headline: 'test headline',
          owner: { displayName: 'user@idir', username: 'test@idir' },
          otherSource: 'TEST',
          createdOn: '2022-05-12T16:11:15.756251Z',
          contentType: ContentTypeName.Snippet,
          status: ContentStatusName.Publish,
          product: {
            name: 'News',
          },
          page: 'A32',
        },
      ],
      page: 1,
      total: 1,
      quantity: 10,
    },
    page: 1,
    total: 1,
    quantity: 10,
  },
  { findContent: () => Promise.resolve(mockContent), storeFilter: {} },
];

const mockUseApp = [
  {
    userInfo: '',
    requests: [],
  },
  { isUserReady: () => true },
];

jest.mock('store/hooks', () => ({
  useApp: () => mockUseApp,
  useContent: () => mockUseContent,
  useLookup: () => mockUseLookups,
}));

it('renders correctly...', async () => {
  const { container } = render(
    <TestWrapper>
      <ContentListView />
    </TestWrapper>,
  );
  // TODO: This snapshot isn't waiting for the `findContent` to resolve.
  await waitFor(() => expect(container).toMatchSnapshot());
});

it('displays username without idir tag', async () => {
  const { getByText, queryByText } = render(
    <TestWrapper>
      <ContentListView />
    </TestWrapper>,
  );
  await waitFor(() => {
    expect(getByText('user')).toBeInTheDocument();
    expect(queryByText('@idir')).toBeFalsy();
  });
});

it('displays the date in the correct format', async () => {
  const { getByText } = render(
    <TestWrapper>
      <ContentListView />
    </TestWrapper>,
  );
  await waitFor(() => expect(getByText('05/12/2022')).toBeInTheDocument());
});

it('displays the source', async () => {
  const { getByText } = render(
    <TestWrapper>
      <ContentListView />
    </TestWrapper>,
  );
  await waitFor(() => expect(getByText(/TEST/)).toBeInTheDocument());
});

it('displays the product', async () => {
  const { getByText } = render(
    <TestWrapper>
      <ContentListView />
    </TestWrapper>,
  );
  await waitFor(() => expect(getByText('News')).toBeInTheDocument());
});

it('displays the status', async () => {
  const { getByText } = render(
    <TestWrapper>
      <ContentListView />
    </TestWrapper>,
  );
  await waitFor(() => expect(getByText('Publish')).toBeInTheDocument());
});

it('displays the section/page', async () => {
  const { getByText } = render(
    <TestWrapper>
      <ContentListView />
    </TestWrapper>,
  );
  await waitFor(() => expect(getByText('A32')).toBeInTheDocument());
});
