import React, { useEffect, useState } from 'react'
import { ClusterOptionResponse, Column } from '@/modules/models/anomaly-predictions'
import { DownloadCsvHistoricalLogAnomalies, GetClusterOption, GetHistoricalLogAnomalies } from '@/modules/usecases/anomaly-predictions'
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
    const timeRange = searchParams.get("time_range")
    const timeRangeGraphic = searchParams.get("time_range")
    const selectedAnomalyOptions = searchParams.getAll("anomaly")
    const selectedClustersOptions = searchParams.getAll("cluster")
    const selectedServicesOptions = searchParams.getAll("service")
    const selectedSeverityOptions = searchParams.getAll("severity").map(Number);
    const selectedOperationOptions = searchParams.get("operation") as string;
    const selectedNetworkOptions = searchParams.getAll("network")
    const selectedNodeOptions = searchParams.getAll("node")
    const selectedInterfaceOptions = searchParams.getAll("interface")
    const selectedCategoryOptions = searchParams.getAll("category")
    const selectedDomainOptions = searchParams.getAll("domain")
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
    const [filterSolarWindsNetworkOptions, setFilterSolarWindsNetworkOptions] = useState<string[] | null | undefined>(null)
    const [filterSolarWindsNodeOptions, setFilterSolarWindsNodeOptions] = useState<string[] | null | undefined>(null)
    const [filterSolarWindsInterfaceOptions, setFilterSolarWindsInterfaceOptions] = useState<string[] | null | undefined>(null)
    const [filterDnsDomainOptions, setFilterDnsDomainOptions] = useState<string[] | null | undefined>(null)
    const [filterDnsCategoryOptions, setFilterDnsCategoryOptions] = useState<string[] | null | undefined>(null)
    const [filterPrtgTrafficDeviceOptions, setFilterPrtgTrafficDeviceOptions] = useState<string[] | null | undefined>(null)
    const [filterPrtgTrafficSensorOptions, setFilterPrtgTrafficSensorOptions] = useState<string[] | null | undefined>(null)
    const [filterSeverityOptions, setFilterSeverityOptions] = useState<{ id: number; label: string; type: string }[]>([]);
    const [hasErrorFilterAnomaly, setHasErrorFilterAnomaly] = useState<boolean>(false)
    const [hasErrorFilterCluster, setHasErrorFilterCluster] = useState<boolean>(false)
    const [hasErrorFilterService, setHasErrorFilterService] = useState<boolean>(false)
    const [hasErrorFilterSolarWindsNetwork, setHasErrorFilterSolarWindsNetwork] = useState<boolean>(false)
    const [hasErrorFilterSolarWindsNode, setHasErrorFilterSolarWindsNode] = useState<boolean>(false)
    const [hasErrorFilterSolarWindsInterface, setHasErrorFilterSolarWindsInterface] = useState<boolean>(false)
    const [hasErrorFilterDnsDomain, setHasErrorFilterDnsDomain] = useState<boolean>(false)
    const [hasErrorFilterDnsCategory, setHasErrorFilterDnsCategory] = useState<boolean>(false)
    const [hasErrorFilterPrtgTrafficDevice, setHasErrorFilterPrtgTrafficDevice] = useState<boolean>(false)
    const [hasErrorFilterPrtgTrafficSensor, setHasErrorFilterPrtgTrafficSensor] = useState<boolean>(false)
    const [hasErrorFilterSeverity, setHasErrorFilterSeverity] = useState<boolean>(false)
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
        const filterClusters = selectedClustersOptions.length > 0 ? selectedClustersOptions : [];
        const filterServices = selectedServicesOptions.length > 0 ? selectedServicesOptions : [];
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
            clusters: filterClusters,
            services: filterServices,
            severities: filterSeverities,
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
            clusters: selectedClustersOptions,
            services: selectedServicesOptions,
            severities: selectedSeverityOptions,
            operation: selectedOperationOptions,
        });

    };

    const fetchHistoricalAnomalyRecords = async (payload: {
        logType: string,
        page: number,
        limit: number,
        timeRange?: string,
        anomalies?: string[],
        operation?: string, // Add the selectedOperation parameter here
        severities?: number[],
        clusters?: string[],
        services?: string[],
        network?: string[],
        node?: string[],
        interface?: string[],
        category?: string[],
        domain?: string[],
    }) => {
        setIsTableLoading(true);

        // Now pass the validTimeRange to getTimeRange
        const { startTime, endTime } = getTimeRange(payload.timeRange);

        // Pass the selectedOperation to the API call
        const logAnomaliesPromise = GetHistoricalLogAnomalies({
            type: payload.logType,
            limit: payload.limit,
            page: payload.page,
            filters: payload.anomalies ?? selectedAnomalyOptions,
            cluster: payload.clusters ?? selectedClustersOptions,
            service_name: payload.services ?? selectedServicesOptions,
            severity: payload.severities ?? selectedSeverityOptions,
            start_time: startTime,
            end_time: endTime,
            operation: payload.operation ?? selectedOperationOptions,// Default to OR if undefined
            network: payload.network ?? selectedNetworkOptions,
            node: payload.node ?? selectedNodeOptions,
            interface: payload.interface ?? selectedInterfaceOptions,
            category: payload.category ?? selectedCategoryOptions,
            domain: payload.domain ?? selectedDomainOptions,
        });

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

    const loadFiltersOptions = async () => {
        const { startTime, endTime } = getTimeRange();

        // Map each filter to its respective loading function with error handling
        const filtersMap: { [key: string]: () => Promise<void> } = {
            anomaly: async () => {
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
            },

            severity: async () => {
                setFilterSeverityOptions([
                    { id: 1, label: 'Very High', type: 'severity' },
                    { id: 2, label: 'High', type: 'severity' },
                    { id: 3, label: 'Medium', type: 'severity' }
                ]);
            },

            cluster: async () => {
                try {
                    const response = await GetClusterOption({ type: selectedDataSource, start_time: startTime, end_time: endTime });
                    setFilterClusterOptions(response.data);
                    setHasErrorFilterCluster(false);
                } catch (error) {
                    handleApiError(error);
                    setHasErrorFilterCluster(true);
                }
            },

            services: async () => {
                try {
                    const response = await fetchServicesOption({ type: selectedDataSource, start_time: startTime, end_time: endTime });
                    setFilterServiceOptions(response.data?.services);
                    setHasErrorFilterService(false);
                } catch (error) {
                    handleApiError(error);
                    setHasErrorFilterService(true);
                }
            },

            solarWindsNetwork: async () => {
                try {
                    const response = await fetchSolarWindsNetworkOption({ start_time: startTime, end_time: endTime });
                    setFilterSolarWindsNetworkOptions(response.data);
                    setHasErrorFilterSolarWindsNetwork(false);
                } catch (error) {
                    handleApiError(error);
                    setHasErrorFilterSolarWindsNetwork(true);
                }
            },

            solarWindsNode: async () => {
                try {
                    const response = await fetchSolarWindsNodeOption({ start_time: startTime, end_time: endTime });
                    setFilterSolarWindsNodeOptions(response.data);
                    setHasErrorFilterSolarWindsNode(false);
                } catch (error) {
                    handleApiError(error);
                    setHasErrorFilterSolarWindsNode(true);
                }
            },

            solarWindsInterface: async () => {
                try {
                    const response = await fetchSolarWindsInterfaceOption({ start_time: startTime, end_time: endTime });
                    setFilterSolarWindsInterfaceOptions(response.data);
                    setHasErrorFilterSolarWindsInterface(false);
                } catch (error) {
                    handleApiError(error);
                    setHasErrorFilterSolarWindsInterface(true);
                }
            },

            dnsDomain: async () => {
                try {
                    const response = await fetchDnsDomainOption({ start_time: startTime, end_time: endTime });
                    setFilterDnsDomainOptions(response.data);
                    setHasErrorFilterDnsDomain(false);
                } catch (error) {
                    handleApiError(error);
                    setHasErrorFilterDnsDomain(true);
                }
            },

            dnsCategory: async () => {
                try {
                    const response = await fetchDnsCategoryOption({ start_time: startTime, end_time: endTime });
                    setFilterDnsCategoryOptions(response.data);
                    setHasErrorFilterDnsCategory(false);
                } catch (error) {
                    handleApiError(error);
                    setHasErrorFilterDnsCategory(true);
                }
            },

            prtgTrafficDevice: async () => {
                try {
                    const response = await fetchPrtgTrafficDeviceOption({ start_time: startTime, end_time: endTime });
                    setFilterPrtgTrafficDeviceOptions(response.data);
                    setHasErrorFilterPrtgTrafficDevice(false);
                } catch (error) {
                    handleApiError(error);
                    setHasErrorFilterPrtgTrafficDevice(true);
                }
            },

            prtgTrafficSensor: async () => {
                try {
                    const response = await fetchPrtgTrafficSensorOption({ start_time: startTime, end_time: endTime });
                    setFilterPrtgTrafficSensorOptions(response.data);
                    setHasErrorFilterPrtgTrafficSensor(false);
                } catch (error) {
                    handleApiError(error);
                    setHasErrorFilterPrtgTrafficSensor(true);
                }
            },
        };

        // Always load `anomaly` and `severity` filters
        await filtersMap.anomaly();
        await filtersMap.severity();

        // Load specific filters based on `selectedDataSource`
        switch (selectedDataSource) {
            case 'solarwinds':
                await filtersMap.solarWindsNetwork();
                await filtersMap.solarWindsNode();
                await filtersMap.solarWindsInterface();
                break;

            case 'dns_rt':
                await filtersMap.cluster();
                await filtersMap.dnsDomain();
                await filtersMap.dnsCategory();
                break;

            case 'prtg_traffic':
                await filtersMap.prtgTrafficDevice();
                await filtersMap.prtgTrafficSensor();
                break;

            default:
                await filtersMap.cluster();
                await filtersMap.services();
        }
    };

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
            fetchHistoricalAnomalyRecords({
                logType: selectedDataSource,
                page: page,
                limit: prev.pageSize,
            });
            return { ...prev, pageIndex: page };
        });
    };

    const handleApplyFilters = async (
        filters: {
            selectedAnomalies: string[];
            selectedOperation: string
            selectedSeverities: number[]
            selectedClusters: ClusterOptionResponse[];
            selectedServices: string[];
            selectedNetwork: string[];
            selectedNode: string[];
            selectedInterface: string[];
            selectedCategory: string[];
            selectedDomain: string[];
        }) => {
        const {
            selectedAnomalies,
            selectedServices,
            selectedSeverities,
            selectedClusters,
            selectedOperation,
            selectedNetwork,
            selectedNode,
            selectedInterface,
            selectedCategory,
            selectedDomain,
        } = filters;

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

        params.delete("network")
        selectedNetwork.forEach(network => params.append("network", network))

        params.delete("node")
        selectedNode.forEach(node => params.append("node", node))

        params.delete("interface")
        selectedInterface.forEach(i => params.append("interface", i))

        params.delete("category")
        selectedCategory.forEach(category => params.append("category", category))

        params.delete("domain")
        selectedDomain.forEach(domain => params.append("domain", domain))

        // Add selected operation (OR/AND) to the URL or use it in logic as needed
        params.delete("operation");
        params.append("operation", selectedOperation);

        router.replace(`/dashboard/anomaly-detection?${params.toString()}`);
    };

    const handleDownload = () => {
        if (isDownloadingCsv) return
        setIsDownloadingCsv(true)
        const { startTime, endTime } = getTimeRange();
        DownloadCsvHistoricalLogAnomalies({
            type: selectedDataSource,
            filters: selectedAnomalyOptions,
            cluster: selectedClustersOptions,
            service_name: selectedServicesOptions,
            severity: selectedSeverityOptions,
            start_time: startTime,
            end_time: endTime,
            operation: selectedOperationOptions,// Default to OR if undefined
            network: selectedNetworkOptions,
            node: selectedNodeOptions,
            interface: selectedInterfaceOptions,
            category: selectedCategoryOptions,
            domain: selectedDomainOptions,
        }).finally(() => setIsDownloadingCsv(false))
    }

    useEffect(() => {
        setIsTableHeaderLoading(true);
        setIsTableLoading(true);
        setFilterSolarWindsNetworkOptions(null)
        setFilterSolarWindsNodeOptions(null)
        setFilterSolarWindsInterfaceOptions(null)
        setFilterDnsCategoryOptions(null)
        setFilterDnsDomainOptions(null)
        setFilterPrtgTrafficDeviceOptions(null)
        setFilterPrtgTrafficSensorOptions(null)
        setFilterClusterOptions(null)
        setFilterServiceOptions(null)
        const page = 1 // Reset to the first page when page size changes
        setPagination((prev) => ({
            ...prev,
            pageIndex: page,
        }));

        fetchHistoricalAnomalyRecords({
            logType: selectedDataSource,
            page: 1,
            limit: pagination.pageSize,
        });

        loadFiltersOptions()
    }, [selectedDataSource]);

    useUpdateEffect(() => {
        if (isTableHeaderLoading) return
        const page = 1 // Reset to the first page when page size changes
        setPagination((prev) => ({
            ...prev,
            pageIndex: page,
        }));

        fetchHistoricalAnomalyRecords({
            logType: selectedDataSource,
            page: 1,
            limit: pagination.pageSize, // Use the current page size
        });
    }, [
        searchParams
    ]);

    useUpdateEffect(() => {
        loadFiltersOptions()
    }, [timeRange])

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
                            anomalies: selectedAnomalyOptions,    // Anomaly filter options
                            clusters: selectedClustersOptions,   // Cluster filter options
                            services: selectedServicesOptions,   // Service filter options
                            severities: selectedSeverityOptions,
                            operation: selectedOperationOptions
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
    }, [autoRefresh, refreshInterval, selectedDataSource, pagination.pageIndex, pagination.pageSize, selectedAnomalyOptions, selectedServicesOptions, selectedSeverityOptions, selectedTimeRange]);

    return (
        <div className='flex flex-col gap-4'>
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
                                    <FilterPanel
                                        clusterOptions={filterClusterOptions}
                                        checkboxOptions={filterAnomalyOptions}
                                        servicesOptions={filterServiceOptions}
                                        solarWindsNetworkOptions={filterSolarWindsNetworkOptions}
                                        solarWindsNodeOptions={filterSolarWindsNodeOptions}
                                        solarWindsInterfaceOptions={filterSolarWindsInterfaceOptions}
                                        dnsCategoryOptions={filterDnsCategoryOptions}
                                        dnsDomainOptions={filterDnsDomainOptions}
                                        prtgTrafficDeviceOptions={filterPrtgTrafficDeviceOptions}
                                        prtgTrafficSensorOptions={filterPrtgTrafficSensorOptions}
                                        severityOptions={filterSeverityOptions}
                                        onApplyFilters={handleApplyFilters}
                                        onResetFilters={handleResetFilters}
                                        hasErrorFilterAnomaly={hasErrorFilterAnomaly}
                                        hasErrorFilterService={hasErrorFilterService}
                                        hasErrorFilterCluster={hasErrorFilterCluster}
                                        hasErrorFilterSeverity={hasErrorFilterSeverity}
                                        hasErrorFilterSolarWindsNetwork={hasErrorFilterSolarWindsNetwork}
                                        hasErrorFilterSolarWindsNode={hasErrorFilterSolarWindsNode}
                                        hasErrorFilterSolarWindsInterface={hasErrorFilterSolarWindsInterface}
                                        hasErrorFilterDnsCategory={hasErrorFilterDnsCategory}
                                        hasErrorFilterDnsDomain={hasErrorFilterDnsDomain}
                                    />
                                )}
                                <DownloadButton
                                    onClick={handleDownload}
                                    isDownloading={isDownloadingCsv}
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
                    <div className='card-style p-6'>
                        <GraphAnomalyCard
                            selectedDataSource={selectedDataSource}
                            selectedTimeRangeKey={selectedTimeRange}
                            timeRanges={PREDEFINED_TIME_RANGES}
                            autoRefresh={graphAutoRefresh}
                            isFullScreen={handle.active}
                        />
                    </div>
                </div>
            </FullScreen>
        </div>
    )
}

export default TabContent
