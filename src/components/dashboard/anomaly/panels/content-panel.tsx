import React, { useEffect, useState } from 'react'
import { ClusterOptionResponse, Column } from '@/modules/models/anomaly-predictions'
import { GetClusterOption, GetHistoricalLogAnomalies } from '@/modules/usecases/anomaly-predictions'
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
import { ApiResponse, PaginatedResponse } from '@/common/api/type'
import { Maximize } from 'react-feather'
import Button from '@/components/system/Button/Button'

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
    const selectedClustersOptions = searchParams.getAll("cluster")
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
    const [filterClusterOptions, setFilterClusterOptions] = useState<ClusterOptionResponse[] | null | undefined>(null)
    const [filterServiceOptions, setFilterServiceOptions] = useState<string[] | null | undefined>(null)
    const [filterSeverityOptions, setFilterSeverityOptions] = useState<{ id: number; label: string; type: string }[]>([]);
    const [hasErrorFilterAnomaly, setHasErrorFilterAnomaly] = useState<boolean>(false)
    const [hasErrorFilterCluster, setHasErrorFilterCluster] = useState<boolean>(false)
    const [hasErrorFilterService, setHasErrorFilterService] = useState<boolean>(false)
    const [columns, setColumns] = useState<ColumnDef<any, any>[]>([])
    const [highlights, setHighlights] = useState<string[][] | null | undefined>([])
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
        const filterClusters = selectedClustersOptions.length > 0 ? selectedClustersOptions : [];
        const filterServices = selectedServicesOptions.length > 0 ? selectedServicesOptions : [];
        const filterSeverities = selectedSeverityOptions.length > 0 ? selectedSeverityOptions : []; // These are now numbers

        loadClusterFilterOptions();
        loadServicesFilterOptions();
        try {
            // Initiate both API calls concurrently and independently
            const logResultPromise = GetHistoricalLogAnomalies(
                selectedDataSource,
                10,
                1,
                filtersAnomaly,
                filterClusters,
                filterServices,
                filterSeverities,
                startTime,
                endTime
            );

            // Handle the result of the GetHistoricalLogAnomalies API call
            logResultPromise
                .then((logResult) => {
                    if (logResult.data) {
                        const { rows, columns, total_pages, page, total_rows, highlights } = logResult.data;

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

                            setHighlights(highlights)
                            
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
                selectedClustersOptions,
                selectedServicesOptions,
                selectedSeverityOptions,
                startTime, // Pass startTime as a string
                endTime // Pass endTime as a string
            );

            logAnomaliesPromise
                .then((result) => {
                    if (result.data) {
                        const { columns, rows, total_pages, total_rows, highlights } = result.data;

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
                        setHighlights(highlights)
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
        clusterOptions?: string[],
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
            clusterOptions ?? selectedClustersOptions,      // Pass cluster filter options
            serviceOptions ?? selectedServicesOptions,      // Pass service filter options
            severityOptions ?? selectedSeverityOptions,
            startTime,      // Use finalStartTime (either passed or default)
            endTime         // Use finalEndTime (either passed or default)
        );

        // Handle the result of the API call
        logAnomaliesPromise
            .then((result) => {
                if (result.data) {
                    const { columns, rows, total_pages, total_rows, highlights } = result.data;

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
                    setHighlights(highlights)
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
            const result = await GetHistoricalLogAnomalies(
                selectedDataSource,
                limit,
                page,
                filter,
                selectedClustersOptions,
                selectedServicesOptions,
                selectedSeverityOptions,
                startTime,
                endTime
            );

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
                setHighlights(result.data.highlights)
            } else {
                console.warn('API response data is null or undefined');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const processApiResult = (result: void | ApiResponse<PaginatedResponse>) => {
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
                result.data?.columns.forEach((col: any) => {
                    mappedRow[col.key] = row[col.key]
                })
                return mappedRow
            })
            setData(newData)
            setHighlights(result.data.highlights)
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
                setHasErrorFilterAnomaly(false); // Set error state on catch
            } else {
                console.error('Response data or columns are missing');
                setHasErrorFilterAnomaly(true); // Set error state if response is invalid
            }
        } catch (error) {
            handleApiError(error);
            setHasErrorFilterAnomaly(true); // Set error state on catch
        }
    };

    const loadSeverityFilterOptions = async () => {
        try {
            // Hardcode the severity options
            const severityOptions = [
                { id: 1, label: 'Very High', type: 'severity' },
                { id: 2, label: 'High', type: 'severity' },
                { id: 3, label: 'Medium', type: 'severity' }
            ];

            setFilterSeverityOptions(severityOptions); // Set the severity options into state
            // console.log(severityOptions)
        } catch (error) {
            console.error('Error loading severity options:', error);

        }
    };

    const loadClusterFilterOptions = async () => {
        try {
            const { startTime, endTime } = getTimeRange()

            const response = await GetClusterOption({
                type: selectedDataSource,
                start_time: startTime,
                end_time: endTime
            })

            const cluster = response.data
            setFilterClusterOptions(cluster)
            setHasErrorFilterCluster(false)
        } catch (error) {
            console.error('Failed to load service options', error)
            setHasErrorFilterCluster(true)
        }
    }

    const loadServicesFilterOptions = async () => {
        try {
            const { startTime, endTime } = getTimeRange()

            const response = await fetchServicesOption({
                type: selectedDataSource,
                start_time: startTime,
                end_time: endTime
            })

            setFilterServiceOptions(response.data?.services) // Update state with fetched service options
            setHasErrorFilterService(false)
        } catch (error) {
            console.error('Failed to load service options', error)
            setHasErrorFilterService(true)
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
            const logAnomaliesPromise = fetchDataByPagination(page, prev.pageSize, []);

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

    const handleApplyFilters = async (
        filters: {
            selectedAnomalies: string[];
            selectedSeverities: number[]
            selectedClusters: ClusterOptionResponse[];
            selectedServices: string[];
        }) => {
        const { selectedAnomalies, selectedServices, selectedSeverities, selectedClusters } = filters;

        // Update the state with the selected options
        const params = new URLSearchParams(searchParams.toString());

        params.delete("anomaly")
        selectedAnomalies.forEach(anomaly => params.append("anomaly", anomaly))

        params.delete("severity");
        selectedSeverities.forEach(severity => params.append("severity", severity.toString()));  // Add severities to URL

        params.delete("cluster")
        selectedClusters.forEach(cluster => params.append("cluster", cluster.name))
        
        params.delete("service")
        selectedServices.forEach(service => params.append("service", service))
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
            selectedClusters.map(cluster => cluster.name),
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

                    setHighlights(result.data.highlights)

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

    useEffect(() => {
        fetchDataByLog(selectedDataSource, pagination.pageIndex, pagination.pageSize);
        // Load filter options
        loadAnomalyFilterOptions();
        loadClusterFilterOptions();
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
                            selectedClustersOptions,   // Cluster filter options
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
                <Button onClick={handle.enter} >
                    <Maximize className='w-6 h-5' />
                </Button>

            </div>
            <FullScreen handle={handle}>
                {/* Conditionally apply h-screen overflow-auto classes when fullscreen is active */}
                <div className={`flex flex-col gap-10 p-12 card-style ${handle.active ? 'h-screen overflow-auto' : ''}`}>
                    <div className="flex flex-col gap-10">
                        {/* Conditionally hide the FilterPanel when in fullscreen */}
                        {!handle.active && (
                            <FilterPanel
                                clusterOptions={filterClusterOptions}
                                servicesOptions={filterServiceOptions}
                                checkboxOptions={filterAnomalyOptions}
                                severityOptions={filterSeverityOptions}
                                onApplyFilters={handleApplyFilters}
                                onResetFilters={handleResetFilters}
                                hasErrorFilterAnomaly={hasErrorFilterAnomaly}
                                hasErrorFilterService={hasErrorFilterService}
                                hasErrorFilterCluster={hasErrorFilterCluster}
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
                                                                    className={`${header.column.getCanSort() ? 'cursor-pointer select-none uppercase font-semibold' : ''
                                                                        } px-3`}
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
                                                                        <span
                                                                            className={highlights?.[row.index].includes(cell.column.id) ? 'blinking text-[#FF4E42] font-bold' : ''}
                                                                        >
                                                                            {cell.column.id === "error_rate" ?
                                                                                (cell.getValue() as number).toString().replace('.', ',') :
                                                                                formatNumberWithCommas(cell.getValue() as number)}
                                                                        </span>
                                                                    ) : (
                                                                        <span
                                                                            className={highlights?.[row.index].includes(cell.column.id) ? 'blinking text-[#FF4E42] font-bold' : ''}
                                                                        >
                                                                            {cell.getValue() as string}
                                                                        </span>
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
                                    component={'div'}
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
                        selectedDataSource={selectedDataSource}
                        clusterOptions={filterClusterOptions}
                        servicesOptions={filterServiceOptions}
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
