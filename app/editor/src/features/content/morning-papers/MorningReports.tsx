import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { useChannel, useContent } from 'store/hooks';
import { useContentStore } from 'store/slices';
import {
  Col,
  ContentTypeName,
  FlexboxTable,
  IContentModel,
  ITableInternalRow,
  ITablePage,
  ITableSort,
  Page,
  replaceQueryParams,
  Row,
  Show,
  useCombinedView,
} from 'tno-core';

import { useTab } from '..';
import { ContentForm } from '../form';
import { defaultPage } from '../list-view/constants';
import { IContentListAdvancedFilter } from '../list-view/interfaces';
import { ReportActions } from './components';
import { getColumns } from './constants';
import { IMorningReportsFilter } from './interfaces';
import { MorningReportsFilter } from './MorningReportsFilter';
import * as styled from './styled';
import { makeFilter } from './utils';

export interface IMorningReportsProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Provides a list view of print content to help select stories for the morning report.
 * @param props Component props.
 * @returns Component.
 */
export const MorningReports: React.FC<IMorningReportsProps> = (props) => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { combined, formType } = useCombinedView();
  const [
    { filterMorningReports: filter, filterMorningReportAdvanced: filterAdvanced, content },
    { findContent, storeFilterMorningReport },
  ] = useContent();
  const [, { addContent, updateContent }] = useContentStore();
  const initTab = useTab();

  const [contentId, setContentId] = React.useState(id);
  const [contentType, setContentType] = React.useState(formType ?? ContentTypeName.AudioVideo);

  const channel = useChannel<any>({
    onMessage: (ev) => {
      switch (ev.data.type) {
        case 'content':
          if (content?.items.some((i) => i.id === ev.data.message.id))
            updateContent([ev.data.message]);
          else addContent([ev.data.message]);
          break;
        case 'page':
          channel('page', content);
          break;
        case 'load':
          setContentId(ev.data.message.id.toString());
          break;
      }
    },
  });

  const [, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState<IContentModel[]>([]);

  const openTab = true; // TODO: Change to user preference and responsive in future.
  const columns = getColumns(openTab, initTab);

  const page = React.useMemo(
    () =>
      !!content
        ? new Page(content.page - 1, content.quantity, content?.items, content.total)
        : defaultPage,
    [content],
  );

  const fetch = React.useCallback(
    async (filter: IMorningReportsFilter & Partial<IContentListAdvancedFilter>) => {
      try {
        setLoading(true);
        const data = await findContent(
          makeFilter({
            ...filter,
          }),
        );
        return new Page(data.page - 1, data.quantity, data?.items, data.total);
      } catch (error) {
        // TODO: Handle error
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [findContent],
  );

  React.useEffect(() => {
    fetch({ ...filter, ...filterAdvanced });
    // Do not want to fetch when the advanced filter changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, fetch]);

  const handleRowClick = (row: ITableInternalRow<IContentModel>) => {
    setContentType(row.original.contentType);
    setContentId(row.original.id.toString());
    if (openTab) initTab(row.original.id);
    else navigate(`/morning/papers/combined/${row.original.id}${window.location.search}`);
  };

  const handleChangePage = React.useCallback(
    (page: ITablePage) => {
      if (filter.pageIndex !== page.pageIndex || filter.pageSize !== page.pageSize) {
        const newFilter = {
          ...filter,
          pageIndex: page.pageIndex,
          pageSize: page.pageSize ?? filter.pageSize,
        };
        storeFilterMorningReport(newFilter);
        replaceQueryParams(newFilter, { includeEmpty: false });
      }
    },
    [filter, storeFilterMorningReport],
  );

  const handleChangeSort = React.useCallback(
    (sort: ITableSort<IContentModel>[]) => {
      const sorts = sort.filter((s) => s.isSorted).map((s) => ({ id: s.id, desc: s.isSortedDesc }));
      storeFilterMorningReport({ ...filter, sort: sorts });
    },
    [filter, storeFilterMorningReport],
  );

  const handleSelectedRowsChanged = (row: ITableInternalRow<IContentModel>) => {
    if (row.isSelected) {
      setSelected(row.table.rows.filter((r) => r.isSelected).map((r) => r.original));
    } else {
      setSelected((selected) => selected.filter((r) => r.id !== row.original.id));
    }
  };

  return (
    <styled.MorningReports>
      <Col wrap="nowrap">
        <MorningReportsFilter onSearch={fetch} />
        <Row className="content-list">
          <FlexboxTable
            rowId="id"
            columns={columns}
            data={page.items}
            isMulti={true}
            manualPaging={true}
            pageIndex={filter.pageIndex}
            pageSize={filter.pageSize}
            pageCount={page.pageCount}
            showSort={true}
            activeRowId={contentId}
            onPageChange={handleChangePage}
            onSortChange={handleChangeSort}
            onRowClick={handleRowClick}
            onSelectedChanged={handleSelectedRowsChanged}
          />
        </Row>
        <ReportActions setLoading={setLoading} selected={selected} filter={filter} />
        <Show visible={combined}>
          <hr />
          <Row className="bottom-pane" id="bottom-pane">
            <ContentForm
              contentType={contentType}
              scrollToContent={false}
              combinedPath="/morning/papers/combined"
            />
          </Row>
        </Show>
      </Col>
    </styled.MorningReports>
  );
};
