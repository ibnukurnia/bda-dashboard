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
// import BarChart from '../chart/bar-chart'
// import LineChart from '../chart/line-chart'
import { fetchAnomalyOption, fetchServicesOption, CheckboxOption } from '@/lib/api'
import { Column } from '@/modules/models/anomaly-predictions'
import MultiSelectDropdown from '../button/dropdownCombination'
import FilterPanel from '../button/filterPanel'
// import { AnomalyContext } from '@/contexts/anomaly-context'


interface TabLogContentProps {
    selectedLog: string
    series: { name: string; data: number[] }[]
    categories: string[]
    anomalyCategory: string[]
    anomalyData: { data: number[] }[]
}

const defaultTimeRanges: Record<string, number> = {
    'Last 1 minutes': 1,
    'Last 5 minutes': 5,
    'Last 10 minutes': 10,
    'Last 15 minutes': 15,
    'Last 30 minutes': 30,
    'Last 1 hour': 60,
    'Last 3 hours': 180,
    'Last 12 hours': 720,
    'Last 6 hours': 360,
    'Last 24 hours': 1440,
};

const TabLogContent: React.FC<TabLogContentProps> = ({
    selectedLog,
    // series,
    categories,
    // anomalyCategory,
    // anomalyData,
}) => {
    const optionsMultiple = ["Name", "Email address", "Description", "User ID"];
    const [timeRanges, setTimeRanges] = useState<Record<string, number>>(defaultTimeRanges);
    const [selectedRange, setSelectedRange] = useState<string>('Last 15 minute');
    const [filterAnomalyOptions, setFilterAnomalyOptions] = useState<CheckboxOption[]>([]);
    const [selectedAnomalyOptions, setSelectedAnomalyOptions] = useState<string[]>([]);
    const [filterServicesOptions, setFilterServiceOptions] = useState<string[]>([]);
    const [selectedServicesOptions, setSelectedServiceOptions] = useState<string[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [isLoadingFilter, setIsLoadingFilter] = useState<boolean>(true);
    const [hasErrorFilter, setHasErrorFilter] = useState<boolean>(false);
    const [columns, setColumns] = useState<ColumnDef<any, any>[]>([])
    const [data, setData] = useState<any[]>([])
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pagination, setPagination] = useState({
        pageIndex: 1, // Start from page 1
        pageSize: 10, // Default page size
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

    // const categoriesNew = generateDayWiseTimeSeries(new Date('11 Feb 2017').getTime(), 20, { min: 10, max: 60 }).map(
    //     (d) => new Date(d[0]).toISOString()
    // )

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
        manualPagination: true, // Disable table's internal pagination
        state: {
            pagination,
        },
    });

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
                        height={300}
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

    const handleRangeChange = async (rangeKey: string) => {
        const type = selectedLog === 'Log APM' ? 'apm' : selectedLog === 'Log Brimo' ? 'brimo' : '';

        setSelectedRange(rangeKey);
        const selectedTimeRange = defaultTimeRanges[rangeKey]; // Convert rangeKey to number

        try {
            const filtersAnomaly = selectedAnomalyOptions.length !== 0 ? selectedAnomalyOptions : [];
            const filterServices = selectedServicesOptions.length !== 0 ? selectedServicesOptions : [];
            console.log(selectedAnomalyOptions, selectedServicesOptions)
            const result = await GetHistoricalLogAnomalies(type, 10, 1, filtersAnomaly, filterServices, selectedTimeRange);

            if (result.data && result.data.rows.length > 0) {
                setTotalPages(result.data.total_pages);
                const newData = result.data.rows.map((row: any) => {
                    const mappedRow: any = {};
                    result.data?.columns.forEach((col: any) => {
                        mappedRow[col.key] = row[col.key];
                    });
                    return mappedRow;
                });

                setData(newData); // Update the table data

                // If the API provides a page index, use it; otherwise, set to the current page (1)
                const updatedPageIndex = result.data.page || 1;

                setPagination((prev) => ({
                    ...prev,
                    pageIndex: updatedPageIndex,
                }));
            } else {
                // If no data is found, reset the table data and pagination
                setData([]);
                setPagination((prev) => ({
                    ...prev,
                    pageIndex: 1, // Reset pageIndex to 1
                }));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // In case of error, you might also want to reset the pagination
            setPagination((prev) => ({
                ...prev,
                pageIndex: 1, // Reset pageIndex to 1 in case of error
            }));
        }
    };


    const fetchDataByLog = async (
        logType: string,
        page: number,
        limit: number,
        filter: string[] = [],
        date_range: number
    ) => {
        try {
            // Call the API to get historical log anomalies
            const result = await GetHistoricalLogAnomalies(logType, limit, page, selectedAnomalyOptions, selectedServicesOptions, date_range);

            if (result.data) {
                // Update the total number of pages based on the API response
                setTotalPages(result.data.total_pages);

                // Map the columns from the API response to the format required by the table
                const newColumns = result.data.columns.map((column: any) => ({
                    id: column.key,
                    header: column.title,
                    accessorKey: column.key,
                }));
                setColumns(newColumns);

                // Map the rows from the API response to the format required by the table
                const newData = result.data.rows.map((row: any) => {
                    const mappedRow: any = {};
                    result.data?.columns.forEach((col: any) => {
                        mappedRow[col.key] = row[col.key];
                    });
                    return mappedRow;
                });

                // Update the table data
                setData(newData);
            } else {
                // Log a warning if the API response is missing data
                console.warn('API response data is null or undefined');
            }
        } catch (error) {
            // Log an error if the API call fails
            console.error('Error fetching data for selectedLog:', error);
        }
    };

    // Function to fetch data based on pagination
    const fetchDataByPagination = async (page: number, limit: number, filter: string[] = [], date_range: number) => {
        console.log('Fetching data for page:', page);
        let type = selectedLog === 'Log APM' ? 'apm' : selectedLog === 'Log Brimo' ? 'brimo' : '';
        if (!type) {
            console.warn('Unknown log type:', selectedLog);
            return;
        }

        try {
            const result = await GetHistoricalLogAnomalies(type, limit, page, [], [], 15);

            if (result.data) {
                // Update columns and data
                const newColumns = result.data.columns.map((column: any) => ({
                    id: column.key,
                    header: column.title,
                    accessorKey: column.key,
                }));
                setColumns(newColumns);

                const newData = result.data.rows.map((row: any) => {
                    const mappedRow: any = {};
                    result.data?.columns.forEach((col: any) => {
                        mappedRow[col.key] = row[col.key];
                    });
                    return mappedRow;
                });
                setData(newData);
            } else {
                console.warn('API response data is null or undefined');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const nextPage = () => {
        const logType = selectedLog === 'Log APM' ? 'apm' : selectedLog === 'Log Brimo' ? 'brimo' : '';
        if (selectedOptions.length !== 0) {
            // If there are selected filters, hit the API with the filters
            setPagination((prev) => {
                const newPageIndex = Math.min(prev.pageIndex + 1, totalPages);
                GetHistoricalLogAnomalies(logType, prev.pageSize, newPageIndex, selectedAnomalyOptions, selectedServicesOptions, 15) // Fetch data with filters for the new page
                    .then(result => {
                        // Process the result and update the state
                        if (result.data) {
                            // Update columns and data
                            const newColumns = result.data.columns.map((column: any) => ({
                                id: column.key,
                                header: column.title,
                                accessorKey: column.key,
                            }));
                            setColumns(newColumns);

                            const newData = result.data.rows.map((row: any) => {
                                const mappedRow: any = {};
                                result.data?.columns.forEach((col: any) => {
                                    mappedRow[col.key] = row[col.key];
                                });
                                return mappedRow;
                            });
                            setData(newData);
                        } else {
                            console.warn('API response data is null or undefined');
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching data with filters:', error);
                    });
                return { ...prev, pageIndex: newPageIndex };
            });
        } else {
            // If no filters are selected, proceed with normal pagination
            setPagination((prev) => {
                const newPageIndex = Math.min(prev.pageIndex + 1, totalPages);
                fetchDataByPagination(newPageIndex, prev.pageSize, [], 15); // Fetch data for the new page
                return { ...prev, pageIndex: newPageIndex };
            });
        }
    };

    const previousPage = () => {
        setPagination((prev) => {
            const newPageIndex = Math.max(prev.pageIndex - 1, 1);
            fetchDataByPagination(newPageIndex, prev.pageSize, [], 15); // Fetch data for the previous page
            return { ...prev, pageIndex: newPageIndex };
        });
    };

    const loadAnomalyFilterOptions = async () => {
        try {
            const response = await fetchAnomalyOption(selectedLog === 'Log Brimo' ? 'brimo' : '');
            console.log('API Response:', response); // Log the entire API response


            if (response.data && response.data.columns) {
                const options = response.data.columns.map((column: Column) => ({
                    id: column.name,                   // Maps the "name" to "id"
                    label: column.comment || column.name, // Maps the "comment" to "label", falls back to "name" if "comment" is missing
                    type: column.type,                 // Maps the "type" to "type"
                }));

                console.log('Mapped Checkbox Options:', options); // Log the mapped options

                setFilterAnomalyOptions(options); // Update state with fetched options
            } else {
                console.error('Response data or columns are missing');
                setHasErrorFilter(true);
            }
        } catch (error) {
            console.error('Failed to load checkbox options', error);
            setHasErrorFilter(true);
        } finally {
            setIsLoadingFilter(false);
        }
    };

    const loadServicesFilterOptions = async () => {
        try {
            const response = await fetchServicesOption(selectedLog === 'Log Brimo' ? 'brimo' : '');
            console.log('API Response:', response); // Log the entire API response

            if (response.data && response.data.services) {
                // No need to map as it's already an array of strings
                const services = response.data.services;

                console.log('Service Options:', services); // Log the services array

                setFilterServiceOptions(services); // Update state with fetched service options
            } else {
                console.error('Response data or services are missing');
                setHasErrorFilter(true);
            }
        } catch (error) {
            console.error('Failed to load service options', error);
            setHasErrorFilter(true);
        } finally {
            setIsLoadingFilter(false);
        }
    };

    const handleResetFilters = () => {
        // Clear the selected options
        setSelectedAnomalyOptions([]);
        setSelectedServiceOptions([]);

        // Optionally, reset other filters or fetch the default data
        console.log('Filters reset');

    };


    // const handleApplyFilters = (filters: string[]) => {
    //     const type = selectedLog === 'Log APM' ? 'apm' : selectedLog === 'Log Brimo' ? 'brimo' : '';
    //     setSelectedAnomalyOptions(filters);
    //     GetHistoricalLogAnomalies(type, 10, 1, filters, 15)
    //     console.log(selectedAnomalyOptions)
    //     console.log('Selected Anomaly Options:', filters);
    //     // Trigger API call or any other action based on selected filters
    // };

    const handleApplyFilters = async (filters: { selectedAnomalies: string[], selectedServices: string[] }) => {
        const { selectedAnomalies, selectedServices } = filters;

        // Update the state with the selected options
        setSelectedAnomalyOptions(selectedAnomalies);
        setSelectedServiceOptions(selectedServices);

        // Example: Fetch data based on the selected filters
        const type = selectedLog === 'Log APM' ? 'apm' : 'brimo';
        const timeRangeValue = timeRanges[selectedRange]; // Get the specific time range value

        try {
            // Call the API with the selected filters and time range value
            const result = await GetHistoricalLogAnomalies(
                type,
                pagination.pageSize, // Use the current page size
                1, // Start from the first page
                selectedAnomalies,
                selectedServices,
                timeRangeValue || 15 // Use the selected time range or fallback to 15 minutes
            );

            if (result.data) {
                // Update the total number of pages based on the API response
                setTotalPages(result.data.total_pages);

                // Map the columns from the API response to the format required by the table
                const newColumns = result.data.columns.map((column: any) => ({
                    id: column.key,
                    header: column.title,
                    accessorKey: column.key,
                }));
                setColumns(newColumns);

                // Map the rows from the API response to the format required by the table
                const newData = result.data.rows.map((row: any) => {
                    const mappedRow: any = {};
                    result.data?.columns.forEach((col: any) => {
                        mappedRow[col.key] = row[col.key];
                    });
                    return mappedRow;
                });

                // Update the table data
                setData(newData);

                // Update the pagination state, resetting to the first page
                setPagination((prev) => ({
                    ...prev,
                    pageIndex: 1, // Reset to the first page after applying filters
                }));
            } else {
                // Log a warning if the API response is missing data
                console.warn('API response data is null or undefined');
            }
        } catch (error) {
            // Log an error if the API call fails
            console.error('Error fetching data for selectedLog:', error);
        }
    };

    // Initial fetch when component mounts or selectedLog changes
    useEffect(() => {
        const type = selectedLog === 'Log APM' ? 'apm' : selectedLog === 'Log Brimo' ? 'brimo' : '';
        fetchDataByLog(type, pagination.pageIndex, pagination.pageSize, [], 15);
    }, []);

    useEffect(() => {
        loadAnomalyFilterOptions();
        loadServicesFilterOptions();
    }, [selectedLog]);



    return (
        <div className="flex flex-col gap-10 px-14 py-12 card-style">
            <div className="flex flex-row justify-between items-center">
                {/* <div className="flex flex-row gap-10">
                    <div className="flex flex-col gap-4">
                        <Typography variant="h5" component="h5" color="white">
                            Filter Anomaly By
                        </Typography>
                        <div className="flex flex-row gap-2">
                            {isLoadingFilter ? (
                                <span className="text-white">Loading filters...</span>
                            ) : hasErrorFilter ? (
                                <span className="text-red-500">Failed to fetch filter list</span>
                            ) : (
                                filterAnomalyOptions.map((option) => (
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
                            className={`focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center ${hasErrorFilter || selectedOptions.length === 0 ? 'text-black bg-gray-500 cursor-not-allowed' : 'text-white bg-blue-700 hover:bg-blue-800 '}`}
                            disabled={selectedOptions.length === 0}
                        >
                            Confirm
                        </button>
                    </div>
                </div> */}
                <FilterPanel
                    servicesOptions={filterServicesOptions}
                    checkboxOptions={filterAnomalyOptions}
                    onApplyFilters={handleApplyFilters}
                    onResetFilters={handleResetFilters}
                />
                {/* <div className="flex self-end w-64">
                    <MultiSelectDropdown options={optionsMultiple} />
                </div> */}
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
                                        {data.length === 0 ? (
                                            <tr>
                                                <td colSpan={table.getAllColumns().length} className="text-center py-4">
                                                    <div className="text-center text-2xl font-semibold text-white">
                                                        DATA IS NOT AVAILABLE
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            table.getRowModel().rows.map((row) => (
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
                                            disabled={pagination.pageIndex + 1 >= totalPages}
                                        >
                                            <ArrowRight />
                                        </button>
                                    </div>
                                </div>
                            )}

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
