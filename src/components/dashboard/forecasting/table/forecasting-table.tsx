import { SetStateAction } from 'react'
import { Table } from '@tanstack/react-table'
import { ArrowLeft, ArrowRight } from 'react-feather'

interface ForecastingTableProps {
  table: Table<{
    timestamp_s: string
    service_name: string
    tps_apm: number
    max_rt: number
    p99_rt: number
    count_success_200: number
    count_error_400: number
    count_error_500: number
  }>
  data: {
    timestamp_s: string
    service_name: string
    tps_apm: number
    max_rt: number
    p99_rt: number
    count_success_200: number
    count_error_400: number
    count_error_500: number
  }[]
  pagination: {
    pageIndex: number
    pageSize: number
  }
  totalPages: number
  nextPage: () => void
  previousPage: () => void
  changePaginationSize: (size: number) => void
}

const ForecastingTable = ({
  table,
  data,
  pagination,
  // setPagination,
  changePaginationSize,
  totalPages,
  nextPage,
  previousPage,
}: ForecastingTableProps) => {
  return (
    <div className="overflow-x-auto w-full">
      <div className="min-w-full">
        <table id="person" className="table-auto divide-y divide-gray-200 w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan} className="p-2">
                    <div
                      className={`${header.column.getCanSort() ? 'cursor-pointer select-none' : ''} flex flex-row justify-center items-center gap-1`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div
                        className={`${header.column.getCanSort() ? 'cursor-pointer select-none uppercase font-semibold text-gray-100' : ''}`}
                      >
                        {typeof header.column.columnDef.header === 'function'
                          ? header.column.columnDef.header({} as any) // Pass a dummy context
                          : header.column.columnDef.header}
                      </div>
                      <div>
                        {header.column.getCanSort() && (
                          <>
                            {{
                              asc: '🔼',
                              desc: '🔽',
                              undefined: '🔽', // Default icon for unsorted state
                            }[header.column.getIsSorted() as string] || '🔽'}
                          </>
                        )}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-600">
            {data.length === 0 ? (
              <tr>
                <td colSpan={table.getAllColumns().length} className="text-center py-4">
                  <div className="text-center text-2xl font-semibold text-white">DATA IS NOT AVAILABLE</div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`${cell.column.id !== 'service_name' ? 'text-center' : ''} px-1 py-4 whitespace-nowrap`}
                    >
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
              ))
            )}
          </tbody>
        </table>
      </div>
      {data.length > 0 && (
        <div className="flex mt-4 justify-content-between items-center gap-4 place-content-end">
          <div className="flex gap-1">
            <span className="text-white">Rows per page:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                const newPageSize = Number(e.target.value)
                table.setPageSize(newPageSize)
                changePaginationSize(newPageSize)
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
              className="bg-transparent text-white p-2"
              onClick={previousPage}
              disabled={pagination.pageIndex === 0}
            >
              <ArrowLeft />
            </button>
            <button
              className="bg-transparent text-white p-2"
              onClick={nextPage}
              disabled={pagination.pageIndex >= totalPages}
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ForecastingTable
