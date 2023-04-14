import React from 'react';
import { BiFirstPage, BiLastPage, BiSkipNext, BiSkipPrevious } from 'react-icons/bi';

import { Button, ButtonVariant } from '../button';
import { Text } from '../form';
import { ITableInternal } from '.';

export interface ITablePagerProps<T extends object> {
  /** The table */
  table: ITableInternal<T>;
}

/**
 * Provides a table pager component to control changing a page.
 * @param param0 Component properties.
 * @returns Component.
 */
export const TablePager = <T extends object>({ table }: ITablePagerProps<T>) => {
  const [pageSize, setPageSize] = React.useState(table.pageSize);

  const pageButtons = table.pageButtons >= table.pageCount ? table.pageCount : table.pageButtons;
  const pageMiddleIndex = Math.round((pageButtons - 1) / 2);
  const startIndex =
    table.pageIndex - pageMiddleIndex <= 0
      ? 0
      : table.pageIndex - pageMiddleIndex + pageButtons > table.pageCount
      ? table.pageCount - table.pageButtons
      : table.pageIndex - pageMiddleIndex;
  const buttons = pageButtons > 0 ? [...Array(pageButtons)] : [];

  React.useEffect(() => {
    if (table.pageSize !== pageSize) setPageSize(table.pageSize);
    // We only want to update when the parent changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.pageSize]);

  return !table.showPaging ? (
    <></>
  ) : (
    <div className="pager">
      <div className="pages">
        Page {table.pageNumber()} of {table.pageCount}
      </div>
      <div className="buttons">
        <Button
          variant={ButtonVariant.info}
          tooltip="First"
          disabled={table.pageIndex === 0}
          onClick={() => {
            table.goFirst();
          }}
        >
          <BiFirstPage />
        </Button>
        <Button
          variant={ButtonVariant.info}
          tooltip="Previous"
          disabled={!table.canPrevious()}
          onClick={() => {
            table.goPrevious();
          }}
        >
          <BiSkipPrevious />
        </Button>
        {buttons.map((_, index) => {
          var pageIndex = startIndex + index;
          if (pageIndex < table.pageCount) {
            return (
              <Button
                key={index}
                variant={ButtonVariant.info}
                disabled={table.pageIndex === pageIndex}
                onClick={() => {
                  table.goToPageIndex(pageIndex);
                }}
              >
                {pageIndex + 1}
              </Button>
            );
          } else return null;
        })}
        <Button
          variant={ButtonVariant.info}
          tooltip="Next"
          disabled={!table.canNext()}
          onClick={() => {
            table.goNext();
          }}
        >
          <BiSkipNext />
        </Button>
        <Button
          variant={ButtonVariant.info}
          tooltip="Last"
          disabled={table.pageIndex === table.pageCount - 1}
          onClick={() => {
            table.goLast();
          }}
        >
          <BiLastPage />
        </Button>
        <Text
          name="pageSize"
          className="page-size"
          maxLength={3}
          value={pageSize}
          onChange={(e) => {
            const value = Number(e.currentTarget.value);
            if (!isNaN(value)) setPageSize(value);
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter') table.setPageSize(pageSize);
          }}
          onBlur={() => {
            table.setPageSize(pageSize);
          }}
        />
      </div>
    </div>
  );
};
