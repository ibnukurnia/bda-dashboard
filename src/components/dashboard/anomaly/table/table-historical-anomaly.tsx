import { Typography } from '@mui/material'
import { Cell, ColumnDef, getCoreRowModel, getFilteredRowModel, getSortedRowModel, PaginationState, useReactTable } from '@tanstack/react-table';
import { Fragment } from 'react';
import { formatNumberWithCommas } from '@/helper';
import { ROWS_PER_PAGE_OPTIONS } from '@/constants';
import styles from './table-historical-anomaly.module.css'
import Pagination from '@/components/system/Pagination/Pagination';
import Skeleton from '@/components/system/Skeleton/Skeleton';

interface CellValueProps {
  cell: Cell<any, unknown>
  rowIndex: number
  highlights?: string[][] | null
}
const CellValue: React.FC<CellValueProps> = ({
  cell,
  rowIndex,
  highlights,
}) => {
  if (typeof cell.getValue() === 'number') {
    return (
      <span
        className={`${highlights?.[rowIndex]?.includes(cell.column.id) ? 'blinking text-[#FF4E42] font-bold' : ''} ml-auto`}
      >
        {(cell.column.id === "error_rate" ||
          cell.column.id === "in_mbps" ||
          cell.column.id === "out_mbps" ||
          cell.column.id === "percent_in_mbps" ||
          cell.column.id === "percent_out_mbps") ?
          (cell.getValue() as number).toString().replace('.', ',') :
          formatNumberWithCommas(cell.getValue() as number)}
      </span>

    )
  }

  return (
    <span
      className={highlights?.[rowIndex]?.includes(cell.column.id) ? 'blinking text-[#FF4E42] font-bold' : ''}
    >
      {cell.getValue() as string}
    </span>
  )
}

interface TableHeaderWrapperProps {
  isLoading: boolean
  children: JSX.Element
}
const TableHeaderWrapper: React.FC<TableHeaderWrapperProps> = ({
  isLoading,
  children,
}) => {
  if (isLoading) return (
    <tr>
      {Array.from(Array(10), (_, j) => (
        <th key={j} className={`${styles.first_child} p-4 py-6`}>
          <Skeleton
            className='m-auto px-3'
            width={120}
            height={20}
          />
        </th>
      ))}
    </tr>
  )
  return children
}
interface TableBodyWrapperProps {
  isLoading: boolean
  isEmpty: boolean
  pageSize: number
  columnSize: number
  children: JSX.Element
}

const TableBodyWrapper: React.FC<TableBodyWrapperProps> = ({
  isLoading,
  isEmpty,
  pageSize,
  columnSize,
  children,
}) => {
  if (isLoading) return (
    Array.from(Array(pageSize), (_, i) => (
      <tr key={i}>
        {Array.from(Array(columnSize), (_, j) => (
          <td key={j} className={`${styles.first_child} p-4`}>
            <Skeleton
              className='m-auto px-3'
              width={120}
              height={20}
            />
          </td>
        ))}
      </tr>
    ))
  )
  if (isEmpty) return (
    <tr>
      <td className={`p-4`} colSpan={columnSize}>
        <Typography variant="subtitle1" color="white" align="center">
          No data available.
        </Typography>
      </td>
    </tr>
  )
  return children
}

interface TableHistoricalAnomalyProps {
  data: any[]
  totalRows: number
  columns: ColumnDef<any, any>[]
  highlights?: string[][] | null
  pagination: PaginationState
  handleChangePage: (page: number) => void
  handlePageSizeChange: (size: number) => void
  currentSort: string | null; // Current sort column
  handleSortChange: (columnKey: string | null) => void // Sorting handler
  isLoadingHeader: boolean
  isLoading: boolean
}

const TableHistoricalAnomaly = ({
  data,
  totalRows,
  columns,
  highlights,
  pagination,
  handleChangePage,
  handlePageSizeChange,
  handleSortChange,
  isLoadingHeader,
  isLoading,
  currentSort
}: TableHistoricalAnomalyProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true, // Disable table's internal pagination
    state: {
      pagination,
    },
  })

  return (
    <div className='flex flex-col gap-4'>
      <div className={`w-full overflow-auto ${styles.scrollbar} ${pagination.pageSize > 10 ? 'max-h-[75dvh]' : ''}`}>
        <div className="min-w-full">
          <table className={`${styles.table} table-auto divide-y divide-gray-200 w-full`}>
            <thead className={styles.table_header}>
              <TableHeaderWrapper
                isLoading={isLoadingHeader}
              >
                <Fragment>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} colSpan={header.colSpan} className="p-2">
                          <button
                            className={`${header.column.getCanSort() ? 'cursor-pointer select-none uppercase font-semibold' : ''
                              } w-full px-3 m-auto text-gray-100`}
                            onClick={() => handleSortChange(header.id)} // Use the parent's handler
                          >
                            {typeof header.column.columnDef.header === 'function'
                              ? header.column.columnDef.header({} as any)
                              : header.column.columnDef.header}
                            {header.column.getCanSort() && (
                              <Fragment>
                                {currentSort === header.id ? '🔼' : '🔽'} {/* Show sorting icon */}
                              </Fragment>
                            )}
                          </button>
                        </th>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              </TableHeaderWrapper>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-600">
              <TableBodyWrapper
                pageSize={pagination.pageSize}
                columnSize={isLoadingHeader || table.getHeaderGroups()?.[0].headers.length === 0 ? 10 : table.getHeaderGroups()?.[0].headers.length}
                isLoading={isLoading}
                isEmpty={data.length === 0}
              >
                <Fragment>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className={`${styles.first_child} whitespace-nowrap`}>
                          <div
                            className={`w-full text-gray-100 inline-flex items-center px-4 py-4 rounded-full ${cell.column.id === 'severity' ? 'gap-x-2' : ''
                              }`}
                          >
                            {!isLoading &&
                              cell.column.id === 'severity' &&
                              (cell.getValue() === 'Very High' ||
                                cell.getValue() === 'High' ||
                                cell.getValue() === 'Medium') && (
                                <svg
                                  width="14"
                                  height="15"
                                  viewBox="0 0 14 15"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M2.6075 12.75H11.3925C12.2908 12.75 12.8508 11.7759 12.4017 11L8.00917 3.41085C7.56 2.63502 6.44 2.63502 5.99083 3.41085L1.59833 11C1.14917 11.7759 1.70917 12.75 2.6075 12.75ZM7 8.66669C6.67917 8.66669 6.41667 8.40419 6.41667 8.08335V6.91669C6.41667 6.59585 6.67917 6.33335 7 6.33335C7.32083 6.33335 7.58333 6.59585 7.58333 6.91669V8.08335C7.58333 8.40419 7.32083 8.66669 7 8.66669ZM7.58333 11H6.41667V9.83335H7.58333V11Z"
                                    fill={
                                      cell.getValue() === 'Very High'
                                        ? '#dc2626' // Red for Very High
                                        : cell.getValue() === 'High'
                                          ? '#ea580c' // Orange for High
                                          : cell.getValue() === 'Medium'
                                            ? '#facc15' // Yellow for Medium
                                            : ''
                                    }
                                  />
                                </svg>
                              )}
                            <CellValue cell={cell} rowIndex={row.index} highlights={highlights} />
                          </div>

                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              </TableBodyWrapper>
            </tbody>
          </table>
        </div>
      </div>
      {data.length > 0 &&
        <Pagination
          currentPage={pagination.pageIndex}
          onPageChange={page => handleChangePage(page)}
          onRowsPerPageChange={rows => handlePageSizeChange(rows)}
          rowsPerPage={table.getState().pagination.pageSize}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          totalRows={totalRows}
        />
      }
    </div>
  )
}

export default TableHistoricalAnomaly
