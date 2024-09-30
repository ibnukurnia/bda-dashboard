import { Typography } from '@mui/material'
import { Cell, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { TopFiveLatestCritical } from '@/modules/models/overviews';

const columns = [{
  id: "datasource",
  header: "Data Source",
  accessorKey: "datasource",
}, {
  id: "identifier",
  header: "Identifier",
  accessorKey: "identifier",
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
    return <>
      {cell.column.columnDef.cell(cell.getContext())}
    </>
  }
  return <>
    {cell.column.columnDef.cell}
  </>
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
}

const TableTopCritical = ({ data, isLoading }: TableTopCriticalProps) => {
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
                  <tr key={row.id} >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-1 py-4 whitespace-nowrap">
                        <div className="text-gray-100 inline-flex items-center px-3 py-1 rounded-full gap-x-2">
                          <CellValue cell={cell} />
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
    </div>
  )
}

export default TableTopCritical
