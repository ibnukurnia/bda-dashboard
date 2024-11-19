'use client'; // Enables React Server Components (Next.js feature)

// Import necessary libraries and components
import React, { Fragment, useEffect, useState } from 'react';
import { GetNotificationList } from '@/modules/usecases/notification'; // API function to fetch notifications
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, ColumnDef } from '@tanstack/react-table'; // React Table utilities
import Pagination from '@/components/system/Pagination/Pagination'; // Custom pagination component
import './main-page.css'; // Global styles for this page
import styles from './table.module.css'; // CSS module for table-specific styles
import { Typography } from '@mui/material'; // MUI Typography component for styled text
import Skeleton from '@/components/system/Skeleton/Skeleton'; // Skeleton loader for loading states
import { format } from 'date-fns'; // Date formatting utility
import { formatWithDotsAndComma } from '@/helper'; // Helper function for number formatting

// Interface for table header skeleton props
interface TableHeaderWrapperProps {
    isLoading: boolean;
    children: JSX.Element;
}

// Wrapper component to show skeleton loader for the table header while loading
const TableHeaderWrapper: React.FC<TableHeaderWrapperProps> = ({
    isLoading,
    children,
}) => {
    if (isLoading) {
        return (
            <tr>
                {/* Generate 5 skeleton headers */}
                {Array.from(Array(5), (_, j) => (
                    <th key={j} className={`p-4 py-6`}>
                        <Skeleton className='px-3 min-w-full' width={120} height={20} />
                    </th>
                ))}
            </tr>
        );
    }
    return children; // Render actual header content when loading is complete
};

// Interface for table body skeleton props
interface TableBodyWrapperProps {
    isLoading: boolean;
    isEmpty: boolean;
    pageSize: number;
    columnSize: number;
    children: JSX.Element;
}

// Wrapper component to show skeleton loader or empty state for the table body
const TableBodyWrapper: React.FC<TableBodyWrapperProps> = ({
    isLoading,
    isEmpty,
    pageSize,
    columnSize,
    children,
}) => {
    if (isLoading) {
        return (
            // Generate skeleton rows based on pageSize and columnSize
            Array.from(Array(pageSize), (_, i) => (
                <tr key={i}>
                    {Array.from(Array(columnSize), (_, j) => (
                        <td key={j} className={`p-4`}>
                            <Skeleton className='px-3 min-w-full' width={120} height={20} />
                        </td>
                    ))}
                </tr>
            ))
        );
    }
    if (isEmpty) {
        return (
            // Display "No data available" message when the table is empty
            <tr>
                <td className={`p-4`} colSpan={columnSize}>
                    <Typography variant="subtitle1" color="white" align="center">
                        No data available.
                    </Typography>
                </td>
            </tr>
        );
    }
    return children; // Render actual body content when loading is complete and data is available
}

// Interface for the Anomaly data structure
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

// Main component for the Anomaly Notification page
const AnomalyNotificationPage = () => {
    const [columns, setColumns] = useState<ColumnDef<Anomaly, any>[]>([]); // Column definitions for the table
    const [data, setData] = useState<Anomaly[]>([]); // Data to populate the table
    const [totalRows, setTotalRows] = useState<number>(0); // Total rows for pagination
    const [isLoadingHeader, setIsLoadingHeader] = useState<boolean>(true); // Loading state for the header
    const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state for table data
    const [isError, setIsError] = useState<boolean>(false); // Error state
    const [pagination, setPagination] = useState({
        pageIndex: 1, // Current page index (starts at 1)
        pageSize: 10, // Number of rows per page
    });

    // Fetch data whenever pageIndex or pageSize changes
    useEffect(() => {
        fetchData(pagination.pageIndex);
    }, [pagination.pageIndex, pagination.pageSize]);

    // Function to fetch notification data
    const fetchData = async (page?: number) => {
        try {
            setIsLoading(true);
            const response = await GetNotificationList({
                page: page ?? pagination.pageIndex,
                limit: pagination.pageSize,
            });

            if (response?.data) {
                const { columns, rows, total_rows } = response.data;

                // Map columns from the response to the react-table structure
                const mappedColumns: ColumnDef<Anomaly, any>[] = columns.map((column: any) => ({
                    id: column.key,
                    header: column.title,
                    accessorKey: column.key,
                }));

                setColumns(mappedColumns); // Set table columns
                setTotalRows(total_rows); // Set total rows count
                setData(rows as Anomaly[]); // Set table data
                setIsError(false);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error); // Log any errors
            setIsError(true);
        } finally {
            setIsLoading(false); // Reset loading state
            setIsLoadingHeader(false);
        }
    };

    // React Table instance
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: true, // Manual pagination to sync with server-side
        state: {
            pagination,
        },
    });

    // Helper function to add a minute to a given datetime string
    const plusAMinute = (datetime: string) => {
        const date = new Date(datetime);
        date.setMinutes(date.getMinutes() + 1);
        return format(date, 'yyyy-MM-dd HH:mm:ss');
    };

    // Error state view
    if (isError) {
        return <div className="text-red-500 p-8">Failed to load notifications.</div>;
    }

    return (
        <div className="bg-[#0816358F] text-white p-8">
            <div className="rounded-lg w-full flex flex-col gap-6">
                {/* Table container */}
                <div className={`w-full max-h-[65dvh] overflow-x-auto ${styles.scrollbar}`}>
                    <div className="min-w-full">
                        <table className="table-auto divide-y w-full">
                            {/* Table header */}
                            <thead className="sticky top-0 z-[16] border-b border-white bg-[#060F2C]">
                                <TableHeaderWrapper isLoading={isLoadingHeader}>
                                    <Fragment>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <tr key={headerGroup.id} className="text-left text-gray-300">
                                                {headerGroup.headers.map((header, idx) => (
                                                    <th
                                                        key={header.id}
                                                        className={`px-6 py-3 text-center ${idx === 0 ? styles.first_child : ""}`}
                                                    >
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

                            {/* Table body */}
                            <tbody className="divide-y divide-gray-200 text-gray-600">
                                <TableBodyWrapper
                                    pageSize={10}
                                    columnSize={
                                        table.getHeaderGroups()?.[0].headers.length === 0
                                            ? 5
                                            : table.getHeaderGroups()?.[0].headers.length
                                    }
                                    isLoading={isLoading}
                                    isEmpty={data.length === 0}
                                >
                                    <Fragment>
                                        {table.getRowModel().rows.map((row) => (
                                            <tr
                                                key={row.id}
                                                className={`${styles.row_hover} text-gray-100`}
                                            >
                                                {row.getVisibleCells().map((cell, idx) => (
                                                    <td
                                                        key={cell.id}
                                                        className={`whitespace-nowrap ${idx === 0 ? styles.first_child : ""}`}
                                                    >
                                                        <div
                                                            className="w-full h-full flex px-4 py-4 items-center rounded-full gap-x-2"
                                                        >
                                                            {/* Display cell value with formatting */}
                                                            {typeof cell.getValue() === 'number' ? (
                                                                <span className="ml-auto">
                                                                    {formatWithDotsAndComma(cell.getValue() as number)}
                                                                </span>
                                                            ) : (
                                                                <span>{cell.getValue() as string}</span>
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

                {/* Pagination component */}
                {data.length > 0 && (
                    <Pagination
                        currentPage={pagination.pageIndex}
                        onPageChange={(page) => setPagination((prev) => ({ ...prev, pageIndex: page }))}
                        onRowsPerPageChange={(rows) => setPagination({ pageSize: rows, pageIndex: 1 })}
                        rowsPerPage={table.getState().pagination.pageSize}
                        rowsPerPageOptions={[10, 20, 50]} // Options for rows per page
                        totalRows={totalRows} // Total number of rows
                    />
                )}
            </div>
        </div>
    );
};

export default AnomalyNotificationPage;
