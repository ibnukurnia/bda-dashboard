import React, { useContext, useEffect, useState } from 'react'
import { Column } from '@/modules/models/anomaly-predictions'
import { GetHistoricalLogAnomalies, GetMetricLogAnomalies } from '@/modules/usecases/anomaly-predictions'
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
import { CheckboxOption, fetchAnomalyOption, fetchServicesOption } from '@/lib/api'
import DropdownRange from '../../dropdownRange'
import FilterPanel from '../button/filterPanel'
// import { AnomalyContext } from '@/contexts/anomaly-context'
import GraphAnomalyCard from '../card/graph-anomaly-card'

import { format } from 'date-fns';

interface TabLogContentProps {
    selectedLog: string
    series: { name: string; data: number[] }[]
    categories: string[]
    anomalyCategory: string[]
    anomalyData: { data: number[] }[]
}

const defaultTimeRanges: Record<string, number> = {
    'Last 5 minutes': 5,
    'Last 15 minutes': 15,
    'Last 30 minutes': 30,
    'Last 1 hours': 60,
    'Last 6 hours': 360,
    'Last 24 hours': 1440,
    'Last 3 days': 4320,
    'Last 1 week': 10080,
    'Last 1 month': 43800,
}

const TabLogContent: React.FC<TabLogContentProps> = ({
    selectedLog,
}) => {
    const [timeRanges, setTimeRanges] = useState<Record<string, number>>(defaultTimeRanges)
    const [selectedRange, setSelectedRange] = useState<string>('Last 15 minutes')
    const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
    const [timeDifference, setTimeDifference] = useState<string>('Refreshed just now');
    const [startTime, setStartTime] = useState<string>('')
    const [endTime, setEndTime] = useState<string>('')
    const [filterAnomalyOptions, setFilterAnomalyOptions] = useState<CheckboxOption[]>([])
    const [selectedAnomalyOptions, setSelectedAnomalyOptions] = useState<string[]>([])
    const [filterServicesOptions, setFilterServiceOptions] = useState<string[]>([])
    const [selectedServicesOptions, setSelectedServiceOptions] = useState<string[]>([])
    const logType = selectedLog === 'Log APM' ? 'apm' : selectedLog === 'Log Brimo' ? 'brimo' : ''
    const [isLoadingFilter, setIsLoadingFilter] = useState<boolean>(true)
    const [hasErrorFilter, setHasErrorFilter] = useState<boolean>(false)
    const [columns, setColumns] = useState<ColumnDef<any, any>[]>([])
    const [data, setData] = useState<any[]>([])
    const [totalPages, setTotalPages] = useState<number>(1)
    const [isTableLoading, setIsTableLoading] = useState(true) // Table loading state
    const [isChartLoading, setIsChartLoading] = useState(true) // Chart loading state
    const [pagination, setPagination] = useState({
        pageIndex: 1, // Start from page 1
        pageSize: 10, // Default page size
    })

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
    })

    // const renderChart = () => {
    //     if (dataMetric.length === 0) {
    //         return (
    //             <div className="flex justify-center items-center">
    //                 <div className="spinner"></div>
    //             </div>
    //         )
    //     }

    //     switch (selectedLog) {
    //         case 'Log APM':
    //         case 'Log Brimo':
    //             // Get the keys of the object as an array
    //             const keys = Object.keys(defaultTimeRanges);
    //             // Find the index of the key
    //             const selectedKeyIndex = keys.indexOf(currentZoomDateRange);

    //             return (
    //                 <SynchronizedCharts
    //                     dataCharts={dataMetric} // Ensure dataMetric is relevant for Log Type
    //                     height={300}
    //                     width="100%"
    //                     zoomInDisabled={selectedKeyIndex <= 0}
    //                     zoomOutDisabled={selectedKeyIndex >= keys.length - 1}
    //                     onZoomIn={handleGraphZoomIn}
    //                     onZoomOut={handleGraphZoomOut}
    //                     minXOnEmpty={new Date().getTime() - timeRanges[currentZoomDateRange] * 60 * 1000}
    //                     maxXOnEmpty={new Date().getTime()}
    //                 />
    //             );
    //         default:
    //             return (
    //                 <Typography variant="h6" component="h6" color="white">
    //                     No chart available for {selectedLog}
    //                 </Typography>
    //             )
    //     }
    // }

    const getLogType = (selectedLog: string): string => {
        switch (selectedLog) {
            case 'Log APM':
                return 'apm';
            case 'Log Brimo':
                return 'brimo';
            default:
                return '';
        }
    };

    // Helper function to calculate startTime and endTime
    const getTimeRange = () => {
        const formatWithZeroSeconds = (date: Date) => {
            // Get the date components
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            // Return formatted date with seconds set to '00'
            return `${year}-${month}-${day} ${hours}:${minutes}:00`;
        };

        const currentTime = new Date();
        const defaultEndTime = formatWithZeroSeconds(currentTime);
        const defaultStartTime = formatWithZeroSeconds(new Date(currentTime.getTime() - 15 * 60 * 1000));

        const startTimeValue = startTime || defaultStartTime;
        const endTimeValue = endTime || defaultEndTime;

        return { startTimeValue, endTimeValue };
    };

    const handleRangeChange = async (rangeKey: string) => {
        const logType = getLogType(selectedLog);

        let startDate: string;
        let endDate: string;

        if (rangeKey.includes(' - ')) {
            // Handle custom range
            const [start, end] = rangeKey.split(' - ');
            startDate = start;
            endDate = end;
        } else {
            // Handle predefined ranges
            const selectedTimeRange = defaultTimeRanges[rangeKey]; // Get the selected time range in minutes

            // Calculate endDate as the current time, rounding down the seconds to 00
            const endDateObj = new Date();
            endDateObj.setSeconds(0, 0); // Set seconds and milliseconds to 00

            // Calculate startDate by subtracting the selected time range (in minutes) from the endDate
            const startDateObj = new Date(endDateObj.getTime() - selectedTimeRange * 60000); // 60000 ms = 1 minute

            // Convert startDate and endDate to strings
            startDate = format(startDateObj, 'yyyy-MM-dd HH:mm:ss');
            endDate = format(endDateObj, 'yyyy-MM-dd HH:mm:ss');
        }

        // Update the state for startDate and endDate
        setStartTime(startDate);
        setEndTime(endDate);

        // Update the selected range state
        setSelectedRange(rangeKey);
        setLastRefreshTime(new Date());

        const filtersAnomaly = selectedAnomalyOptions.length > 0 ? selectedAnomalyOptions : [];
        const filterServices = selectedServicesOptions.length > 0 ? selectedServicesOptions : [];

        try {
            // Initiate both API calls concurrently and independently
            const logResultPromise = GetHistoricalLogAnomalies(
                logType,
                10,
                1,
                filtersAnomaly,
                filterServices,
                startDate,
                endDate
            );
            const metricResultPromise = GetMetricLogAnomalies(logType, 15, "rozhok", []);

            // Handle the result of the GetHistoricalLogAnomalies API call
            logResultPromise
                .then((logResult) => {
                    if (logResult.data) {
                        const { rows, columns, total_pages, page } = logResult.data;

                        if (rows.length > 0) {
                            // Update the total number of pages based on the API response
                            setTotalPages(total_pages);

                            // Map the rows to the format required by the table
                            const newData = rows.map((row: any) => {
                                const mappedRow: any = {};
                                columns.forEach((col: any) => {
                                    mappedRow[col.key] = row[col.key];
                                });
                                return mappedRow;
                            });

                            setData(newData); // Update the table data

                            // Update the pagination state
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex: page || 1,
                            }));
                        } else {
                            // Reset the table data and pagination if no data is found
                            setData([]);
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex: 1,
                            }));
                        }
                    } else {
                        console.warn('API response data is null or undefined');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching historical log anomalies:', error);
                    // Reset pagination in case of an error
                    setPagination((prev) => ({
                        ...prev,
                        pageIndex: 1,
                    }));
                });

            // Handle the result of the GetMetricAnomalies API call
            metricResultPromise
                .then((metricResult) => {
                    if (metricResult.data) {
                        // setDataMetric(metricResult.data);
                    } else {
                        console.warn('API response data is null or undefined for metrics');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching metric anomalies:', error);
                });
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };


    const updateTimeDifference = () => {
        if (!lastRefreshTime) return;

        const now = new Date();
        console.log(now)
        const diffInSeconds = Math.floor((now.getTime() - lastRefreshTime.getTime()) / 1000);

        if (diffInSeconds < 60) {
            setTimeDifference(`Refreshed 2 sec ago`);
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            setTimeDifference(`Refreshed ${minutes} min${minutes > 1 ? 's' : ''} ago`);
        } else {
            const hours = Math.floor(diffInSeconds / 3600);
            setTimeDifference(`Refreshed ${hours} hour${hours > 1 ? 's' : ''} ago`);
        }
    };

    const handlePageSizeChange = async (
        newPageSize: number,
        logType: string,
        page: number,
        filter: string[] = []
    ) => {
        table.setPageSize(newPageSize);
        setPagination((prev) => ({
            ...prev,
            pageSize: newPageSize,
            pageIndex: 0, // Reset to the first page when page size changes
        }));


        // Get startTime and endTime using the helper function
        const { startTimeValue, endTimeValue } = getTimeRange();

        // Call API with the new page size and the startTime and endTime values
        try {
            const logAnomaliesPromise = GetHistoricalLogAnomalies(
                logType,
                newPageSize, // Set limit as the new page size
                page, // Reset to the first page
                filter,
                selectedServicesOptions,
                startTimeValue, // Pass startTime as a string
                endTimeValue // Pass endTime as a string
            );

            logAnomaliesPromise
                .then((result) => {
                    if (result.data) {
                        const { columns, rows, total_pages } = result.data;

                        // Update the total number of pages based on the API response
                        setTotalPages(total_pages);

                        // Map the columns from the API response to the format required by the table
                        const newColumns = columns.map((column: any) => ({
                            id: column.key,
                            header: column.title,
                            accessorKey: column.key,
                        }));
                        setColumns(newColumns);

                        // Map the rows from the API response to the format required by the table
                        const newData = rows.map((row: any) => {
                            const mappedRow: any = {};
                            columns.forEach((col: any) => {
                                mappedRow[col.key] = row[col.key];
                            });
                            return mappedRow;
                        });

                        // Update the table data
                        setData(newData);
                        setIsTableLoading(false);
                    } else {
                        console.warn('API response data is null or undefined');
                    }
                })
                .catch((error) => {
                    handleApiError(error);
                });

        } catch (error) {
            handleApiError(error);
        }
    };


    const fetchDataByLog = async (
        logType: string,
        page: number,
        limit: number,
        filter: string[] = []
    ) => {

        // Get startTime and endTime using the helper function
        const { startTimeValue, endTimeValue } = getTimeRange();

        // Start both API calls concurrently
        const logAnomaliesPromise = GetHistoricalLogAnomalies(
            logType,
            limit,
            page,
            selectedAnomalyOptions,
            selectedServicesOptions,
            startTimeValue, // Use formatted startTimeToUse
            endTimeValue// Use formatted endTimeToUse
        );

        // Handle the result of the first API call
        logAnomaliesPromise
            .then((result) => {
                if (result.data) {
                    const { columns, rows, total_pages } = result.data;

                    // Update the total number of pages based on the API response
                    setTotalPages(total_pages);

                    // Map the columns from the API response to the format required by the table
                    const newColumns = columns.map((column: any) => ({
                        id: column.key,
                        header: column.title,
                        accessorKey: column.key,
                    }));
                    setColumns(newColumns);

                    // Map the rows from the API response to the format required by the table
                    const newData = rows.map((row: any) => {
                        const mappedRow: any = {};
                        columns.forEach((col: any) => {
                            mappedRow[col.key] = row[col.key];
                        });
                        return mappedRow;
                    });

                    // Update the table data
                    setData(newData);
                    setIsTableLoading(false);
                } else {
                    console.warn('API response data is null or undefined');
                }
            })
            .catch((error) => {
                handleApiError(error);
            });
    };

    // Function to fetch data based on pagination
    const fetchDataByPagination = async (
        page: number,
        limit: number,
        filter: string[] = [],
        start_time: string,
        end_time: string
    ) => {
        console.log('Fetching data for page:', page);

        // Determine the log type based on the selected log
        const logType = getLogType(selectedLog);
        const { startTimeValue, endTimeValue } = getTimeRange();

        try {
            // Make the API call with startTime and endTime instead of date_range
            const result = await GetHistoricalLogAnomalies(logType, limit, page, filter, selectedServicesOptions, startTimeValue, endTimeValue);

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

    const processApiResult = (result: any) => {
        if (result && result.data) {
            // Update columns and data
            const newColumns = result.data.columns.map((column: any) => ({
                id: column.key,
                header: column.title,
                accessorKey: column.key,
            }))
            setColumns(newColumns)

            const newData = result.data.rows.map((row: any) => {
                const mappedRow: any = {}
                result.data.columns.forEach((col: any) => {
                    mappedRow[col.key] = row[col.key]
                })
                return mappedRow
            })
            setData(newData)
        } else {
            console.warn('API response data is null or undefined')
        }
    }

    // Function to handle API errors
    const handleApiError = (error: any) => {
        console.error('Error fetching data:', error)
    }

    const loadAnomalyFilterOptions = async () => {
        try {
            const response = await fetchAnomalyOption(selectedLog === 'Log Brimo' ? 'brimo' : '')
            console.log('API Response:', response) // Log the entire API response

            if (response.data && response.data.columns) {
                const options = response.data.columns.map((column: Column) => ({
                    id: column.name, // Maps the "name" to "id"
                    label: column.comment || column.name, // Maps the "comment" to "label", falls back to "name" if "comment" is missing
                    type: column.type, // Maps the "type" to "type"
                }))

                console.log('Mapped Checkbox Options:', options) // Log the mapped options

                setFilterAnomalyOptions(options) // Update state with fetched options
            } else {
                console.error('Response data or columns are missing')
                setHasErrorFilter(true)
            }
        } catch (error) {
            handleApiError(error)
            setHasErrorFilter(true)
        } finally {
            setIsLoadingFilter(false)
        }
    }

    const loadServicesFilterOptions = async () => {
        try {
            const response = await fetchServicesOption(selectedLog === 'Log Brimo' ? 'brimo' : '')
            console.log('API Response:', response) // Log the entire API response

            if (response.data && response.data.services) {
                // No need to map as it's already an array of strings
                const services = response.data.services

                console.log('Service Options:', services) // Log the services array

                setFilterServiceOptions(services) // Update state with fetched service options
            } else {
                console.error('Response data or services are missing')
                setHasErrorFilter(true)
            }
        } catch (error) {
            console.error('Failed to load service options', error)
            setHasErrorFilter(true)
        } finally {
            setIsLoadingFilter(false)
        }
    }

    const handleResetFilters = () => {
        // Clear the selected options
        setSelectedAnomalyOptions([])
        setSelectedServiceOptions([])
        // Optionally, reset other filters or fetch the default data
        console.log('Filters reset')
    }

    const handleApplyFilters = async (filters: { selectedAnomalies: string[]; selectedServices: string[] }) => {
        const { selectedAnomalies, selectedServices } = filters;

        // Update the state with the selected options
        setSelectedAnomalyOptions(selectedAnomalies);
        setSelectedServiceOptions(selectedServices);

        // Determine the log type
        const logType = getLogType(selectedLog);
        const { startTimeValue, endTimeValue } = getTimeRange();

        // Initiate both API calls concurrently and independently
        const logAnomaliesPromise = GetHistoricalLogAnomalies(
            logType,
            pagination.pageSize, // Use the current page size
            1, // Start from the first page
            selectedAnomalies,
            selectedServices,
            startTimeValue, // Pass startTime
            endTimeValue // Pass endTime
        );

        // Handle the result of the log anomalies API call
        logAnomaliesPromise
            .then((result) => {
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
                    console.warn('API response data is null or undefined');
                }
            })
            .catch(handleApiError);

        // Handle the result of the metric anomalies API call

    };

    const nextPage = () => {
        const logType = getLogType(selectedLog);

        setPagination((prev) => {
            const newPageIndex = Math.min(prev.pageIndex + 1, totalPages);
            const { startTimeValue, endTimeValue } = getTimeRange();
            // Define a function to call the API with the appropriate filters
            const callApi = (anomalyOptions: string[], serviceOptions: string[]) => {
                GetHistoricalLogAnomalies(
                    logType,
                    prev.pageSize,
                    newPageIndex,
                    anomalyOptions,
                    serviceOptions,
                    startTimeValue,
                    endTimeValue
                )
                    .then((result) => processApiResult(result))
                    .catch((error) => handleApiError(error));
            };

            // Handle different filter scenarios
            if (selectedAnomalyOptions.length !== 0 && selectedServicesOptions.length === 0) {
                // If only anomaly options are selected
                callApi(selectedAnomalyOptions, []);
            } else if (selectedServicesOptions.length !== 0 && selectedAnomalyOptions.length === 0) {
                // If only service options are selected
                callApi([], selectedServicesOptions);
            } else if (selectedAnomalyOptions.length !== 0 && selectedServicesOptions.length !== 0) {
                // If both anomaly and service options are selected
                callApi(selectedAnomalyOptions, selectedServicesOptions);
            } else {
                // If no filters are selected, proceed with normal pagination
                fetchDataByPagination(newPageIndex, prev.pageSize, [], startTimeValue, endTimeValue)
                    .then((result) => processApiResult(result))
                    .catch((error) => handleApiError(error));
            }

            return { ...prev, pageIndex: newPageIndex };
        });
    };

    const previousPage = () => {
        const logType = getLogType(selectedLog);

        setPagination((prev) => {
            const newPageIndex = Math.max(prev.pageIndex - 1, 1);
            const { startTimeValue, endTimeValue } = getTimeRange();

            // Determine the appropriate API call based on the selected filters
            const logAnomaliesPromise = (() => {
                if (selectedAnomalyOptions.length !== 0 && selectedServicesOptions.length === 0) {
                    // If only anomaly options are selected
                    return GetHistoricalLogAnomalies(
                        logType,
                        prev.pageSize,
                        newPageIndex,
                        selectedAnomalyOptions,
                        [],
                        startTimeValue,
                        endTimeValue
                    );
                } else if (selectedServicesOptions.length !== 0 && selectedAnomalyOptions.length === 0) {
                    // If only service options are selected
                    return GetHistoricalLogAnomalies(
                        logType,
                        prev.pageSize,
                        newPageIndex,
                        [],
                        selectedServicesOptions,
                        startTimeValue,
                        endTimeValue
                    );
                } else if (selectedAnomalyOptions.length !== 0 && selectedServicesOptions.length !== 0) {
                    // If both anomaly and service options are selected
                    return GetHistoricalLogAnomalies(
                        logType,
                        prev.pageSize,
                        newPageIndex,
                        selectedAnomalyOptions,
                        selectedServicesOptions,
                        startTimeValue,
                        endTimeValue
                    );
                } else {
                    // If no filters are selected, proceed with normal pagination
                    return fetchDataByPagination(newPageIndex, prev.pageSize, [], startTimeValue, endTimeValue);
                }
            })();

            // Handle the API call response
            logAnomaliesPromise
                .then((result) => processApiResult(result))
                .catch((error) => handleApiError(error));

            return { ...prev, pageIndex: newPageIndex };
        });
    };

    useEffect(() => {
        const type = selectedLog === 'Log APM' ? 'apm' : selectedLog === 'Log Brimo' ? 'brimo' : '';

        if (type) {
            // Fetch data based on the selected log
            fetchDataByLog(type, pagination.pageIndex, pagination.pageSize, []);

            // Load filter options and reset the selected range
            loadAnomalyFilterOptions();
            loadServicesFilterOptions();

            // Reset Time Range to the default 15 minutes
            setSelectedRange('Last 15 minutes');
        }
    }, [selectedLog]);


    useEffect(() => {
        // Get the keys of the object as an array
        const keys = Object.keys(defaultTimeRanges);
        // Find the index of the key
        const selectedKeyIndex = keys.indexOf(selectedRange === '' ? 'Last 15 minutes' : selectedRange);

        // setCurrentZoomDateRange(keys[selectedKeyIndex])
    }, [selectedRange])

    useEffect(() => {
        // Update the time difference every second
        const intervalId = setInterval(updateTimeDifference, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [lastRefreshTime]);

    return (
        <div className="flex flex-col gap-10 px-14 py-12 card-style z-50">
            <div className="flex flex-row justify-between items-center">
                <FilterPanel
                    servicesOptions={filterServicesOptions}
                    checkboxOptions={filterAnomalyOptions}
                    onApplyFilters={handleApplyFilters}
                    onResetFilters={handleResetFilters}
                />
                <div className="flex flex-row gap-2 self-center items-center">
                    <Typography variant="body2" component="p" color="white">
                        {timeDifference}
                    </Typography>
                    <DropdownRange
                        timeRanges={timeRanges}
                        onRangeChange={handleRangeChange}
                        selectedRange={selectedRange} // Pass selectedRange as a prop
                    />
                </div>
            </div>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-8">
                    <Typography variant="h5" component="h5" color="white">
                        Historical Anomaly Records
                    </Typography>
                    <Box>
                        <div className={`w-full ${!isTableLoading && data.length > 0 ? 'overflow-x-auto' : ''}`}>
                            <div className="min-w-full">
                                {isTableLoading ? (
                                    <div className="flex justify-center items-center">
                                        <div className="spinner"></div>
                                    </div>
                                ) : data.length === 0 && !isTableLoading ? (
                                    <div className="text-center py-4">
                                        <div className="text-center text-2xl font-semibold text-white">DATA IS NOT AVAILABLE</div>
                                    </div>
                                ) : (
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
                                )}
                            </div>
                            {data.length > 0 && !isTableLoading && (
                                <div className="flex mt-4 justify-content-between items-center gap-4 place-content-end">
                                    <div className="flex gap-1">
                                        <span className="text-white">Rows per page:</span>
                                        <select
                                            value={table.getState().pagination.pageSize}
                                            onChange={(e) => {
                                                const newPageSize = Number(e.target.value);
                                                handlePageSizeChange(newPageSize, logType, 1, selectedAnomalyOptions);
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
                                            className={`p-2 ${pagination.pageIndex === 1 ? 'text-gray-500 cursor-not-allowed' : 'bg-transparent text-white'}`}
                                            onClick={previousPage}
                                            disabled={pagination.pageIndex === 1}
                                        >
                                            <ArrowLeft />
                                        </button>
                                        <button
                                            className={`p-2 ${pagination.pageIndex === totalPages ? 'text-gray-500 cursor-not-allowed' : 'bg-transparent text-white'}`}
                                            onClick={nextPage}
                                            disabled={pagination.pageIndex === totalPages}
                                        >
                                            <ArrowRight />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Box>
                </div>
                <GraphAnomalyCard
                    selectedLog={selectedLog === 'Log APM' ? 'apm' : selectedLog === 'Log Brimo' ? 'brimo' : ''}
                    servicesOptions={filterServicesOptions}
                    selectedTimeRangeKey={selectedRange}
                    timeRanges={timeRanges}
                />
            </div>
        </div>
    )
}

export default TabLogContent
