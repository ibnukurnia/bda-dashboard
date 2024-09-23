import { ArrowLeft, ArrowRight } from 'react-feather'

import './table-services.css'
import { Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react';
import { ColumnDef, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { GetLatestCritical } from '@/modules/usecases/overviews';
import { format } from 'date-fns';
import { PREDEFINED_TIME_RANGES } from '@/constants';
import useUpdateEffect from '@/hooks/use-update-effect';

const toMiliseconds = 1000 * 60

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
    <div className="flex justify-center items-center">
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

interface TableCriticalAnomalyProps {
  timeRange: string
  severity?: { value: any; id: number; label: string } | null
}

const TableCriticalAnomaly = ({ timeRange, severity }: TableCriticalAnomalyProps) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [data, setData] = useState<any>([])
  const [columns, setColumns] = useState<ColumnDef<any, any>[]>([])
  const [pagination, setPagination] = useState({
      pageIndex: 1, // Start from page 1
      pageSize: 10, // Default page size
  })
  const [totalPages, setTotalPages] = useState<number>(1)

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

  useEffect(() => {
    fetchData()
  }, [])
  
  useUpdateEffect(() => {
    fetchData()
  }, [timeRange, severity, pagination])

  function fetchData() {
    const { startTime, endTime } = handleStartEnd(timeRange)

    GetLatestCritical({
      start_time: startTime,
      end_time: endTime,
      severity: severity?.id,
      page: pagination.pageIndex,
      limit: pagination.pageSize
    })
      .then(result => {
        if (result?.data) {
          const { columns, rows, total_pages } = result.data;

          // Update the total number of pages based on the API response
          setTotalPages(total_pages);

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
        console.error('Error fetching data latest critical:', error)
      })
      .finally(() => {
        setIsTableLoading(false);
      });
  }

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

  return (
    // <div className="bg-black bg-opacity-50 flex justify-center items-center">
      <div ref={panelRef} className="rounded-lg w-full flex flex-col gap-3">
        <div className={`w-full ${!isTableLoading && data.length > 0 ? 'overflow-x-auto' : ''}`}>
          <div className="min-w-full">
            <TableWrapper isLoading={isTableLoading} isEmpty={data.length === 0}>
              <table className="table-auto divide-y divide-gray-200 w-full">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} colSpan={header.colSpan} className="p-2">
                          <button
                            className={`${header.column.getCanSort() ? 'cursor-pointer select-none uppercase font-semibold' : ''} px-3 text-gray-100`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {typeof header.column.columnDef.header === 'function'
                              ? header.column.columnDef.header({} as any) // Pass a dummy context
                              : header.column.columnDef.header}
                            {header.column.getCanSort() && (
                              <>
                                {{
                                  asc: '🔼',
                                  desc: '🔽',
                                  undefined: '🔽', // Default icon for unsorted state
                                }[header.column.getIsSorted() as string] || '🔽'}
                              </>
                            )}
                          </button>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-600">
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-1 py-4 whitespace-nowrap">
                          <div className="text-gray-100 inline-flex items-center px-3 py-1 rounded-full gap-x-2">
                            {cell.column.id === 'severity' && (
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
                            )}
                            {typeof cell.column.columnDef.cell === 'function'
                              ? cell.column.columnDef.cell(cell.getContext())
                              : cell.column.columnDef.cell}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrapper>
          </div>
        </div>
        {data.length > 0 && !isTableLoading && (
          <div className="flex mt-4 justify-content-between items-center gap-4 place-content-end">
            <div className="flex gap-1">
                <span className="text-white">Rows per page:</span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        setPagination(prev => ({
                          ...prev,
                          pageSize: Number(e.target.value)
                        }))
                    }}
                    className="select-button-assesment"
                >
                    {[5, 10, 15, 25].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </select>
            </div>
            <div className="text-white">
                Page {pagination.pageIndex} of {totalPages}
            </div>
            <div className="d-flex">
              <button
                className={`p-2 ${pagination.pageIndex === 1 ? 'text-gray-500 cursor-not-allowed' : 'bg-transparent text-white'}`}
                onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex-1}))}
                disabled={pagination.pageIndex === 1}
              >
                <ArrowLeft />
              </button>
              <button
                className={`p-2 ${pagination.pageIndex === totalPages ? 'text-gray-500 cursor-not-allowed' : 'bg-transparent text-white'}`}
                onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex+1}))}
                disabled={pagination.pageIndex === totalPages}
              >
                <ArrowRight />
              </button>
            </div>
          </div>
        )}
      </div>
    // </div>
  )
}

export default TableCriticalAnomaly
