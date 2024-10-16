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
import { Maximize } from 'react-feather'
import Button from '@/components/system/Button/Button'
import Pagination from '@/components/system/Pagination/Pagination'
import TableHistoricalAnomaly from '../table/table-historical-anomaly'
import cluster from 'cluster'

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
    const selectedOperationOptions = searchParams.get("operation") as string;
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
    const [hasErrorFilterSeverity, setHasErrorFilterSeverity] = useState<boolean>(false)
    const [columns, setColumns] = useState<ColumnDef<any, any>[]>([])
    const [highlights, setHighlights] = useState<string[][] | null | undefined>([])
    const [data, setData] = useState<any[]>([])
    const [totalRows, setTotalRows] = useState<number>(1)
    const [isTableHeaderLoading, setIsTableHeaderLoading] = useState(true) // Table loading state
    const [isTableLoading, setIsTableLoading] = useState(true) // Table loading state
    const [pagination, setPagination] = useState({
        pageIndex: 1, // Start from page 1
        pageSize: 10, // Default page size
    })
    const handle = useFullScreenHandle();


    const getTimeRange = (timeRange: string = selectedTimeRange) => {
        let startTime: string;
        let endTime: string;

        // Check if a custom range in the format 'start - end' is provided
        if (timeRange.includes(' - ')) {
            const [start, end] = timeRange.split(' - ');
            if (!start || !end) {
                throw new Error(`Invalid custom range: ${timeRange}`);
            }
            startTime = start;
            endTime = end;
        } else {
            // Handle predefined time ranges
            const predefinedRange = PREDEFINED_TIME_RANGES[timeRange];
            if (!predefinedRange) {
                throw new Error(`Invalid time range: ${timeRange}`);
            }

            const endDate = new Date();
            endDate.setSeconds(0, 0); // Round down to the nearest minute
            const startDate = new Date(endDate.getTime() - predefinedRange * 60000); // Subtract the range in minutes

            startTime = format(startDate, 'yyyy-MM-dd HH:mm:ss');
            endTime = format(endDate, 'yyyy-MM-dd HH:mm:ss');
        }

        return { startTime, endTime };
    };

    const handleRangeChange = async (rangeKey: string) => {

        // Update the selected range state
        const params = new URLSearchParams(searchParams.toString());
        params.set('time_range', rangeKey);
        router.push(`/dashboard/anomaly-detection?${params.toString()}`);

        const filtersAnomaly = selectedAnomalyOptions.length > 0 ? selectedAnomalyOptions : [];
        const filterClusters = selectedClustersOptions.length > 0 ? selectedClustersOptions : [];
        const filterServices = selectedServicesOptions.length > 0 ? selectedServicesOptions : [];
        const filterSeverities = selectedSeverityOptions.length > 0 ? selectedSeverityOptions : []; // These are now numbers
        // const filterOperation = selectedOpe

        loadClusterFilterOptions();
        loadServicesFilterOptions();

        const page = 1 // Reset to the first page when page size changes
        setPagination((prev) => ({
            ...prev,
            pageIndex: page,
        }));

        // Initiate both API calls concurrently and independently
        fetchHistoricalAnomalyRecords(
            selectedDataSource,
            page,
            pagination.pageSize,
            filtersAnomaly,
            filterClusters,
            filterServices,
            filterSeverities,
            rangeKey
        );
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
                // const { startTime, endTime } = getTimeRange()
                // Call fetchDataByLog with time range values
                await fetchHistoricalAnomalyRecords(
                    selectedDataSource,
                    pagination.pageIndex,     // Page number
                    pagination.pageSize,      // Page size (limit)
                );
                console.log('Manual refresh triggered');
            } catch (error) {
                console.error('Error fetching data:', error);
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
        setPagination((prev) => ({
            ...prev,
            pageSize: newPageSize,
            pageIndex: page,
        }));

        // Call API with the new page size and the startTime and endTime values
        fetchHistoricalAnomalyRecords(
            selectedDataSource,
            page, // Reset to the first page
            newPageSize, // Set limit as the new page size
            selectedAnomalyOptions,
            selectedClustersOptions,
            selectedServicesOptions,
            selectedSeverityOptions,
            selectedOperationOptions
        );

    };

    const fetchHistoricalAnomalyRecords = async (
        logType: string,
        page: number,
        limit: number,
        anomalyOptions?: string[],
        clusterOptions?: string[],
        serviceOptions?: string[],
        severityOptions?: number[],
        selectedOperation?: string // Add the selectedOperation parameter here
    ) => {
        setIsTableLoading(true);
        console.log(anomalyOptions, clusterOptions, serviceOptions, severityOptions, selectedOperation, "fetchHistorical")


        // Now pass the validTimeRange to getTimeRange
        const { startTime, endTime } = getTimeRange();

        // console.log(startTime, endTime, "ini");

        // Pass the selectedOperation to the API call
        const logAnomaliesPromise = GetHistoricalLogAnomalies(
            logType,
            limit,
            page,
            anomalyOptions ?? selectedAnomalyOptions,
            clusterOptions ?? selectedClustersOptions,
            serviceOptions ?? selectedServicesOptions,
            severityOptions ?? selectedSeverityOptions,
            startTime,
            endTime,
            selectedOperation ?? selectedOperationOptions// Default to OR if undefined
        );

        // Handle the result of the API call
        logAnomaliesPromise
            .then((result) => {
                if (result.data) {
                    const { columns, rows, total_pages, total_rows, highlights } = result.data;

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
                    setHighlights(highlights);

                    setLastRefreshTime(new Date());
                } else {
                    console.warn('API response data is null or undefined');
                }
            })
            .catch((error) => {
                handleApiError(error);
            })
            .finally(() => {
                setIsTableHeaderLoading(false);
                setIsTableLoading(false);
            });
    };

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
        params.delete("cluster")
        router.push(`/dashboard/anomaly-detection?${params.toString()}`);
    }

    const handleChangePage = (page: number) => {
        setIsTableLoading(true); // Set loading to true before making the API call

        setPagination((prev) => {
            fetchHistoricalAnomalyRecords(
                selectedDataSource,
                page,
                prev.pageSize,
            );
            return { ...prev, pageIndex: page };
        });
    };

    const handleApplyFilters = async (
        filters: {
            selectedAnomalies: string[];
            selectedSeverities: number[]
            selectedClusters: ClusterOptionResponse[];
            selectedServices: string[];
            selectedOperation: string
        }) => {
        const { selectedAnomalies, selectedServices, selectedSeverities, selectedClusters, selectedOperation } = filters;
        console.log(selectedOperation, "inside handleApplyFilters");
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

        // Add selected operation (OR/AND) to the URL or use it in logic as needed
        params.delete("operation");
        params.append("operation", selectedOperation);

        router.replace(`/dashboard/anomaly-detection?${params.toString()}`);

        console.log("Before calling fetchHistoricalAnomalyRecords, selectedOperation:", selectedOperation);

        const page = 1 // Reset to the first page when page size changes
        setPagination((prev) => ({
            ...prev,
            pageIndex: page,
        }));

        // Invoke fetchHistoricalAnomalyRecords
        fetchHistoricalAnomalyRecords(
            selectedDataSource,
            page,
            pagination.pageSize, // Use the current page size
            selectedAnomalies,
            selectedClusters.map(cluster => cluster.name),
            selectedServices,
            selectedSeverities,
            selectedOperation
        );
    };

    useEffect(() => {
        setIsTableHeaderLoading(true);
        setIsTableLoading(true);

        fetchHistoricalAnomalyRecords(selectedDataSource, pagination.pageIndex, pagination.pageSize);
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
                    try {
                        // Introduce a small artificial delay to show the loading state
                        await new Promise((resolve) => setTimeout(resolve, 1000));

                        // Call fetchDataByLog with the required parameters
                        await fetchHistoricalAnomalyRecords(
                            selectedDataSource,
                            pagination.pageIndex,     // Page number
                            pagination.pageSize,      // Page size (limit)
                            selectedAnomalyOptions,    // Anomaly filter options
                            selectedClustersOptions,   // Cluster filter options
                            selectedServicesOptions,   // Service filter options
                            selectedSeverityOptions,
                            selectedOperationOptions
                        );
                        console.log('Auto-refresh triggered');
                    } catch (error) {
                        console.error('Error fetching data during auto-refresh:', error);
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
                                hasErrorFilterSeverity={hasErrorFilterSeverity}
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

                        <TableHistoricalAnomaly
                            columns={columns}
                            data={data}
                            handleChangePage={handleChangePage}
                            handlePageSizeChange={handlePageSizeChange}
                            highlights={highlights}
                            isLoadingHeader={isTableHeaderLoading}
                            isLoading={isTableLoading}
                            pagination={pagination}
                            totalRows={totalRows}
                        />

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
