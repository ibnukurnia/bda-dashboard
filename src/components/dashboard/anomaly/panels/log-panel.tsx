import React, { useContext, useEffect, useState } from 'react'
import { GetHistoricalLogAnomalies } from '@/modules/usecases/anomaly-predictions'
import { Box, Typography } from '@mui/material'
import {
    ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    useReactTable,
} from '@tanstack/react-table'
import { ArrowLeft, ArrowRight } from 'react-feather'

import DropdownRange from '../../dropdownRange'
import SynchronizedCharts from '../../overview/chart/synchronized-charts'
import ButtonWithCheckbox from '../../situation-room/button-checkbox'
import { fetchCheckboxes, fetchTimeRanges, TimeRangeOption, CheckboxOption } from '@/lib/api'
import { Column } from '@/modules/models/anomaly-predictions'


interface TabLogContentProps {
    selectedLog: string
    series: { name: string; data: number[] }[]
    categories: string[]
    anomalyCategory: string[]
    anomalyData: { data: number[] }[]
}

const defaultTimeRanges: Record<string, number> = {
    'Last 5 minutes': 5,
    'Last 10 minutes': 10,
    'Last 15 minutes': 15,
    'Last 30 minutes': 30,
    'Last 1 hour': 60,
    'Last 3 hours': 180,
    'Last 12 hours': 720,
};

const TabLogContent: React.FC<TabLogContentProps> = ({
    selectedLog,
    series,
    categories,
    anomalyCategory,
    anomalyData,
}) => {
    const [timeRanges, setTimeRanges] = useState<Record<string, number>>(defaultTimeRanges);
    const [selectedRange, setSelectedRange] = useState<string>('');
    const [hasErrorTimeRange, setHasErrorTimeRange] = useState<boolean>(false);
    const [checkboxOptions, setCheckboxOptions] = useState<CheckboxOption[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [isLoadingFilter, setIsLoadingFilter] = useState<boolean>(true);
    const [hasErrorFilter, setHasErrorFilter] = useState<boolean>(false);
    const [columns, setColumns] = useState<ColumnDef<any, any>[]>([])
    const [data, setData] = useState<any[]>([])
    const [totalPages, setTotalPages] = useState<number>(1);
    // Define the pagination state used by React Table
    const [pagination, setPagination] = useState({
        pageIndex: 0, //initial page index
        pageSize: 10, //default page size
    });

    const generateDayWiseTimeSeries = (baseval: number, count: number, yrange: { min: number; max: number }) => {
        const series = []
        for (let i = 0; i < count; i++) {
            const x = baseval + i * 86400000 // Adding one day in milliseconds
            const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
            series.push([x, y])
        }
        return series
    }

    const seriesNew = [
        { name: 'Series 1', data: generateDayWiseTimeSeries(new Date('11 Feb 2017').getTime(), 20, { min: 10, max: 60 }) },
        { name: 'Series 2', data: generateDayWiseTimeSeries(new Date('11 Feb 2017').getTime(), 20, { min: 10, max: 30 }) },
        { name: 'Series 3', data: generateDayWiseTimeSeries(new Date('11 Feb 2017').getTime(), 20, { min: 10, max: 60 }) },
    ]

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

    const handleCheckboxChange = (id: string, checked: boolean) => {
        setSelectedOptions((prevSelectedOptions) => {
            const newSelectedOptions = checked
                ? [...prevSelectedOptions, id]
                : prevSelectedOptions.filter((optionId) => optionId !== id);

            // console.log('Updated selectedOptions:', newSelectedOptions);
            return newSelectedOptions;
        });
    };

    const handleSubmit = async () => {
        const queryParams = selectedOptions.map((id) => `optionIds[]=${id}`).join('&');
        const url = `/api/submit?${queryParams}`; // Replace with your actual API endpoint
        try {
            const response = await fetch(url, {
                method: 'GET', // Or 'POST' if your API expects POST requests
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to submit selected options');
            }
            const result = await response.json();
            console.log('Submission successful:', result);
            // Handle the response here (e.g., display success message, update state, etc.)
        } catch (error) {
            console.error('Error during submission:', error);
            // Handle the error (e.g., display error message)
        }
    };

    const renderChart = () => {
        switch (selectedLog) {
            case 'Log APM':
                return (
                    <SynchronizedCharts
                        seriesNew={seriesNew} // Ensure seriesNew is relevant for Log APM
                        categories={categories} // Ensure categories are relevant for Log APM
                        height={300}
                        width="100%"
                        title="APM Log Chart"
                        lineColors={['#FF5733', '#000000', '#546E7A']}
                        yAxisMin={0}
                        yAxisMax={150}
                    />
                );
            case 'Log Brimo':
                return (
                    <SynchronizedCharts
                        seriesNew={seriesNew} // Ensure seriesNew is relevant for Log Brimo
                        categories={categories} // Ensure categories are relevant for Log Brimo
                        height={800}
                        width="100%"
                        title="Brimo Log Chart"
                        lineColors={['#FF5733', '#000000', '#546E7A']}
                        yAxisMin={0}
                        yAxisMax={150}
                    />
                );
            default:
                return (
                    <Typography variant="h6" component="h6" color="white">
                        No chart available for {selectedLog}
                    </Typography>
                );
        }
    };

    const handleRangeChange = (rangeKey: string) => {
        setSelectedRange(rangeKey);
        // Handle the selected time range here, e.g., update charts, filter data, etc.
        console.log(`Selected range: ${rangeKey}, minutes: ${timeRanges[rangeKey]}`);
    };

    const fetchData = async (page: number, limit: number) => {
        console.log('Fetching data for page:', page);
        try {
            let type = selectedLog === 'Log APM' ? 'apm' : selectedLog === 'Log Brimo' ? 'brimo' : '';
            if (!type) {
                console.warn('Unknown log type:', selectedLog);
                return;
            }

            const result = await GetHistoricalLogAnomalies(type, limit, page);

            if (result.data) {
                setTotalPages(result.data.total_pages);

                // Extract columns and rows from the API response
                const responseColumns = result.data.columns;
                const responseRows = result.data.rows;

                if (responseColumns && responseRows) {
                    // Create ColumnDefs based on the API response columns
                    const newColumns = responseColumns.map((column: any) => ({
                        id: column.key, // Ensure each column has a unique id
                        header: column.title, // Use title for the header
                        accessorKey: column.key, // Ensure accessor matches your row data field
                    }));

                    setColumns(newColumns);

                    // Map rows to match the columns
                    const newData = responseRows.map((row: any) => {
                        const mappedRow: any = {};
                        responseColumns.forEach((col: any) => {
                            mappedRow[col.key] = row[col.key];
                        });
                        return mappedRow;
                    });

                    setData(newData);
                    console.log('Data and columns updated for page:', page);
                } else {
                    console.warn('No columns or rows in the API response');
                }
            } else {
                console.warn('API response data is null or undefined');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const nextPage = () => {
        setPagination((prev) => {
            const newPageIndex = prev.pageIndex + 1;
            fetchData(newPageIndex, prev.pageSize); // Fetch data for the new page
            return { ...prev, pageIndex: newPageIndex };
        });
    };

    const previousPage = () => {
        setPagination((prev) => {
            const newPageIndex = prev.pageIndex - 1;
            console.log('Previous pageIndex:', prev.pageIndex);
            console.log('New pageIndex (before check):', newPageIndex);

            if (newPageIndex >= 1) { // Adjust check for 1-based indexing
                console.log('Fetching data for new pageIndex:', newPageIndex);
                fetchData(newPageIndex, prev.pageSize); // Fetch data for the new page
                return { ...prev, pageIndex: newPageIndex };
            }

            console.log('New pageIndex is less than 1, no update made.');
            return prev;
        });
    };

    const fetchAnomaliesByLog = async () => {
        try {
            let type = selectedLog === 'Log APM' ? 'apm' : selectedLog === 'Log Brimo' ? 'brimo' : '';
            if (!type) return;

            const limit = pagination.pageSize;
            const page = 1; // Start from page 1

            const result = await GetHistoricalLogAnomalies(type, limit, page);

            if (result.data) {
                setTotalPages(result.data.total_pages);

                // Update columns and data
                const newColumns = result.data.columns.map((column: any) => ({
                    id: column.key,
                    header: column.title,
                    accessorKey: column.key,
                }));
                setColumns(newColumns);

                const newData = result.data.rows.map((row: any) => {
                    const mappedRow: any = {};
                    result.data.columns.forEach((col: any) => {
                        mappedRow[col.key] = row[col.key];
                    });
                    return mappedRow;
                });
                setData(newData);

                // Reset pagination to page 1
                setPagination((prev) => ({
                    ...prev,
                    pageIndex: 1, // Now we're explicitly setting pageIndex to 1
                }));
            } else {
                console.warn('API response data is null or undefined');
            }
        } catch (error) {
            console.error('Error fetching data for selectedLog:', error);
        }
    };

    // 1. Fetch data when `selectedLog` changes
    useEffect(() => {
        fetchAnomaliesByLog();
    }, []); // Only re-run when selectedLog changes


    return (
        <div className="flex flex-col gap-10 px-14 py-12 card-style">
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row gap-12">
                    <div className="flex flex-col gap-4">
                        <Typography variant="h5" component="h5" color="white" sx={{ lineHeight: 'normal' }}>
                            Filter Anomaly By
                        </Typography>
                        <div className="flex flex-row gap-2">
                            {isLoadingFilter ? (
                                <span className="text-white">Loading filters...</span>
                            ) : hasErrorFilter ? (
                                <span className="text-red-500">Failed to fetch filter list</span>
                            ) : (
                                checkboxOptions.map((option) => (
                                    <ButtonWithCheckbox
                                        key={option.id}
                                        id={option.id}
                                        buttonText={option.label}
                                        isChecked={selectedOptions.includes(option.id)}
                                        onCheckboxChange={handleCheckboxChange}
                                        buttonClassName=""
                                    />
                                ))
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col self-end">
                        <button
                            onClick={handleSubmit}
                            className={`focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center ${hasErrorFilter || selectedOptions ? 'text-black bg-gray-500 cursor-not-allowed' : 'text-white bg-blue-700 hover:bg-blue-800 '}`}
                            disabled={hasErrorFilter || selectedOptions.length === 0}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
                <DropdownRange timeRanges={timeRanges} onRangeChange={handleRangeChange} />
            </div>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-8">
                    <Typography variant="h5" component="h5" color="white">
                        Historical Anomaly Records
                    </Typography>
                    <Box>
                        <div className="overflow-x-auto w-full">
                            <div className="min-w-full">
                                <table id="person" className="table-auto divide-y divide-gray-200 w-full">
                                    <thead>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <tr key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => (
                                                    <th key={header.id} colSpan={header.colSpan} className="p-2">
                                                        <div
                                                            className={`${header.column.getCanSort() ? 'cursor-pointer select-none uppercase font-semibold' : ''} px-3`}
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
                                                        </div>
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
                            </div>
                            <div className="flex mt-4 justify-content-between items-center gap-4 place-content-end">
                                <div className="flex gap-1">
                                    <span className="text-white">Rows per page:</span>
                                    <select
                                        value={table.getState().pagination.pageSize}
                                        onChange={(e) => {
                                            const newPageSize = Number(e.target.value);
                                            table.setPageSize(newPageSize);
                                            setPagination((prev) => ({
                                                ...prev,
                                                pageSize: newPageSize,
                                                pageIndex: 0, // Reset to first page when page size changes
                                            }));
                                        }}
                                        className="select-button-assesment"
                                    >
                                        {[4, 10, 16, 32].map((pageSize) => (
                                            <option key={pageSize} value={pageSize}>
                                                {pageSize}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="text-white">
                                    Page {pagination.pageIndex + 1} of {totalPages}
                                </div>
                                <div className="d-flex">
                                    <button
                                        className="bg-transparent text-white p-2"
                                        onClick={previousPage} disabled={pagination.pageIndex === 1}
                                    >
                                        <ArrowLeft />
                                    </button>
                                    <button
                                        className="bg-transparent text-white p-2"
                                        onClick={nextPage}
                                        disabled={pagination.pageIndex + 1 >= totalPages}
                                    >
                                        <ArrowRight />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Box>
                </div>
                <div className="flex flex-col gap-8">
                    <Typography variant="h5" component="h5" color="white">
                        Graphic Anomaly Records
                    </Typography>
                    {renderChart()}
                </div>
            </div>
        </div>
    )
}

export default TabLogContent
