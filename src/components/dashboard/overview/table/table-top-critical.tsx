import { Typography } from '@mui/material'
import { Cell, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { TopFiveLatestCritical } from '@/modules/models/overviews';
import { Fragment } from 'react';
import Link from 'next/link';
import styles from './table-top-critical.module.css'

const columns = [{
  id: "datasource",
  header: "Data Source",
  accessorKey: "datasource",
}, {
  id: "identifier_alias",
  header: "Identifier_alias",
  accessorKey: "identifier_alias",
}, {
  id: "anomaly",
  header: "Anomaly",
  accessorKey: "anomaly",
}, {
  id: "total",
  header: "Total",
  accessorKey: "total",
}]

interface CellValueProps {
  cell: Cell<any, unknown>;
}
const CellValue: React.FC<CellValueProps> = ({
  cell,
}) => {
  if (typeof cell.column.columnDef.cell === 'function') {
    return <Fragment>
      {cell.column.columnDef.cell(cell.getContext())}
    </Fragment>
  }
  return <Fragment>
    {cell.column.columnDef.cell}
  </Fragment>
}

interface TableWrapperProps {
  isLoading: boolean;
  isEmpty: boolean;
  children: JSX.Element;
}
const TableWrapper: React.FC<TableWrapperProps> = ({
  isLoading,
  isEmpty,
  children,
}) => {
  if (isLoading) return (
    <div className="h-full flex justify-center items-center">
      <div className="spinner"></div>
    </div>
  )
  if (isEmpty) return (
    <div className="text-center py-4">
      <Typography variant="subtitle1" color="white" align="center">
        No data available.
      </Typography>
    </div>
  )
  return children
}

interface TableTopCriticalProps {
  data: TopFiveLatestCritical[]
  isLoading: boolean
  queryParams?: {
    time_range?: string;
  };
}

const TableTopCritical = ({ data, isLoading, queryParams }: TableTopCriticalProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true, // Disable table's internal pagination
  })

  return (
    <div className="flex-1 rounded-lg w-full flex flex-col gap-3">
      <div className={`flex-1 w-full max-h-[75dvh] ${!isLoading && data.length > 0 ? 'overflow-x-auto' : ''}`}>
        <div className="min-w-full h-full">
          <TableWrapper isLoading={isLoading} isEmpty={data.length === 0}>
            <table className="table-auto divide-y divide-gray-200 w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} colSpan={header.colSpan} className={`${styles.first_child} p-2`}>
                        <button
                          className={`${header.column.getCanSort() ? 'cursor-pointer select-none uppercase font-semibold' : ''} px-3 text-gray-100`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {typeof header.column.columnDef.header === 'function'
                            ? header.column.columnDef.header({} as any) // Pass a dummy context
                            : header.column.columnDef.header}
                          {header.column.getCanSort() && (
                            <Fragment>
                              {{
                                asc: '🔼',
                                desc: '🔽',
                                undefined: '🔽', // Default icon for unsorted state
                              }[header.column.getIsSorted() as string] || '🔽'}
                            </Fragment>
                          )}
                        </button>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-600">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`${styles.row_hover} hover:bg-slate-300 text-gray-100 hover:text-black`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className={`${styles.first_child} whitespace-nowrap`}>
                      <Link
                        className='w-full h-full flex '
                        href={{
                          pathname: '/dashboard/anomaly-detection',
                          query: {
                            ...queryParams,
                            data_source: data[row.index].source_alias,
                            anomaly: data[row.index].anomaly_identifier,
                            service: data[row.index].identifier,
                          },
                        }}
                        passHref
                      >
                        <div className="px-4 py-4 inline-flex items-center rounded-full gap-x-2">
                          <CellValue cell={cell} />
                        </div>
                      </Link>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrapper>
        </div>
      </div>
    </div>
  )
}

export default TableTopCritical
