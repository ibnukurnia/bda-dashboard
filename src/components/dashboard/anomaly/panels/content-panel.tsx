import React, { useEffect, useState } from 'react'
import { Column, Identifier } from '@/modules/models/anomaly-predictions'
import { DownloadCsvHistoricalLogAnomalies, GetDatasourceIdentifiers, GetHistoricalLogAnomalies, GetListIdentifier } from '@/modules/usecases/anomaly-predictions'
import { Typography } from '@mui/material'
import {
    ColumnDef,
} from '@tanstack/react-table'
import { CheckboxOption, fetchAnomalyOption, fetchDnsCategoryOption, fetchDnsDomainOption, fetchPrtgTrafficDeviceOption, fetchPrtgTrafficSensorOption, fetchServicesOption, fetchSolarWindsInterfaceOption, fetchSolarWindsNetworkOption, fetchSolarWindsNodeOption } from '@/lib/api'
import { NAMESPACE_LABELS, PREDEFINED_TIME_RANGES } from '@/constants'
import { useRouter, useSearchParams } from 'next/navigation'
import { Maximize } from 'react-feather'
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { format } from 'date-fns';
import DropdownTime from '../button/dropdown-time'
import FilterPanel from '../button/filterPanel'
import GraphAnomalyCard from '../card/graph-anomaly-card'
import AutoRefreshButton from '../button/refreshButton'
import Button from '@/components/system/Button/Button'
import TableHistoricalAnomaly from '../table/table-historical-anomaly'
import useUpdateEffect from '@/hooks/use-update-effect'
import DownloadButton from '../button/downloadButton'
import Skeleton from '@/components/system/Skeleton/Skeleton'

interface TabContentProps {
    selectedDataSource: string
    selectedTimeRange: string
}

const TabContent: React.FC<TabContentProps> = ({
    selectedDataSource,
    selectedTimeRange,
}) => {
    const [currentSort, setCurrentSort] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const timeRange = searchParams.get("time_range")
    const selectedAnomalyOptions = searchParams.getAll("anomaly")
    const selectedOperationOptions = searchParams.get("operation") as string;
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
    const [datasourceIdentifiers, setDatasourceIdentifiers] = useState<Identifier[]>([])
    const [listIdentifiers, setListIdentifiers] = useState<string[][]>([])
    const [isLoadingListIdentifier, setIsLoadingListIdentifier] = useState(true)
    const [filterAnomalyOptions, setFilterAnomalyOptions] = useState<CheckboxOption[]>([])
    const [filterSeverityOptions, setFilterSeverityOptions] = useState<{ id: number; label: string; type: string }[]>([]);
    const [hasErrorDatasourceIdentifier, setHasErrorDatasourceIdentifier] = useState<boolean>(false)
    const [hasErrorListIdentifier, setHasErrorListIdentifier] = useState<boolean[]>([])
    const [hasErrorFilterAnomaly, setHasErrorFilterAnomaly] = useState<boolean>(false)
    const [isDownloadingCsv, setIsDownloadingCsv] = useState(false)
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

        // 1. Update the 'time_range' parameter in the URL to the new range key.
        // - It converts the current search parameters to a URL string, updates the 'time_range' parameter with `rangeKey`, and pushes the new URL.
        const params = new URLSearchParams(searchParams.toString());
        params.set('time_range', rangeKey);
        router.push(`/dashboard/anomaly-detection?${params.toString()}`);

        // 2. Define selected filters based on the current user-selected options.
        // - If specific filter arrays are populated, use them; otherwise, use empty arrays. This allows the function to handle cases where filters may be empty.
        const filtersAnomaly = selectedAnomalyOptions.length > 0 ? selectedAnomalyOptions : [];
        const filterSeverities = selectedSeverityOptions.length > 0 ? selectedSeverityOptions : []; // These are now numbers

        // 3. Reset pagination to the first page.
        // - It updates the `pageIndex` in the pagination state to `1` to ensure results are shown from the beginning of the list when the time range changes.
        const page = 1; // Reset to the first page when page size changes
        setPagination((prev) => ({
            ...prev,
            pageIndex: page,
        }));

        // 4. Fetch historical anomaly records with the selected filters.
        // - The function calls `fetchHistoricalAnomalyRecords` with all the relevant data, such as the selected data source, pagination, time range, and selected filters.
        // - This ensures that the graph or data display reflects the selected `time_range` and other active filters.
        fetchHistoricalAnomalyRecords({
            logType: selectedDataSource,
            page: page,
            limit: pagination.pageSize,
            timeRange: rangeKey,
            anomalies: filtersAnomaly,
            severities: filterSeverities,
            sort_by: currentSort || undefined
        });
    };

    const updateTimeDifference = () => {
        // 1. Check if `lastRefreshTime` exists; if not, exit the function.
        // - This prevents any further calculation if there's no recorded last refresh time.
        if (!lastRefreshTime) return;

        // 2. Get the current date and time.
        const now = new Date();

        // 3. Calculate the time difference in seconds between now and `lastRefreshTime`.
        // - Subtracts `lastRefreshTime` from the current time in milliseconds, then converts it to seconds.
        const diffInSeconds = Math.floor((now.getTime() - lastRefreshTime.getTime()) / 1000);

        // 4. Determine the appropriate time format based on the difference.
        if (diffInSeconds < 60) {
            // a) If less than 60 seconds, display "Refreshed 2 sec ago."
            setTimeDifference(`Refreshed 2 sec ago`);
        } else if (diffInSeconds < 3600) {
            // b) If less than an hour (60 minutes), display time in minutes.
            // - Calculates the difference in minutes and displays "Refreshed X min(s) ago."
            const minutes = Math.floor(diffInSeconds / 60);
            setTimeDifference(`Refreshed ${minutes} min${minutes > 1 ? 's' : ''} ago`);
        } else {
            // c) If one hour or more, display time in hours.
            // - Calculates the difference in hours and displays "Refreshed X hour(s) ago."
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
                await fetchHistoricalAnomalyRecords({
                    logType: selectedDataSource,
                    page: pagination.pageIndex,     // Page number
                    limit: pagination.pageSize,      // Page size (limit)
                    sort_by: currentSort || undefined
                });
                // console.log('Manual refresh triggered');
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
        fetchHistoricalAnomalyRecords({
            logType: selectedDataSource,
            page: page, // Reset to the first page
            limit: newPageSize, // Set limit as the new page size
            anomalies: selectedAnomalyOptions,
            operation: selectedOperationOptions,
            severities: selectedSeverityOptions,
            sort_by: currentSort || undefined
        });

    };

    //Function to fetch table historical data
    const fetchHistoricalAnomalyRecords = async (payload: {
        logType: string;
        page: number;
        limit: number;
        timeRange?: string;
        anomalies?: string[];
        operation?: string; // Add the selectedOperation parameter here
        severities?: number[];
        sort_by?: string; // Add sort_by as optional
    }) => {
        setIsTableLoading(true);

        // Extract start and end time based on the time range
        const { startTime, endTime } = getTimeRange(payload.timeRange);
        // console.log('currentSort: ', currentSort)

        // Dynamically construct the payload for GetHistoricalLogAnomalies
        const apiPayload: any = {
            type: payload.logType,
            limit: payload.limit,
            page: payload.page,
            filters: payload.anomalies ?? selectedAnomalyOptions,
            severity: payload.severities ?? selectedSeverityOptions,
            operation: payload.operation ?? selectedOperationOptions, // Default to selectedOperationOptions if undefined
            start_time: startTime,
            end_time: endTime,
            ...datasourceIdentifiers.reduce<Record<string, string[]>>((acc, identifier) => {
                acc[identifier.key] = searchParams.getAll(identifier.key);
                return acc;
            }, {}),
            ...(payload.sort_by ? { sort_by: payload.sort_by } : {}), // Include sort_by only if it's provided
        };

        // Call the API
        try {
            const result = await GetHistoricalLogAnomalies(apiPayload);
            if (result.data) {
                const { columns, rows, total_pages, total_rows, highlights } = result.data;

                // Update state with API results
                setTotalRows(total_rows);

                // Map columns to the format required by the table
                const newColumns = columns.map((column: any) => ({
                    id: column.key,
                    header: column.title,
                    accessorKey: column.key,
                }));
                setColumns(newColumns);

                // Map rows to the format required by the table
                const newData = rows.map((row: any) => {
                    const mappedRow: any = {};
                    columns.forEach((col: any) => {
                        mappedRow[col.key] = row[col.key];
                    });
                    return mappedRow;
                });
                setData(newData);
                setHighlights(highlights);

                setLastRefreshTime(new Date());
            } else {
                console.warn("API response data is null or undefined");
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setIsTableHeaderLoading(false);
            setIsTableLoading(false);
        }
    };

    const handleSortChange = (columnKey: string | null) => {
        setCurrentSort((prevSort) => {
            const newSort = prevSort === columnKey ? null : columnKey;
            // console.log(newSort, "newSort being set in handleSortChange");
            return newSort;
        });
    };

    useEffect(() => {
        if (currentSort !== null) {
            // console.log(currentSort, "currentSort changed, fetching historical data");
            fetchHistoricalAnomalyRecords({
                logType: selectedDataSource,
                page: pagination.pageIndex,
                limit: pagination.pageSize,
                sort_by: currentSort, // Pass currentSort explicitly
            });
        }
    }, [currentSort]);

    // Function to handle API errors
    const handleApiError = (error: any) => {
        console.error('Error fetching data:', error)
    }

    // Function fo fetch anomaly filter option
    const loadAnomalyOptions = async () => {
        try {
            const response = await fetchAnomalyOption(selectedDataSource);
            if (response.data?.columns) {
                const options = response.data.columns.map((column: Column) => ({
                    id: column.name,
                    label: column.comment,
                    type: column.type,
                }));
                setFilterAnomalyOptions(options);
                setHasErrorFilterAnomaly(false);
            } else {
                throw new Error('Response data or columns are missing');
            }
        } catch (error) {
            handleApiError(error);
            setHasErrorFilterAnomaly(true);
        }

        setFilterSeverityOptions([
            { id: 1, label: 'Very High', type: 'severity' },
            { id: 2, label: 'High', type: 'severity' },
            { id: 3, label: 'Medium', type: 'severity' }
        ]);

    };

    // Function fo fetch identifier filter option
    const loadIdentifierOptions = async () => {
        const { startTime, endTime } = getTimeRange();

        const listIdentifiers: string[][] = []
        const errorListIdentifiers: boolean[] = []
        const promiseListIdentifier = datasourceIdentifiers.map((identifier, identifierIdx) => {
            return GetListIdentifier(selectedDataSource, identifier.key, {
                start_time: startTime,
                end_time: endTime,
            }).then(res => {
                if (res.data) {
                    listIdentifiers[identifierIdx] = res.data;
                    errorListIdentifiers[identifierIdx] = false;
                } else {
                    errorListIdentifiers[identifierIdx] = true;
                }
            }).catch(() => {
                errorListIdentifiers[identifierIdx] = true;
            });
        });

        // Wait for all requests to finish before setting state
        await Promise.all(promiseListIdentifier);
        setListIdentifiers(listIdentifiers);
        setIsLoadingListIdentifier(false);  // Set loading to false after all requests are done
        setHasErrorListIdentifier(errorListIdentifiers)
    }

    const handleChangePage = (page: number) => {
        setIsTableLoading(true); // Set loading to true before making the API call

        setPagination((prev) => {
            fetchHistoricalAnomalyRecords({
                logType: selectedDataSource,
                page: page,
                limit: prev.pageSize,
                sort_by: currentSort || undefined
            });
            return { ...prev, pageIndex: page };
        });
    };

    const handleApplyFilters = async (
        filters: {
            selectedAnomalies: string[];
            selectedOperation: string
            selectedSeverities: number[]
            selectedListIdentifiers: string[][]
        }) => {
        const {
            selectedAnomalies,
            selectedOperation,
            selectedSeverities,
            selectedListIdentifiers,
        } = filters;
        // Update the state with the selected options
        const params = new URLSearchParams(searchParams.toString());

        params.delete("anomaly")
        selectedAnomalies.forEach(anomaly => params.append("anomaly", anomaly))

        params.delete("severity");
        selectedSeverities.forEach(severity => params.append("severity", severity.toString()));  // Add severities to URL

        datasourceIdentifiers.forEach((identifier, idx) => {
            params.delete(identifier.key)
            selectedListIdentifiers[idx].forEach(selectedItem => params.append(identifier.key, selectedItem))
        })

        // Add selected operation (OR/AND) to the URL or use it in logic as needed
        params.delete("operation");
        params.append("operation", selectedOperation);

        router.replace(`/dashboard/anomaly-detection?${params.toString()}`);
    };

    const handleDownload = () => {
        if (isDownloadingCsv) return
        setIsDownloadingCsv(true)
        const { startTime, endTime } = getTimeRange();

        const payloadSelectedListIdentifier = datasourceIdentifiers.reduce<Record<string, string[]>>((acc, identifier, idx) => {
            acc[identifier.key] = searchParams.getAll(identifier.key)
            return acc
        }, {})

        DownloadCsvHistoricalLogAnomalies({
            type: selectedDataSource,
            filters: selectedAnomalyOptions,
            severity: selectedSeverityOptions,
            start_time: startTime,
            end_time: endTime,
            operation: selectedOperationOptions,// Default to OR if undefined
            sort_by: currentSort || undefined,
            ...payloadSelectedListIdentifier,
        }).finally(() => setIsDownloadingCsv(false))
    }

    useEffect(() => {
        setIsLoadingListIdentifier(true)
        setListIdentifiers([])

        GetDatasourceIdentifiers(selectedDataSource)
            .then(res => {
                if (res.data?.identifiers) {
                    setDatasourceIdentifiers(res.data?.identifiers ?? [])
                    setHasErrorDatasourceIdentifier(false)
                } else {
                    setHasErrorDatasourceIdentifier(true)
                }
            })

        loadAnomalyOptions()
    }, [selectedDataSource])

    useUpdateEffect(() => {
        setIsTableHeaderLoading(true);
        setIsTableLoading(true);
    }, [selectedDataSource]);

    useUpdateEffect(() => {
        loadIdentifierOptions()
    }, [datasourceIdentifiers, timeRange])

    useUpdateEffect(() => {
        setIsTableLoading(true);

        const page = 1 // Reset to the first page when page size changes
        setPagination((prev) => ({
            ...prev,
            pageIndex: page,
        }));
        fetchHistoricalAnomalyRecords({
            logType: selectedDataSource,
            page: 1,
            limit: pagination.pageSize, // Use the current page size
            sort_by: currentSort || undefined,
        });
    }, [
        searchParams, datasourceIdentifiers
    ]);

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
                        await fetchHistoricalAnomalyRecords({
                            logType: selectedDataSource,
                            page: pagination.pageIndex,     // Page number
                            limit: pagination.pageSize,      // Page size (limit)
                        });
                        // console.log('Auto-refresh triggered');
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
    }, [autoRefresh, refreshInterval]);

    return (
        <div className='flex flex-col gap-6'>
            <div className='flex flex-row gap-2 self-end items-center'>
                <AutoRefreshButton onRefresh={handleRefreshNow} onAutoRefreshChange={handleAutoRefreshChange} />
                <Button onClick={handle.enter} >
                    <Maximize className='w-6 h-5' />
                </Button>
            </div>
            <FullScreen handle={handle}>
                {/* Conditionally apply h-screen overflow-auto classes when fullscreen is active */}
                <div className={`flex flex-col gap-10  ${handle.active ? 'h-screen overflow-auto' : ''}`}>
                    <div className="flex flex-col p-6 gap-10 card-style">
                        {/* Conditionally hide the FilterPanel when in fullscreen */}
                        <div className='flex justify-between'>
                            <div className='flex flex-row gap-3'>
                                {!handle.active && (
                                    isLoadingListIdentifier ?
                                        <Skeleton
                                            width={110}
                                            height={44}
                                        /> :
                                        <FilterPanel
                                            checkboxOptions={filterAnomalyOptions}
                                            severityOptions={filterSeverityOptions}
                                            datasourceIdentifiers={datasourceIdentifiers}
                                            listIdentifiers={listIdentifiers}
                                            hasErrorListIdentifier={hasErrorListIdentifier}
                                            onApplyFilters={handleApplyFilters}
                                            hasErrorFilterAnomaly={hasErrorFilterAnomaly}
                                        />
                                )}
                                <DownloadButton
                                    onClick={handleDownload}
                                    isDownloading={isDownloadingCsv}
                                    disabled={isDownloadingCsv || data.length === 0}
                                />

                            </div>
                            <div className="flex flex-row gap-2 self-end items-center">
                                <Typography variant="body2" component="p" color="white">
                                    {timeDifference}
                                </Typography>
                                <DropdownTime
                                    timeRanges={PREDEFINED_TIME_RANGES}
                                    onRangeChange={handleRangeChange}
                                    selectedRange={selectedTimeRange}
                                    disableMaxRange={true} // Disable 2-hour limit for table
                                />
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Typography variant="h5" component="h5" color="white">
                                {`${NAMESPACE_LABELS[selectedDataSource] === 'Zabbix'
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
                            currentSort={currentSort} // Pass current sort
                            handleSortChange={handleSortChange} // Pass sort handler
                        />

                    </div>
                    {(selectedDataSource !== 'panw' && selectedDataSource !== 'forti' && selectedDataSource !== 'waf' && selectedDataSource !== "cluster_operator") && (
                        <div className='card-style p-6'>
                            <GraphAnomalyCard
                                selectedDataSource={selectedDataSource}
                                datasourceIdentifiers={datasourceIdentifiers}
                                isLoadingListIdentifier={isLoadingListIdentifier}
                                selectedTimeRangeKey={selectedTimeRange}
                                timeRanges={PREDEFINED_TIME_RANGES}
                                autoRefresh={graphAutoRefresh}
                                isFullScreen={handle.active}
                            />
                        </div>
                    )}

                </div>
            </FullScreen>
        </div>
    )
}

export default TabContent
