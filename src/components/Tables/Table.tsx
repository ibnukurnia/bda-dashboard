// import { TableProps } from "@/types/tables/table"
import { ColumnDef, getCoreRowModel, useReactTable,flexRender } from "@tanstack/react-table"

export interface TableProps<T extends object> {
    data: Array<T>
    columns: Array<ColumnDef<T>>
}

const Table = <T extends object>({data, columns} :TableProps<T>) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    return (
        <>
        <table className="w-full table-auto">
            <thead>
                {table.getHeaderGroups().map((groups,key) => (
                    <tr key={key} className="bg-gray-2 text-left dark:bg-meta-4">
                        {groups.headers.map((header,key) => (
                            <th 
                                key={key} 
                                className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map((row) => (
                 <tr key={row.id} >
                   {row.getVisibleCells().map((cell) => (
                     <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark" key={cell.id}>
                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
                     </td>
                   ))}
                 </tr>
               ))}
            </tbody>
        </table>
        </>
    )
}

export default Table