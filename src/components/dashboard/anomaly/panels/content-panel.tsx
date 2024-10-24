import React, { useEffect, useState } from 'react'
import { ClusterOptionResponse, Column } from '@/modules/models/anomaly-predictions'
import { GetClusterOption, GetHistoricalLogAnomalies } from '@/modules/usecases/anomaly-predictions'
import { Typography } from '@mui/material'
import {
    ColumnDef,
} from '@tanstack/react-table'
import { CheckboxOption, fetchAnomalyOption, fetchDnsCategoryOption, fetchDnsDomainOption, fetchPrtgTrafficDeviceOption, fetchPrtgTrafficSensorOption, fetchServicesOption, fetchSolarWindsInterfaceOption, fetchSolarWindsNetworkOption, fetchSolarWindsNodeOption } from '@/lib/api'
import DropdownTime from '../button/dropdown-time'
import FilterPanel from '../button/filterPanel'
import GraphAnomalyCard from '../card/graph-anomaly-card'
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { format } from 'date-fns';
import AutoRefreshButton from '../button/refreshButton'
import { NAMESPACE_LABELS, PREDEFINED_TIME_RANGES } from '@/constants'
import { useRouter, useSearchParams } from 'next/navigation'
import { Maximize } from 'react-feather'
import Button from '@/components/system/Button/Button'
import TableHistoricalAnomaly from '../table/table-historical-anomaly'
import useUpdateEffect from '@/hooks/use-update-effect'

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

        const page = 1 // Reset to the first page when page size changes
        setPagination((prev) => ({
            ...prev,
            pageIndex: page,
        }));

        // Initiate both API calls concurrently and independently
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
                await fetchHistoricalAnomalyRecords({
                    logType: selectedDataSource,
                    page: pagination.pageIndex,     // Page number
                    limit: pagination.pageSize,      // Page size (limit)
                });
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

    const loadSolarWindsNetworkFilterOptions = async () => {
        try {
            const { startTime, endTime } = getTimeRange()

            const response = await fetchSolarWindsNetworkOption({
                start_time: startTime,
                end_time: endTime
            })

            setFilterSolarWindsNetworkOptions(response.data) // Update state with fetched service options
            setHasErrorFilterSolarWindsNetwork(false)
        } catch (error) {
            console.error('Failed to load Solar Winds network options', error)
            setHasErrorFilterSolarWindsNetwork(true)
        }
    }

    const loadSolarWindsNodeFilterOptions = async () => {
        try {
            const { startTime, endTime } = getTimeRange()

            const response = await fetchSolarWindsNodeOption({
                start_time: startTime,
                end_time: endTime
            })

            setFilterSolarWindsNodeOptions(response.data) // Update state with fetched service options
            setHasErrorFilterSolarWindsNode(false)
        } catch (error) {
            console.error('Failed to load Solar Winds node options', error)
            setHasErrorFilterSolarWindsNode(true)
        }
    }

    const loadSolarWindsInterfaceFilterOptions = async () => {
        try {
            const { startTime, endTime } = getTimeRange()

            const response = await fetchSolarWindsInterfaceOption({
                start_time: startTime,
                end_time: endTime
            })

            setFilterSolarWindsInterfaceOptions(response.data) // Update state with fetched service options
            setHasErrorFilterSolarWindsInterface(false)
        } catch (error) {
            console.error('Failed to load Solar Winds interface options', error)
            setHasErrorFilterSolarWindsInterface(true)
        }
    }

    const loadDnsDomainFilterOptions = async () => {
        try {
            const { startTime, endTime } = getTimeRange()

            const response = await fetchDnsDomainOption({
                start_time: startTime,
                end_time: endTime
            })

            setFilterDnsDomainOptions(response.data) // Update state with fetched service options
            setHasErrorFilterDnsDomain(false)
        } catch (error) {
            console.error('Failed to load DNS interface options', error)
            setHasErrorFilterDnsDomain(true)
        }
    }

    const loadDnsCategoryFilterOptions = async () => {
        try {
            const { startTime, endTime } = getTimeRange()

            const response = await fetchDnsCategoryOption({
                start_time: startTime,
                end_time: endTime
            })

            setFilterDnsCategoryOptions(response.data) // Update state with fetched service options
            setHasErrorFilterDnsCategory(false)
        } catch (error) {
            console.error('Failed to load DNS interface options', error)
            setHasErrorFilterDnsCategory(true)
        }
    }

    const loadPrtgTrafficDeviceFilterOptions = async () => {
        try {
            const { startTime, endTime } = getTimeRange()

            const response = await fetchPrtgTrafficDeviceOption({
                start_time: startTime,
                end_time: endTime
            })

            setFilterPrtgTrafficDeviceOptions(response.data) // Update state with fetched service options
            setHasErrorFilterPrtgTrafficDevice(false)
        } catch (error) {
            console.error('Failed to load PRTG Traffic interface options', error)
            setHasErrorFilterPrtgTrafficDevice(true)
        }
    }

    const loadPrtgTrafficSensorFilterOptions = async () => {
        try {
            const { startTime, endTime } = getTimeRange()

            const response = await fetchPrtgTrafficSensorOption({
                start_time: startTime,
                end_time: endTime
            })

            setFilterPrtgTrafficSensorOptions(response.data) // Update state with fetched service options
            setHasErrorFilterPrtgTrafficSensor(false)
        } catch (error) {
            console.error('Failed to load PRTG Traffic interface options', error)
            setHasErrorFilterPrtgTrafficSensor(true)
        }
    }

    const loadFiltersOptions = () => {
        loadAnomalyFilterOptions();
        loadSeverityFilterOptions();
        if (selectedDataSource === "solarwinds") {
            loadSolarWindsNetworkFilterOptions();
            loadSolarWindsNodeFilterOptions();
            loadSolarWindsInterfaceFilterOptions();
            return
        }
        if (selectedDataSource === "dns_rt") {
            loadClusterFilterOptions();
            loadDnsDomainFilterOptions();
            loadDnsCategoryFilterOptions();
            return
        }
        if (selectedDataSource === "prtg_traffic") {
            loadPrtgTrafficDeviceFilterOptions();
            loadPrtgTrafficSensorFilterOptions();
            return
        }
        loadClusterFilterOptions();
        loadServicesFilterOptions();

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
                        networkOptions={filterSolarWindsNetworkOptions}
                        nodeOptions={filterSolarWindsNodeOptions}
                        interfaceOptions={filterSolarWindsInterfaceOptions}
                        categoryOptions={filterDnsCategoryOptions}
                        domainOptions={filterDnsDomainOptions}
                        deviceOptions={filterPrtgTrafficDeviceOptions}
                        sensorOptions={filterPrtgTrafficSensorOptions}
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
