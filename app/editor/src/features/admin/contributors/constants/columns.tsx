import { CellCheckbox, CellEllipsis, IContributorModel, ITableHookColumn } from 'tno-core';

export const columns: ITableHookColumn<IContributorModel>[] = [
  {
    label: 'Name',
    name: 'name',
    width: 2,
    cell: (cell) => <CellEllipsis>{cell.original.name}</CellEllipsis>,
  },
  {
    label: 'Source',
    name: 'sourceId',
    width: 2,
    cell: (cell) => <CellEllipsis>{cell.original.source?.name}</CellEllipsis>,
  },
  {
    label: 'Description',
    name: 'description',
    width: 5,
    cell: (cell) => <CellEllipsis>{cell.original.description}</CellEllipsis>,
  },
  {
    label: 'Order',
    name: 'sortOrder',
    width: 1,
    hAlign: 'center',
    cell: (cell) => cell.original.sortOrder,
  },
  {
    label: 'Press',
    name: 'isPress',
    width: 1,
    hAlign: 'center',
    cell: (cell) => <CellCheckbox checked={cell.original.isPress} />,
  },
  {
    label: 'Enabled',
    name: 'isEnabled',
    width: 1,
    hAlign: 'center',
    cell: (cell) => <CellCheckbox checked={cell.original.isEnabled} />,
  },
];
