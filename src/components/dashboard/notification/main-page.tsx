'use client';

import React, { Fragment, useEffect, useState } from 'react';
import { GetNotificationList } from '@/modules/usecases/notification';
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, ColumnDef } from '@tanstack/react-table';
import Pagination from '@/components/system/Pagination/Pagination';
import './main-page.css'
import styles from './table.module.css'
import Link from 'next/link';
import { Typography } from '@mui/material';
import Skeleton from '@/components/system/Skeleton/Skeleton';
import { format } from 'date-fns';
import { formatWithDotsAndComma } from '@/helper';

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
            {Array.from(Array(5), (_, j) => (
                <th key={j} className={`p-4 py-6`}>
                    <Skeleton
                        className='px-3 min-w-full'
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
                            className='px-3 min-w-full'
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
    const [isLoadingHeader, setIsLoadingHeader] = useState<boolean>(true);
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
            setIsLoadingHeader(false)
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

    const plusAMinute = (datetime: string) => {
        const date = new Date(datetime)
        date.setMinutes(date.getMinutes() + 1)
        return format(date, 'yyyy-MM-dd HH:mm:ss')
    }

    if (isError) {
        return <div className="text-red-500 p-8">Failed to load notifications.</div>;
    }

    return (
        <div className="bg-[#0816358F] text-white p-8">
            <div className="rounded-lg w-full flex flex-col gap-6">
                <div className={`w-full max-h-[65dvh] overflow-x-auto ${styles.scrollbar}`}>
                    <div className="min-w-full">
                        <table className="table-auto divide-y divide-gray-200 w-full">
                            <thead className="sticky top-0 z-[16] border-b border-gray-700 bg-[#060F2C]">
                                <TableHeaderWrapper
                                    isLoading={isLoadingHeader}
                                >
                                    <Fragment>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <tr key={headerGroup.id} className="text-left text-gray-300">
                                                {headerGroup.headers.map((header, idx) => (
                                                    <th key={header.id} className={`px-6 py-3 text-center ${idx === 0 ? styles.first_child : ""}`}>
                                                        {typeof header.column.columnDef.header === 'function'
                                                            ? header.column.columnDef.header({} as any)
                                                            : header.column.columnDef.header}
                                                    </th>
                                                ))}
                                            </tr>
                                        ))}
                                    </Fragment>
                                </TableHeaderWrapper>
                            </thead>

                            <tbody className="divide-y !divide-gray-200 text-gray-600">
                                <TableBodyWrapper
                                    pageSize={10}
                                    columnSize={table.getHeaderGroups()?.[0].headers.length === 0 ? 5 : table.getHeaderGroups()?.[0].headers.length}
                                    isLoading={isLoading}
                                    isEmpty={data.length === 0}
                                >
                                    <Fragment>
                                        {table.getRowModel().rows.map((row) => (
                                            <tr
                                                key={row.id}
                                                className={`${styles.row_hover} hover:bg-white hover:bg-opacity-20 text-gray-100`}
                                            >
                                                {row.getVisibleCells().map((cell, idx) => (
                                                    <td key={cell.id} className={`whitespace-nowrap ${idx === 0 ? styles.first_child : ""}`}>
                                                        <Link
                                                            className='w-full h-full flex px-4 py-4 items-center rounded-full gap-x-2'
                                                            href={{
                                                                pathname: '/dashboard/anomaly-detection',
                                                                query: {
                                                                    data_source: data[row.index].source_identifier,
                                                                    time_range: `${data[row.index].timestamp_identifier} - ${plusAMinute(data[row.index].timestamp_identifier)}`,
                                                                    anomaly: data[row.index].anomaly_identifier,
                                                                    ...((data[row.index].site_identifier != null && data[row.index].site_identifier.length > 0) && { cluster: data[row.index].site_identifier }), // Only include cluster if it's not null or undefined
                                                                    service: data[row.index].identifier,
                                                                },
                                                            }}
                                                            passHref
                                                        >
                                                            {typeof cell.getValue() === 'number' ? (
                                                                <span className='ml-auto'>{formatWithDotsAndComma(cell.getValue() as number)}</span> // Format number with commas
                                                            ) : (
                                                                <span>{cell.getValue() as string}</span> // Display non-numeric values
                                                            )}
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
