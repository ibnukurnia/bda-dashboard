import { Typography } from '@mui/material'
import { forwardRef, Fragment, useEffect, useImperativeHandle, useState } from 'react';
import { Cell, ColumnDef, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { GetLatestCritical } from '@/modules/usecases/overviews';
import { format } from 'date-fns';
import { PREDEFINED_TIME_RANGES, ROWS_PER_PAGE_OPTIONS, SEVERITY_LABELS } from '@/constants';
import useUpdateEffect from '@/hooks/use-update-effect';
import { formatNumberWithCommas, formatWithDotsAndComma } from '../../../../helper';
import useDebounce from '@/hooks/use-debounce';
import Pagination from '@/components/system/Pagination/Pagination';
import Skeleton from '@/components/system/Skeleton/Skeleton';
import styles from './table-critical-anomaly.module.css'


const toMiliseconds = 1000 * 60

interface CellValueProps {
  cell: Cell<any, unknown>;
}
const CellValue: React.FC<CellValueProps> = ({
  cell,
}) => {
  if (cell.column.id === 'severity') {
    return (
      <Fragment>
        <svg
          width="14"
          height="15"
          viewBox="0 0 14 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.6075 12.75H11.3925C12.2908 12.75 12.8508 11.7759 12.4017 11L8.00917 3.41085C7.56 2.63502 6.44 2.63502 5.99083 3.41085L1.59833 11C1.14917 11.7759 1.70917 12.75 2.6075 12.75ZM7 8.66669C6.67917 8.66669 6.41667 8.40419 6.41667 8.08335V6.91669C6.41667 6.59585 6.67917 6.33335 7 6.33335C7.32083 6.33335 7.58333 6.59585 7.58333 6.91669V8.08335C7.58333 8.40419 7.32083 8.66669 7 8.66669ZM7.58333 11H6.41667V9.83335H7.58333V11Z"
            fill="#F59823"
          />
        </svg>
        {SEVERITY_LABELS[cell.getValue() as string] ?? cell.getValue()}
      </Fragment>
    )
  }
  if (typeof cell.column.columnDef.cell === 'function') {
    return <Fragment>
      {cell.column.columnDef.cell(cell.getContext())}
    </Fragment>
  }
  return <Fragment>
    {cell.column.columnDef.cell}
  </Fragment>
}

interface TableHeaderWrapperProps {
  isLoading: boolean
  columnSize: number
  children: JSX.Element
}
const TableHeaderWrapper: React.FC<TableHeaderWrapperProps> = ({
  isLoading,
  columnSize,
  children,
}) => {
  if (isLoading) return (
    <tr>
      {Array.from(Array(columnSize), (_, j) => (
        <th key={j} className={`p-4 py-6`}>
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
  isEmpty: boolean,
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
          <td key={j} className={`p-4`}>
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

interface TableCriticalAnomalyProps {
  timeRange: string
  dataSource?: string | null
  severity: { value: any; id: number; label: string }[]
}

export interface TableCriticalAnomalyHandle {
  refresh: (timeRange: string) => void
}

const TableCriticalAnomaly = forwardRef<TableCriticalAnomalyHandle, TableCriticalAnomalyProps>(({
  timeRange,
  dataSource,
  severity,
}, ref) => {
  const [currentSort, setCurrentSort] = useState<string | null>(null);
  const [isLoadingHeader, setIsLoadingHeader] = useState(true)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [data, setData] = useState<any>([])
  const [columns, setColumns] = useState<ColumnDef<any, any>[]>([])
  const [pagination, setPagination] = useState({
    pageIndex: 1, // Start from page 1
    pageSize: 10, // Default page size
  })
  const [totalRows, setTotalRows] = useState<number>(1)
  const [pauseEffectPagination, setPauseEffectPagination] = useState(false)

  // Use useImperativeHandle to expose the custom method
  useImperativeHandle(ref, () => ({
    refresh(timeRange) {
      setIsTableLoading(true)
      fetchData(pagination.pageIndex, timeRange)
    },
  }));

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

  function fetchData(page?: number, customTimeRange?: string, sortBy?: string) {
    const { startTime, endTime } = handleStartEnd(customTimeRange ?? timeRange);

    // Build the API request payload
    const params: any = {
      start_time: startTime,
      end_time: endTime,
      data_source: dataSource,
      severity: severity.map((s) => s.id),
      page: page ?? pagination.pageIndex,
      limit: pagination.pageSize,
      sort_by: sortBy || currentSort || undefined, // Use explicitly passed sortBy, fallback to currentSort
    };

    // console.log(params.sort_by, 'sort_by used in fetchData');

    // Call GetLatestCritical API with the constructed parameters
    GetLatestCritical(params)
      .then((result) => {
        if (result?.data) {
          const { columns, rows, total_rows } = result.data;

          // Update the total number of rows based on the API response
          setTotalRows(total_rows);

          // Map the columns from the API response to the format required by the table
          const newColumns = columns.map((column: any) => ({
            id: column.key,
            header: column.title,
            accessorKey: column.key,
          }));
          setColumns(newColumns);

          // Map the rows from the API response to the format required by the table
          const newData = rows.map((row: any) => {
            const mappedRow: any = {};
            columns.forEach((col: any) => {
              mappedRow[col.key] = row[col.key];
            });
            return mappedRow;
          });

          // Update the table data
          setData(newData);
        } else {
          console.warn('API response data is null or undefined');
        }
      })
      .catch((error) => {
        console.error('Error fetching data latest critical:', error);
      })
      .finally(() => {
        setIsLoadingHeader(false);
        setIsTableLoading(false);
      });
  }

  const handleSortChange = (columnKey: string | null) => {
    setCurrentSort((prevSort) => {
      const newSort = prevSort === columnKey ? null : columnKey;
      // console.log(newSort, "newSort being set");
      return newSort;
    });

    // Fetch data in a `useEffect` tied to `currentSort`
  };


  useEffect(() => {
    if (currentSort !== null) {
      // console.log(currentSort, "currentSort changed, fetching data");
      fetchData(undefined, undefined, currentSort);
    }
  }, [currentSort]);

  const handleStartEnd = (time: string) => {
    const timeSplit = time.split(' - ')

    let startTime: string | Date
    let endTime: string | Date

    if (timeSplit.length > 1) {
      startTime = timeSplit?.[0]
      endTime = timeSplit?.[1]
    } else {
      startTime = format(new Date(new Date().getTime() - toMiliseconds * PREDEFINED_TIME_RANGES[time]), 'yyyy-MM-dd HH:mm:ss')
      endTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    }

    return { startTime, endTime }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useDebounce(() => {
    setIsTableLoading(true)
    setPauseEffectPagination(true)
    setPagination(prev => ({ ...prev, pageIndex: 1 }))
    fetchData(1)
  }, 500, [timeRange, dataSource, severity])

  useUpdateEffect(() => {
    if (pauseEffectPagination) {
      setPauseEffectPagination(false);
    }
    setIsTableLoading(true);
    // Pass currentSort explicitly as sortBy to fetchData
    fetchData(undefined, undefined, currentSort ?? undefined);
  }, [pagination]);

  return (
    <div className="rounded-lg w-full flex flex-col gap-3">
      <div className={`w-full overflow-auto ${pagination.pageSize > 10 ? 'max-h-[75dvh]' : ''}`}>
        <div className="min-w-full">
          <table className="table-auto divide-y !divide-gray-200 w-full">
            <thead>
              <TableHeaderWrapper
                isLoading={isLoadingHeader}
                columnSize={table.getHeaderGroups()?.[0].headers.length === 0 ? 5 : table.getHeaderGroups()?.[0].headers.length}
              >
                <Fragment>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className='text-left'>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} colSpan={header.colSpan} className={`${styles.first_child} p-2`}>
                          <button
                            className={`${header.column.getCanSort() ? 'cursor-pointer select-none uppercase font-semibold' : ''} w-full px-3 m-auto text-gray-100`}
                            onClick={() => handleSortChange(header.column.id)} // Call handleSortChange with the column's ID
                          >
                            {typeof header.column.columnDef.header === 'function'
                              ? header.column.columnDef.header({} as any) // Pass a dummy context if the header is a function
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
                </Fragment>
              </TableHeaderWrapper>
            </thead>
            <tbody className="divide-y !divide-gray-200 text-gray-600">
              <TableBodyWrapper
                pageSize={pagination.pageSize}
                columnSize={table.getHeaderGroups()?.[0].headers.length === 0 ? 5 : table.getHeaderGroups()?.[0].headers.length}
                isLoading={isTableLoading}
                isEmpty={data.length === 0}
              >
                <Fragment>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className={`${styles.first_child} px-1 py-4 whitespace-nowrap`}>
                          <div className="w-full text-gray-100 inline-flex items-center px-3 py-1 rounded-full gap-x-2">
                            {/* Severity Check */}
                            {cell.column.id === 'severity' &&
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

                            {/* Format number with commas */}
                            {typeof cell.getValue() === 'number' ? (
                              <span className='ml-auto'>{formatWithDotsAndComma(cell.getValue() as number)}</span> // Apply the number formatting function
                            ) : (
                              <span>{cell.getValue() as string} {/* For non-numeric values */}</span>
                            )}
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
          onPageChange={page => setPagination(prev => ({ ...prev, pageIndex: page }))}
          onRowsPerPageChange={rows => setPagination({ pageSize: rows, pageIndex: 1 })}
          rowsPerPage={table.getState().pagination.pageSize}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          totalRows={totalRows}
        />
      }
    </div>
  )
})

export default TableCriticalAnomaly
