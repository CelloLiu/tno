import React from 'react';
import { BiFirstPage, BiLastPage } from 'react-icons/bi';
import { useLocation, useSearchParams } from 'react-router-dom';

import { Button, ButtonVariant } from '../button';
import { Row } from '../flex';
import { Text } from '../form/text';
import { Show } from '../show';
import * as styled from './styled';

const QTY = 'qty';
export interface IPagerProps {
  /**
   * Page index position.
   */
  pageIndex: number;
  /**
   * Number of rows per page.
   */
  pageSize: number;
  /**
   * Total number of pages.
   */
  pageCount: number;
  /**
   * Manual control for page sizing
   */
  manualPageSize?: boolean;
  /**
   * Number of pages to show in pager.
   */
  pageLimit?: number;
  /**
   * Show paging group buttons.
   */
  showPageGroup?: boolean;
  /**
   * Can go to previous page.
   */
  canPreviousPage: boolean;
  /**
   * Can go to next page.
   */
  canNextPage: boolean;
  /**
   * An array of zero-based index integers corresponding to available pages in the table.
   */
  pageOptions: number[];
  gotoPage: (updater: number | ((pageIndex: number) => number)) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (pageSize: number) => void;
}

export const Pager: React.FC<IPagerProps> = ({
  pageIndex,
  pageSize,
  pageCount,
  pageLimit = 5,
  canPreviousPage,
  showPageGroup = false,
  canNextPage,
  pageOptions = [],
  gotoPage,
  nextPage,
  previousPage,
  setPageSize,
  manualPageSize,
}) => {
  const { search } = useLocation();
  let query = React.useMemo(() => new URLSearchParams(search), [search]);
  let [searchParams, setSearchParams] = useSearchParams(query);

  React.useEffect(() => {
    if (manualPageSize) {
      const qty = searchParams.get(QTY);
      const cachedQty = localStorage.getItem(QTY);

      if (!!qty && qty !== pageSize.toString()) {
        setPageSize(parseInt(qty));
      }

      if (!qty && !!cachedQty && cachedQty !== pageSize.toString()) {
        setPageSize(parseInt(cachedQty));
        setSearchParams({ ...searchParams, qty: cachedQty });
      }
    }
    // Extract quantity from URL or cookie the first time loading.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (manualPageSize) {
      const qty = searchParams.get(QTY);
      if (!!qty) {
        if (pageSize !== parseInt(qty)) setPageSize(parseInt(qty));
      }
    }
  }, [manualPageSize, pageSize, searchParams, setPageSize]);

  const rows = React.useCallback(() => {
    // TODO: Handle dynamic pageLimit.  Calculate center.
    let startIndex = 0;
    if (pageIndex <= 2) startIndex = 0;
    else if (pageIndex >= pageCount - 2)
      startIndex = pageCount - pageLimit < 0 ? 0 : pageCount - pageLimit;
    else startIndex = pageIndex - 2;

    const maxIndex =
      startIndex + pageLimit - 1 > pageCount - 1 ? pageCount - 1 : startIndex + pageLimit - 1;
    const endIndex = pageCount <= startIndex ? startIndex : maxIndex;

    const rows = [];
    if (pageOptions.length) {
      for (let i = startIndex; i <= endIndex; i++) {
        rows.push(
          <Button
            key={pageOptions[i]}
            variant={ButtonVariant.info}
            onClick={() => {
              gotoPage(i);
            }}
            disabled={pageIndex === pageOptions[i]}
            className={pageIndex === pageOptions[i] ? 'active' : ''}
          >
            {pageOptions[i] + 1}
          </Button>,
        );
      }
    }
    return rows;
  }, [pageIndex, pageCount, pageLimit, pageOptions, gotoPage]);

  return (
    <styled.Pager>
      <Row justifyContent="center" className="button-container">
        <Button
          name="firstPage"
          variant={ButtonVariant.info}
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          <BiFirstPage />
        </Button>
        {showPageGroup && (
          <Button
            name="previousPageGroup"
            variant={ButtonVariant.info}
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            ...
          </Button>
        )}
        {rows()}
        {showPageGroup && (
          <Button
            name="nextPageGroup"
            variant={ButtonVariant.info}
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            ...
          </Button>
        )}
        <Button
          name="lastPage"
          variant={ButtonVariant.info}
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          <BiLastPage />
        </Button>
        <Show visible={!!manualPageSize}>
          <Text
            className="page-size"
            tooltip="Choose page size"
            value={pageSize}
            type="number"
            name="pageSize"
            onChange={(e) => {
              if (Number(e.target.value) > 100) {
                setSearchParams({ ...searchParams, qty: e.target.value });
                localStorage.setItem('qty', e.target.value);
                setPageSize(100);
              }
              if (!!Number(e.target.value)) {
                setSearchParams({ ...searchParams, qty: e.target.value });
                localStorage.setItem('qty', e.target.value);
                setPageSize(Number(e.target.value));
              }
            }}
          />
        </Show>
      </Row>
    </styled.Pager>
  );
};
