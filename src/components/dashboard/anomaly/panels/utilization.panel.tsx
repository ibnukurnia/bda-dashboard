import React from 'react';
import BarChart from '../chart/bar-chart';
import LineChart from '../chart/line-chart'; // Import LineChart component
import { Anomaly } from '@/types/anomaly';
import { Box, Stack, Typography } from '@mui/material';
import {
    ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    useReactTable,
} from '@tanstack/react-table';
import { ArrowLeft, ArrowRight } from 'react-feather';

interface TabUtilizationContentProps {
    selectedUtilization: string; // Add selectedLog prop
    anomalyData: { data: number[] }[];
    series: { name: string, data: number[] }[];
    categories: string[];
    anomalyCategory: string[];
    data: Anomaly[];
    columns: ColumnDef<Anomaly, any>[];
    pagination: PaginationState;
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
}

const TabUtilizationContent: React.FC<TabUtilizationContentProps> = ({
    selectedUtilization,
    series,
    categories,
    anomalyData,
    anomalyCategory,
    data,
    columns,
    pagination,
    setPagination
}) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination,
        },
    });

    // Determine which chart to render based on the selected log
    const renderChart = () => {
        switch (selectedUtilization) {
            case 'Log APM':
                return (
                    <BarChart
                        series={anomalyData}
                        categories={anomalyCategory}
                        height={350}
                        width="100%"
                    />
                );
            case 'Log Brimo':
                return (
                    <LineChart
                        series={series}
                        categories={categories}
                        yAxisMin={0}
                        yAxisMax={130}
                        height={300}
                        width="100%"
                    />
                );
            default:
                return (
                    <Typography variant="h6" component="h6" color="white">
                        No chart available for {selectedUtilization}
                    </Typography>
                );
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-20">
                <div className="card-style">
                    <Typography variant="h5" component="h5" color="white">
                        Most Recent Anomaly
                    </Typography>
                    {renderChart()} {/* Render the appropriate chart */}
                </div>
            </div>
            <div className="flex flex-col gap-8 p-6" style={{ border: '1px solid #004889', borderRadius: 2 }}>
                <Typography variant="h5" component="h5" color="white">
                    Historical Anomaly Records
                </Typography>
                <Box>
                    <div className="overflow-x-auto w-full">
                        <div className="min-w-full">
                            <table id="person" className="table-auto divide-y divide-gray-200 w-full">
                                <thead>
                                    {table.getHeaderGroups().map(headerGroup => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map(header => (
                                                <th key={header.id} colSpan={header.colSpan} className="p-1">
                                                    <div
                                                        className={`${header.column.getCanSort() ? "cursor-pointer select-none" : ""} px-3`}
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {typeof header.column.columnDef.header === 'function'
                                                            ? header.column.columnDef.header({} as any) // Pass a dummy context
                                                            : header.column.columnDef.header}
                                                        {header.column.getCanSort() && (
                                                            <>
                                                                {{
                                                                    asc: "🔼",
                                                                    desc: "🔽",
                                                                    undefined: "🔽" // Default icon for unsorted state
                                                                }[header.column.getIsSorted() as string] || "🔽"}
                                                            </>
                                                        )}
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {table.getRowModel().rows.map(row => (
                                        <tr key={row.id}>
                                            {row.getVisibleCells().map(cell => (
                                                <td key={cell.id} className="px-1 py-4 whitespace-nowrap">
                                                    <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2">
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
                        </div>
                        <div className="flex mt-4 justify-content-between items-center gap-4 place-content-end">
                            <div className="flex gap-1">
                                <span className="text-white">Rows per page:</span>
                                <select
                                    value={table.getState().pagination.pageSize}
                                    onChange={(e) => {
                                        table.setPageSize(Number(e.target.value))
                                    }}
                                    className="select-button-assesment"
                                >
                                    {[4, 16, 32].map((pageSize) => (
                                        <option key={pageSize} value={pageSize}>
                                            {pageSize}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="text-white">
                                {table.getState().pagination.pageIndex + 1} of {table.getState().pagination.pageSize}
                            </div>
                            <div className="d-flex">
                                <button
                                    className="bg-transparent text-white p-2"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <ArrowLeft />
                                </button>
                                <button
                                    className="bg-transparent text-white p-2"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    <ArrowRight />
                                </button>
                            </div>
                        </div>
                    </div>
                </Box>
            </div>
        </div>
    );
};

export default TabUtilizationContent;
