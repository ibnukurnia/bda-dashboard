'use client';

import React, { useEffect, useState } from 'react';
import { GetNotificationList } from '@/modules/usecases/notification';
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, ColumnDef } from '@tanstack/react-table';
import Pagination from '@/components/system/Pagination/Pagination';
import './main-page.css'
import Link from 'next/link';

interface Anomaly {
    source_identifier: string;
    source: string;
    fungsi: string;
    anomaly_identifier: string;
    anomaly_description: string;
    identifier: string;
    identifier_alias: string;
    timestamp_identifier: string;
    timestamp: string;
    site: string;
    site_identifier: string;
}

const AnomalyNotificationPage = () => {
    const [columns, setColumns] = useState<ColumnDef<Anomaly, any>[]>([]);
    const [data, setData] = useState<Anomaly[]>([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [pagination, setPagination] = useState({
        pageIndex: 1, // Start from page 1
        pageSize: 10, // Default page size
    });

    useEffect(() => {
        fetchData(pagination.pageIndex);
    }, [pagination.pageIndex, pagination.pageSize]);

    const fetchData = async (page?: number) => {
        try {
            setIsLoading(true);
            const response = await GetNotificationList({
                page: page ?? pagination.pageIndex,
                limit: pagination.pageSize,
            });

            if (response?.data) {
                const { columns, rows, total_rows } = response.data;

                // Map columns to react-table's ColumnDef structure
                const mappedColumns: ColumnDef<Anomaly, any>[] = columns.map((column: any) => ({
                    id: column.key,
                    header: column.title,
                    accessorKey: column.key,
                }));

                setColumns(mappedColumns);
                setTotalRows(total_rows);

                // Set the rows (data) for the table
                setData(rows as Anomaly[]);
                setIsError(false);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: true, // Disable internal pagination
        state: {
            pagination,
        },
    });

    if (isLoading) {
        return <div className="text-white p-8">Loading...</div>;
    }

    if (isError) {
        return <div className="text-red-500 p-8">Failed to load notifications.</div>;
    }

    return (
        <div className="bg-[#0816358F] text-white p-8">
            <div className="rounded-lg w-full flex flex-col gap-6">
                <div className={`w-full max-h-[75dvh] ${!isLoading && data.length > 0 ? 'overflow-x-auto' : ''}`}>
                    <div className="min-w-full">
                        <table className="table-auto divide-y divide-gray-200 w-full">
                            <thead className="border-b border-gray-700">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id} className="text-left text-gray-300">
                                        {headerGroup.headers.map((header) => (
                                            <th key={header.id} className="px-6 py-3">
                                                {typeof header.column.columnDef.header === 'function'
                                                    ? header.column.columnDef.header({} as any)
                                                    : header.column.columnDef.header}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>

                            <tbody className="divide-y !divide-gray-200 text-gray-600">
                                {table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className={"hover:bg-white hover:bg-opacity-20 text-gray-100"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="whitespace-nowrap">
                                                <Link
                                                    className='w-full h-full flex px-4 py-4 items-center rounded-full gap-x-2'
                                                    href={{
                                                        pathname: '/dashboard/anomaly-detection',
                                                        query: {
                                                            data_source: data[row.index].source_identifier,
                                                            time_range: `${data[row.index].timestamp_identifier} - ${data[row.index].timestamp_identifier}`,
                                                            anomaly: data[row.index].anomaly_identifier,
                                                            ...((data[row.index].site_identifier != null && data[row.index].site_identifier.length > 0) && { cluster: data[row.index].site_identifier }), // Only include cluster if it's not null or undefined
                                                            service: data[row.index].identifier,
                                                        },
                                                    }}
                                                    passHref
                                                >
                                                    {typeof cell.getValue() === 'number' ? (
                                                        <span>{new Intl.NumberFormat('en-US').format(cell.getValue() as number)}</span> // Format number with commas
                                                    ) : (
                                                        <span>{cell.getValue() as string}</span> // Display non-numeric values
                                                    )}
                                                </Link>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>
                {data.length > 0 && (
                    <Pagination
                        currentPage={pagination.pageIndex}
                        onPageChange={(page) => setPagination((prev) => ({ ...prev, pageIndex: page }))}
                        onRowsPerPageChange={(rows) => setPagination({ pageSize: rows, pageIndex: 1 })}
                        rowsPerPage={table.getState().pagination.pageSize}
                        rowsPerPageOptions={[10, 20, 50]} // You can adjust rows per page options as needed
                        totalRows={totalRows}
                    />
                )}
            </div>
        </div>
    );
};

export default AnomalyNotificationPage;
