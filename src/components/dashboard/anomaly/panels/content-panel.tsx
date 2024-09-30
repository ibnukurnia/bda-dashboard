import React, { useEffect, useState } from 'react'
import { Column } from '@/modules/models/anomaly-predictions'
import { GetHistoricalLogAnomalies } from '@/modules/usecases/anomaly-predictions'
import { Box, TablePagination, Typography } from '@mui/material'
import {
    ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { CheckboxOption, fetchAnomalyOption, fetchServicesOption } from '@/lib/api'
import DropdownTime from '../button/dropdown-time'
import FilterPanel from '../button/filterPanel'
import GraphAnomalyCard from '../card/graph-anomaly-card'
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { format } from 'date-fns';
import AutoRefreshButton from '../button/refreshButton'
import { NAMESPACE_LABELS, PREDEFINED_TIME_RANGES, ROWS_PER_PAGE_OPTIONS } from '@/constants'
import { useRouter, useSearchParams } from 'next/navigation'
import { formatNumberWithCommas } from '../../../../helper';

interface TabContentProps {
    selectedDataSource: string
    selectedTimeRange: string
}

const TabContent: React.FC<TabContentProps> = ({
    selectedDataSource,
    selectedTimeRange,
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const selectedAnomalyOptions = searchParams.getAll("anomaly")
    const selectedServicesOptions = searchParams.getAll("service")
    const selectedSeverityOptions = searchParams.getAll("severity").map(Number);
    const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
    const [timeDifference, setTimeDifference] = useState<string>('Refreshed just now');
    const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
    const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
    const [graphAutoRefresh, setGraphAutoRefresh] = useState<{
        enabled: boolean;
        interval: number | null;
    }>({
        enabled: false,
        interval: null,
    })
    const [filterAnomalyOptions, setFilterAnomalyOptions] = useState<CheckboxOption[]>([])
    const [filterServicesOptions, setFilterServiceOptions] = useState<string[]>([])
    const [filterSeverityOptions, setFilterSeverityOptions] = useState<{ id: number; label: string; type: string }[]>([]);
    const [hasErrorFilterAnomaly, setHasErrorAnomalyFilter] = useState<boolean>(false)
    const [hasErrorFilterService, setHasErrorServiceFilter] = useState<boolean>(false)
    const [columns, setColumns] = useState<ColumnDef<any, any>[]>([])
    const [data, setData] = useState<any[]>([])
    const [totalPages, setTotalPages] = useState<number>(1)
    const [totalRows, setTotalRows] = useState<number>(1)
    const [isTableLoading, setIsTableLoading] = useState(true) // Table loading state
    const [pagination, setPagination] = useState({
        pageIndex: 1, // Start from page 1
        pageSize: 10, // Default page size
    })
    const handle = useFullScreenHandle();

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

    // Helper function to calculate startTime and endTime
    const getTimeRange = (timeRange: string = selectedTimeRange) => {
        let startTime: string
        let endTime: string

        if (timeRange.includes(' - ')) {
            // Handle custom range
            const [start, end] = timeRange.split(' - ');
            startTime = start;
            endTime = end;
        } else {
            // Handle predefined ranges
            const selectedTimeRange = PREDEFINED_TIME_RANGES[timeRange]; // Get the selected time range in minutes

            // Calculate endDate as the current time, rounding down the seconds to 00
            const endDateObj = new Date();
            endDateObj.setSeconds(0, 0); // Set seconds and milliseconds to 00

            // Calculate startDate by subtracting the selected time range (in minutes) from the endDate
            const startDateObj = new Date(endDateObj.getTime() - selectedTimeRange * 60000); // 60000 ms = 1 minute

            // Convert startDate and endDate to strings
            startTime = format(startDateObj, 'yyyy-MM-dd HH:mm:ss');
            endTime = format(endDateObj, 'yyyy-MM-dd HH:mm:ss');
        }

        return { startTime, endTime };
    };

    const handleRangeChange = async (rangeKey: string) => {
        const { startTime, endTime } = getTimeRange(rangeKey);

        console.log(selectedSeverityOptions)

        // Update the selected range state
        const params = new URLSearchParams(searchParams.toString());
        params.set('time_range', rangeKey);
        router.push(`/dashboard/anomaly-detection?${params.toString()}`);

        setLastRefreshTime(new Date());

        const filtersAnomaly = selectedAnomalyOptions.length > 0 ? selectedAnomalyOptions : [];
        const filterServices = selectedServicesOptions.length > 0 ? selectedServicesOptions : [];
        const filterSeverities = selectedSeverityOptions.length > 0 ? selectedSeverityOptions : []; // These are now numbers

        try {
            // Initiate both API calls concurrently and independently
            const logResultPromise = GetHistoricalLogAnomalies(
                selectedDataSource,
                10,
                1,
                filtersAnomaly,
                filterServices,
                filterSeverities,
                startTime,
                endTime
            );

            // Handle the result of the GetHistoricalLogAnomalies API call
            logResultPromise
                .then((logResult) => {
                    if (logResult.data) {
                        const { rows, columns, total_pages, page, total_rows } = logResult.data;

                        if (rows.length > 0) {
                            // Update the total number of pages based on the API response
                            setTotalPages(total_pages);

                            // Update the total number of rows based on the API response
                            setTotalRows(total_rows);

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
                })
                .finally(() => {
                    // Set table loading to false after API call completes
                    setIsTableLoading(false);
                });
        } catch (error) {
            console.error('Unexpected error:', error);
            setIsTableLoading(false); // Ensure loading is set to false in case of error
        }
    };

    const updateTimeDifference = () => {
        if (!lastRefreshTime) return;

        const now = new Date();
        // console.log(now)
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

    // Function to refresh data manually (on "Refresh Now" button click)
    const handleRefreshNow = async () => {
        setIsTableLoading(true); // Show loading state

        // Small delay to ensure loading state is shown before fetching data
        setTimeout(async () => {
            try {
                const { startTime, endTime } = getTimeRange()
                // Call fetchDataByLog with time range values
                await fetchDataByLog(
                    selectedDataSource,
                    pagination.pageIndex,     // Page number
                    pagination.pageSize,      // Page size (limit)
                    selectedAnomalyOptions,    // Anomaly filter options
                    selectedServicesOptions,   // Service filter options
                );
                console.log('Manual refresh triggered');
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsTableLoading(false); // Hide loading state once data arrives
            }
        }, 0);
    };

    // Handle auto-refresh toggling and interval selection
    const handleAutoRefreshChange = (autoRefresh: boolean, interval: number) => {
        setAutoRefresh(autoRefresh);
        setRefreshInterval(autoRefresh ? interval : null); // Set the interval if auto-refresh is on
        setGraphAutoRefresh({
            enabled: autoRefresh,
            interval: interval,
        });
    };

    const handlePageSizeChange = async (
        newPageSize: number,
    ) => {
        const page = 1 // Reset to the first page when page size changes
        table.setPageSize(newPageSize);
        setPagination((prev) => ({
            ...prev,
            pageSize: newPageSize,
            pageIndex: page,
        }));

        // Get startTime and endTime using the helper function
        const { startTime, endTime } = getTimeRange();

        // Call API with the new page size and the startTime and endTime values
        try {
            const logAnomaliesPromise = GetHistoricalLogAnomalies(
                selectedDataSource,
                newPageSize, // Set limit as the new page size
                page, // Reset to the first page
                selectedAnomalyOptions,
                selectedServicesOptions,
                selectedSeverityOptions,
                startTime, // Pass startTime as a string
                endTime // Pass endTime as a string
            );

            logAnomaliesPromise
                .then((result) => {
                    if (result.data) {
                        const { columns, rows, total_pages, total_rows } = result.data;

                        // Update the total number of pages based on the API response
                        setTotalPages(total_pages);

                        // Update the total number of rows based on the API response
                        setTotalRows(total_rows);

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
        anomalyOptions?: string[],
        serviceOptions?: string[],
        severityOptions?: number[],
    ) => {
        // Use passed startTime and endTime, or default to helper function values
        const { startTime, endTime } = getTimeRange();

        // Start the API call with either the passed or default start/end time values
        const logAnomaliesPromise = GetHistoricalLogAnomalies(
            logType,
            limit,
            page,
            anomalyOptions ?? selectedAnomalyOptions,      // Pass anomaly filter options
            serviceOptions ?? selectedServicesOptions,      // Pass service filter options
            severityOptions ?? selectedSeverityOptions,
            startTime,      // Use finalStartTime (either passed or default)
            endTime         // Use finalEndTime (either passed or default)
        );

        // Handle the result of the API call
        logAnomaliesPromise
            .then((result) => {
                if (result.data) {
                    const { columns, rows, total_pages, total_rows } = result.data;

                    // Update the total number of pages based on the API response
                    setTotalPages(total_pages);

                    // Update the total number of rows based on the API response
                    setTotalRows(total_rows);

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
    ) => {
        // console.log('Fetching data for page:', page);

        // Determine the log type based on the selected log
        const { startTime, endTime } = getTimeRange();

        try {
            // Make the API call with startTime and endTime instead of date_range
            const result = await GetHistoricalLogAnomalies(selectedDataSource, limit, page, filter, selectedServicesOptions, selectedSeverityOptions, startTime, endTime);

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
            const response = await fetchAnomalyOption(selectedDataSource); // Pass the correct utilization type to the API call
            // console.log('API Response:', response); // Log the entire API response

            if (response.data && response.data.columns) {
                const options = response.data.columns.map((column: Column) => ({
                    id: column.name, // Maps the "name" to "id"
                    label: column.comment, // Maps the "comment" to "label",
                    type: column.type, // Maps the "type" to "type"
                }));

                // console.log('Mapped Checkbox Options:', options); // Log the mapped options

                setFilterAnomalyOptions(options); // Update state with fetched options
            } else {
                console.error('Response data or columns are missing');
                setHasErrorAnomalyFilter(true); // Set error state if response is invalid
            }
        } catch (error) {
            handleApiError(error);
            setHasErrorAnomalyFilter(true); // Set error state on catch
        }
    };

    const loadSeverityFilterOptions = async () => {
        try {
            // Hardcode the severity options
            const severityOptions = [
                { id: 1, label: 'Very High', type: 'severity' },
                { id: 2, label: 'High', type: 'severity' },
                { id: 3, label: 'Meidum', type: 'severity' }
            ];

            setFilterSeverityOptions(severityOptions); // Set the severity options into state
            // console.log(severityOptions)
        } catch (error) {
            console.error('Error loading severity options:', error);

        }
    };

    const loadServicesFilterOptions = async () => {
        try {
            const { startTime, endTime } = getTimeRange()

            const response = await fetchServicesOption({
                type: selectedDataSource,
                start_time: startTime,
                end_time: endTime
            })

            if (response.data && response.data.services) {
                // No need to map as it's already an array of strings
                const services = response.data.services
                setFilterServiceOptions(services) // Update state with fetched service options
            } else {
                console.error('Response data or services are missing')
            }
        } catch (error) {
            console.error('Failed to load service options', error)
            setHasErrorServiceFilter(true)
        }
    }

    const handleResetFilters = () => {
        // Clear the selected options
        const params = new URLSearchParams(searchParams.toString());
        params.delete("anomaly")
        params.delete("service")
        router.push(`/dashboard/anomaly-detection?${params.toString()}`);
    }

    const handleChangePage = (page: number) => {
        console.log(page);

        setIsTableLoading(true); // Set loading to true before making the API call

        setPagination((prev) => {
            const { startTime, endTime } = getTimeRange();

            // Determine the appropriate API call based on the selected filters
            const logAnomaliesPromise = (() => {
                if (selectedAnomalyOptions.length !== 0 && selectedServicesOptions.length === 0) {
                    // If only anomaly options are selected
                    return GetHistoricalLogAnomalies(
                        selectedDataSource,
                        prev.pageSize,
                        page,
                        selectedAnomalyOptions,
                        [],
                        selectedSeverityOptions,
                        startTime,
                        endTime
                    );
                } else if (selectedServicesOptions.length !== 0 && selectedAnomalyOptions.length === 0) {
                    // If only service options are selected
                    return GetHistoricalLogAnomalies(
                        selectedDataSource,
                        prev.pageSize,
                        page,
                        [],
                        selectedServicesOptions,
                        selectedSeverityOptions,
                        startTime,
                        endTime
                    );
                } else if (selectedAnomalyOptions.length !== 0 && selectedServicesOptions.length !== 0) {
                    // If both anomaly and service options are selected
                    return GetHistoricalLogAnomalies(
                        selectedDataSource,
                        prev.pageSize,
                        page,
                        selectedAnomalyOptions,
                        selectedServicesOptions,
                        selectedSeverityOptions,
                        startTime,
                        endTime
                    );
                } else {
                    // If no filters are selected, proceed with normal pagination
                    return fetchDataByPagination(page, prev.pageSize, []);
                }
            })();

            // Handle the API call response
            logAnomaliesPromise
                .then((result) => processApiResult(result))
                .catch((error) => handleApiError(error))
                .finally(() => {
                    setIsTableLoading(false); // Set loading to false after the API call completes
                });

            return { ...prev, pageIndex: page };
        });
    };

    const handleApplyFilters = async (filters: { selectedAnomalies: string[]; selectedServices: string[]; selectedSeverities: number[] }) => {
        const { selectedAnomalies, selectedServices, selectedSeverities } = filters;

        console.log(filters)

        // Update the state with the selected options
        const params = new URLSearchParams(searchParams.toString());

        params.delete("anomaly")
        selectedAnomalies.forEach(anomaly => params.append("anomaly", anomaly))

        params.delete("service")
        selectedServices.forEach(service => params.append("service", service))

        params.delete("severity");
        selectedSeverities.forEach(severity => params.append("severity", severity.toString()));  // Add severities to URL
        // Clear old severity params

        router.push(`/dashboard/anomaly-detection?${params.toString()}`);

        // Determine the log type
        const { startTime, endTime } = getTimeRange();

        // Set table loading to true before starting the API call
        setIsTableLoading(true);

        // Initiate both API calls concurrently and independently
        const logAnomaliesPromise = GetHistoricalLogAnomalies(
            selectedDataSource,
            pagination.pageSize, // Use the current page size
            1, // Start from the first page
            selectedAnomalies,
            selectedServices,
            selectedSeverities,
            startTime, // Pass startTime
            endTime // Pass endTime
        );

        // Handle the result of the log anomalies API call
        logAnomaliesPromise
            .then((result) => {
                if (result.data) {
                    // Update the total number of pages based on the API response
                    setTotalPages(result.data.total_pages);

                    // Update the total number of rows based on the API response
                    setTotalRows(result.data.total_rows);

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
            .catch(handleApiError)
            .finally(() => {
                // Set table loading to false after API call completes
                setIsTableLoading(false);
            });
    };

    // const nextPage = () => {
    //     setIsTableLoading(true); // Set loading to true before making the API call
    //     console.log(selectedSeverityOptions)

    //     setPagination((prev) => {
    //         const newPageIndex = Math.min(prev.pageIndex + 1, totalPages);
    //         const { startTime, endTime } = getTimeRange();

    //         // Define a function to call the API with the appropriate filters
    //         const callApi = (anomalyOptions: string[], serviceOptions: string[], severityOptions: number[]) => {
    //             GetHistoricalLogAnomalies(
    //                 selectedDataSource,
    //                 prev.pageSize,
    //                 newPageIndex,
    //                 anomalyOptions,
    //                 serviceOptions,
    //                 severityOptions,
    //                 startTime,
    //                 endTime
    //             )
    //                 .then((result) => processApiResult(result))
    //                 .catch((error) => handleApiError(error))
    //                 .finally(() => {
    //                     setIsTableLoading(false); // Set loading to false after the API call completes
    //                 });
    //         };

    //         // Log selected filters to verify they are correct
    //         console.log('Selected Severity Options:', selectedSeverityOptions); // Check this log

    //         // Handle different filter scenarios
    //         if (selectedAnomalyOptions.length !== 0 && selectedServicesOptions.length === 0 && selectedSeverityOptions.length === 0) {
    //             // If only anomaly options are selected
    //             callApi(selectedAnomalyOptions, [], []);
    //         } else if (selectedServicesOptions.length !== 0 && selectedAnomalyOptions.length === 0 && selectedSeverityOptions.length === 0) {
    //             // If only service options are selected
    //             callApi([], selectedServicesOptions, []);
    //         } else if (selectedSeverityOptions.length !== 0 && selectedAnomalyOptions.length === 0 && selectedServicesOptions.length === 0) {
    //             // If only severity options are selected
    //             callApi([], [], selectedSeverityOptions);
    //         } else if (selectedAnomalyOptions.length !== 0 && selectedServicesOptions.length !== 0 && selectedSeverityOptions.length === 0) {
    //             // If both anomaly and service options are selected
    //             callApi(selectedAnomalyOptions, selectedServicesOptions, []);
    //         } else if (selectedAnomalyOptions.length !== 0 && selectedSeverityOptions.length !== 0 && selectedServicesOptions.length === 0) {
    //             // If both anomaly and severity options are selected
    //             callApi(selectedAnomalyOptions, [], selectedSeverityOptions);
    //         } else if (selectedServicesOptions.length !== 0 && selectedSeverityOptions.length !== 0 && selectedAnomalyOptions.length === 0) {
    //             // If both service and severity options are selected
    //             callApi([], selectedServicesOptions, selectedSeverityOptions);
    //         } else if (selectedAnomalyOptions.length !== 0 && selectedServicesOptions.length !== 0 && selectedSeverityOptions.length !== 0) {
    //             // If all three filters are selected
    //             callApi(selectedAnomalyOptions, selectedServicesOptions, selectedSeverityOptions);
    //         } else {
    //             // If no filters are selected, proceed with normal pagination
    //             fetchDataByPagination(newPageIndex, prev.pageSize, [])
    //                 .then((result) => processApiResult(result))
    //                 .catch((error) => handleApiError(error))
    //                 .finally(() => {
    //                     setIsTableLoading(false); // Set loading to false after the API call completes
    //                 });
    //         }

    //         return { ...prev, pageIndex: newPageIndex };
    //     });
    // };


    // const previousPage = () => {
    //     setIsTableLoading(true); // Set loading to true before making the API call

    //     setPagination((prev) => {
    //         const { startTime, endTime } = getTimeRange();

    //         // Define a function to call the API with the appropriate filters
    //         const callApi = (anomalyOptions: string[], serviceOptions: string[], severityOptions: number[]) => {
    //             return GetHistoricalLogAnomalies(
    //                 selectedDataSource,
    //                 prev.pageSize,
    //                 newPageIndex,
    //                 anomalyOptions,
    //                 serviceOptions,
    //                 severityOptions,
    //                 startTime,
    //                 endTime
    //             );
    //         };

    //         // Handle different filter scenarios
    //         const logAnomaliesPromise = (() => {
    //             if (selectedAnomalyOptions.length !== 0 && selectedServicesOptions.length === 0 && selectedSeverityOptions.length === 0) {
    //                 // If only anomaly options are selected
    //                 return callApi(selectedAnomalyOptions, [], []);
    //             } else if (selectedServicesOptions.length !== 0 && selectedAnomalyOptions.length === 0 && selectedSeverityOptions.length === 0) {
    //                 // If only service options are selected
    //                 return callApi([], selectedServicesOptions, []);
    //             } else if (selectedSeverityOptions.length !== 0 && selectedAnomalyOptions.length === 0 && selectedServicesOptions.length === 0) {
    //                 // If only severity options are selected
    //                 return callApi([], [], selectedSeverityOptions);
    //             } else if (selectedAnomalyOptions.length !== 0 && selectedServicesOptions.length !== 0 && selectedSeverityOptions.length === 0) {
    //                 // If both anomaly and service options are selected
    //                 return callApi(selectedAnomalyOptions, selectedServicesOptions, []);
    //             } else if (selectedAnomalyOptions.length !== 0 && selectedSeverityOptions.length !== 0 && selectedServicesOptions.length === 0) {
    //                 // If both anomaly and severity options are selected
    //                 return callApi(selectedAnomalyOptions, [], selectedSeverityOptions);
    //             } else if (selectedServicesOptions.length !== 0 && selectedSeverityOptions.length !== 0 && selectedAnomalyOptions.length === 0) {
    //                 // If both service and severity options are selected
    //                 return callApi([], selectedServicesOptions, selectedSeverityOptions);
    //             } else if (selectedAnomalyOptions.length !== 0 && selectedServicesOptions.length !== 0 && selectedSeverityOptions.length !== 0) {
    //                 // If all three filters are selected
    //                 return callApi(selectedAnomalyOptions, selectedServicesOptions, selectedSeverityOptions);
    //             } else {
    //                 // If no filters are selected, proceed with normal pagination
    //                 return fetchDataByPagination(page, prev.pageSize, []);
    //             }
    //         })();

    //         // Handle the API call response
    //         logAnomaliesPromise
    //             .then((result) => processApiResult(result))
    //             .catch((error) => handleApiError(error))
    //             .finally(() => {
    //                 setIsTableLoading(false); // Set loading to false after the API call completes
    //             });

    //         return { ...prev, pageIndex: page };
    //     });
    // };

    useEffect(() => {
        fetchDataByLog(selectedDataSource, pagination.pageIndex, pagination.pageSize);
        // Load filter options
        loadAnomalyFilterOptions();
        loadServicesFilterOptions();
        loadSeverityFilterOptions();
    }, [selectedDataSource]);

    useEffect(() => {
        // Update the time difference every second
        const intervalId = setInterval(updateTimeDifference, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [lastRefreshTime]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (autoRefresh && refreshInterval) {
            // Setup a repeating interval
            intervalId = setInterval(() => {
                // Perform the refresh operation inside the interval
                const performRefresh = async () => {
                    setIsTableLoading(true); // Show loading state before fetching

                    try {
                        // Introduce a small artificial delay to show the loading state
                        await new Promise((resolve) => setTimeout(resolve, 1000));

                        // Call fetchDataByLog with the required parameters
                        await fetchDataByLog(
                            selectedDataSource,
                            pagination.pageIndex,     // Page number
                            pagination.pageSize,      // Page size (limit)
                            selectedAnomalyOptions,    // Anomaly filter options
                            selectedServicesOptions,   // Service filter options
                            selectedSeverityOptions
                        );
                        console.log('Auto-refresh triggered');
                    } catch (error) {
                        console.error('Error fetching data during auto-refresh:', error);
                    } finally {
                        setIsTableLoading(false); // Hide loading state once data is fetched
                    }
                };

                // Call the refresh function
                performRefresh();
            }, refreshInterval);
        }

        // Cleanup the interval on unmount or when auto-refresh is disabled
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [autoRefresh, refreshInterval, selectedDataSource, pagination.pageIndex, pagination.pageSize, selectedAnomalyOptions, selectedServicesOptions, selectedSeverityOptions, selectedTimeRange]);

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-row gap-2 self-end items-center'>
                <div className="flex flex-row gap-2 self-end items-center">
                    <Typography variant="body2" component="p" color="white">
                        {timeDifference}
                    </Typography>
                    <DropdownTime
                        timeRanges={PREDEFINED_TIME_RANGES}
                        onRangeChange={handleRangeChange}
                        selectedRange={selectedTimeRange} // Pass selectedRange as a prop
                    />

                </div>
                <AutoRefreshButton onRefresh={handleRefreshNow} onAutoRefreshChange={handleAutoRefreshChange} />
                <button onClick={handle.enter} className='text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium text-sm py-3 px-4 text-center rounded-l items-center'>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M3 4a1 1 0 011-1h3a1 1 0 110 2H5v2a1 1 0 11-2 0V5a1 1 0 010-1zM3 14a1 1 0 011 1v2h2a1 1 0 110 2H4a1 1 0 01-1-1v-3a1 1 0 011-1zm13-1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 110-2h2v-2a1 1 0 011-1zm0-8a1 1 0 011 1v3a1 1 0 11-2 0V5h-2a1 1 0 110-2h3a1 1 0 011 1z" />
                    </svg>
                </button>

            </div>
            <FullScreen handle={handle}>
                {/* Conditionally apply h-screen overflow-auto classes when fullscreen is active */}
                <div className={`flex flex-col gap-10 p-12 card-style ${handle.active ? 'h-screen overflow-auto' : ''}`}>
                    <div className="flex flex-col gap-10">
                        {/* Conditionally hide the FilterPanel when in fullscreen */}
                        {!handle.active && (
                            <FilterPanel
                                servicesOptions={filterServicesOptions}
                                checkboxOptions={filterAnomalyOptions}
                                severityOptions={filterSeverityOptions}
                                onApplyFilters={handleApplyFilters}
                                onResetFilters={handleResetFilters}
                                hasErrorFilterAnomaly={hasErrorFilterAnomaly}
                                hasErrorFilterService={hasErrorFilterService}
                            />
                        )}
                        <div className='flex flex-col gap-2'>
                            <Typography variant="h5" component="h5" color="white">
                                {`Historical ${NAMESPACE_LABELS[selectedDataSource] === 'Zabbix'
                                    ? 'Zabbix Ping to Erangel'
                                    : NAMESPACE_LABELS[selectedDataSource]
                                    } Anomaly Records`}
                            </Typography>

                            {selectedAnomalyOptions.length > 0 && (
                                <Typography variant="body2" component="h6" color="white">
                                    {`Anomaly: `}
                                    {selectedAnomalyOptions.map((optionId, index) => {
                                        // Find the corresponding option in filterAnomalyOptions
                                        const option = filterAnomalyOptions.find(opt => opt.id === optionId);

                                        // Display the label if found, otherwise display the id itself
                                        return (
                                            <span key={index} className='font-bold text-gray-300'>
                                                {option ? option.label : optionId}
                                                {index < selectedAnomalyOptions.length - 1 && ', '}
                                            </span>
                                        );
                                    })}
                                </Typography>
                            )}
                        </div>

                        <Box>
                            <div className={`w-full overflow-x-auto ${!isTableLoading && data.length > 10 ? 'max-h-[75dvh] overflow-y-auto' : ''}`}>
                                <div className="min-w-full">
                                    {isTableLoading ? (
                                        <div className="flex justify-center items-center">
                                            <div className="spinner"></div>
                                        </div>
                                    ) : data.length === 0 && !isTableLoading ? (
                                        <div className="text-center py-4">
                                            <Typography variant="subtitle1" color="white" align="center">
                                                No data available.
                                            </Typography>
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
                                                                        ? header.column.columnDef.header({} as any)
                                                                        : header.column.columnDef.header}
                                                                    {header.column.getCanSort() && (
                                                                        <>
                                                                            {{
                                                                                asc: '🔼',
                                                                                desc: '🔽',
                                                                                undefined: '🔽',
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
                                                                    {cell.column.id === 'severity' &&
                                                                        (cell.getValue() === 'Very High' ||
                                                                            cell.getValue() === 'High' ||
                                                                            cell.getValue() === 'Medium') && (
                                                                            <svg
                                                                                width="14"
                                                                                height="15"
                                                                                viewBox="0 0 14 15"
                                                                                fill="none"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                            >
                                                                                <path
                                                                                    d="M2.6075 12.75H11.3925C12.2908 12.75 12.8508 11.7759 12.4017 11L8.00917 3.41085C7.56 2.63502 6.44 2.63502 5.99083 3.41085L1.59833 11C1.14917 11.7759 1.70917 12.75 2.6075 12.75ZM7 8.66669C6.67917 8.66669 6.41667 8.40419 6.41667 8.08335V6.91669C6.41667 6.59585 6.67917 6.33335 7 6.33335C7.32083 6.33335 7.58333 6.59585 7.58333 6.91669V8.08335C7.58333 8.40419 7.32083 8.66669 7 8.66669ZM7.58333 11H6.41667V9.83335H7.58333V11Z"
                                                                                    fill={
                                                                                        cell.getValue() === 'Very High'
                                                                                            ? '#dc2626' // Red for Very High
                                                                                            : cell.getValue() === 'High'
                                                                                                ? '#ea580c' // Orange for High
                                                                                                : cell.getValue() === 'Medium'
                                                                                                    ? '#facc15' // Yellow for Medium
                                                                                                    : ''
                                                                                    }
                                                                                />
                                                                            </svg>
                                                                        )}

                                                                    {/* Format number with commas */}
                                                                    {typeof cell.getValue() === 'number' ? (
                                                                        <span>
                                                                            {formatNumberWithCommas(cell.getValue() as number)} {/* Apply the formatting function here */}
                                                                        </span>
                                                                    ) : (
                                                                        <span>{cell.getValue() as string} {/* For non-numeric values */}</span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                            {data.length > 0 && !isTableLoading && (
                                <TablePagination
                                    component={"div"}
                                    count={totalRows}
                                    onPageChange={(_, page) => handleChangePage(page + 1)}
                                    page={pagination.pageIndex - 1}
                                    rowsPerPage={table.getState().pagination.pageSize}
                                    onRowsPerPageChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                    rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                                    showFirstButton
                                    showLastButton
                                    sx={{
                                        color: 'white', // Text color
                                        '.MuiTablePagination-actions': {
                                            color: 'white',
                                        },
                                        '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                                            color: 'white', // Labels and displayed rows text color
                                        },
                                        '.MuiSelect-select': {
                                            color: 'white', // Dropdown text color
                                        },
                                        '.MuiSvgIcon-root': {
                                            fill: 'white', // Default color for icons
                                        },
                                        '.MuiButtonBase-root.Mui-disabled svg': {
                                            fill: 'grey', // Set your desired disabled color (e.g., light grey)
                                        },
                                    }}
                                />
                            )}
                        </Box>
                    </div>
                    <GraphAnomalyCard
                        selectedLog={selectedDataSource}
                        servicesOptions={filterServicesOptions}
                        selectedTimeRangeKey={selectedTimeRange}
                        timeRanges={PREDEFINED_TIME_RANGES}
                        autoRefresh={graphAutoRefresh}
                        isFullScreen={handle.active}
                    />
                </div>
            </FullScreen>
        </div>

    )
}

export default TabContent
