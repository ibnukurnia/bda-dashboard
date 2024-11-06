import { Typography } from '@mui/material'
import { Cell, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { TopFiveLatestCritical } from '@/modules/models/overviews';
import { Fragment } from 'react';
import Link from 'next/link';
import styles from './table-top-critical.module.css'
import { formatWithDotsAndComma } from '@/helper';
import Skeleton from '@/components/system/Skeleton/Skeleton';

const columns = [{
  id: "datasource",
  header: "Data Source",
  accessorKey: "datasource",
}, {
  id: "identifier_alias",
  header: "Identifier",
  accessorKey: "identifier_alias",
}, {
  id: "anomaly",
  header: "Anomaly",
  accessorKey: "anomaly",
}, {
  id: "value",
  header: "Value",
  accessorKey: "value",
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
  if (typeof cell.getValue() === 'number') {
    return (
      <span
        className={`ml-auto`}
      >
        {formatWithDotsAndComma(cell.getValue() as number)}
      </span>
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
          <td
            key={j}
            className={`${i !== pageSize - 1 ? "border-b border-b-[#e5e7eb]" : ""} ${i === 0 ? "border-t border-t-[#e5e7eb]" : ""} p-4`}
          >
            {j === 1 ?
              <div className='flex flex-col gap-3'>
                {Array.from(Array(3), (_, k) =>
                  <Skeleton
                    key={k}
                    className='m-auto px-3'
                    width={120}
                    height={20}
                  />
                )}
              </div> :
              <Skeleton
                className='m-auto px-3'
                width={120}
                height={20}
              />
            }
          </td>
        ))}
      </tr>
    ))
  )
  if (isEmpty) return (
    <tr>
      <td className={`p-4 border-t border-t-[#e5e7eb]`} colSpan={columnSize}>
        <Typography variant="subtitle1" color="white" align="center">
          No data available.
        </Typography>
      </td>
    </tr>
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
    <div className="rounded-lg w-full flex flex-col gap-3">
      <div className={`w-full max-h-[85dvh] overflow-auto ${styles.scrollbar}`}>
        <div className="min-w-full h-full">
          <table
            className="table-auto divide-y border-separate divide-gray-200 w-full"
            cellPadding={0}
            cellSpacing={0}
          >
            <thead className={styles.table_header}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className='bg-[#060f2c]'>
                  {headerGroup.headers.map((header, idx) => (
                    <th key={header.id} colSpan={header.colSpan} className={`${idx === 0 ? styles.first_child : ""} p-2`}>
                      <button
                        className={`${header.column.getCanSort() ? 'cursor-pointer select-none uppercase font-semibold' : ''} w-full px-3 m-auto text-gray-100 `}
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
            <tbody className="divide-y divide-gray-200">
              <TableBodyWrapper
                pageSize={10}
                columnSize={table.getHeaderGroups()?.[0].headers.length === 0 ? 4 : table.getHeaderGroups()?.[0].headers.length}
                isLoading={isLoading}
                isEmpty={data.length === 0}
              >
                <Fragment>
                  {table.getRowModel().rows.map((row, i) => (
                    <tr
                      key={row.id}
                      className={`${styles.row_hover} bg-[#060f2c] hover:bg-[#383e54] text-gray-100`}
                    >
                      {row.getVisibleCells().map((cell, j) => (
                        <td
                          key={cell.id}
                          className={`${j === 0 ? styles.first_child : ""} ${i !== table.getRowModel().rows.length - 1 ? "border-b border-b-[#e5e7eb]" : ""} ${i === 0 ? "border-t border-t-[#e5e7eb]" : ""} whitespace-nowrap`}
                        >
                          <Link
                            className='w-full h-full flex px-3 py-1 text-sm items-center rounded-full gap-x-2'
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
                            {table.getHeaderGroups()[0].headers[j]?.id === "identifier_alias" ?
                              <div className='flex flex-col'>
                                <span>Service: {data[i].identifier.toUpperCase()}</span>
                                <span>Fungsi: {data[i].fungsi}</span>
                                <span>Site: {data[i].cluster.toUpperCase()}</span>
                              </div> :
                              <CellValue
                                cell={cell}
                              />
                            }
                          </Link>
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
    </div>
  )
}

export default TableTopCritical
