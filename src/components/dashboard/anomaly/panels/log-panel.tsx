import React, { useContext, useEffect, useState } from 'react'
import { Column, MetricLogAnomalyResponse } from '@/modules/models/anomaly-predictions'
import { GetHistoricalLogAnomalies, GetMetricAnomalies } from '@/modules/usecases/anomaly-predictions'
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
import SynchronizedCharts from '../../overview/chart/synchronized-charts'
import FilterPanel from '../button/filterPanel'
// import { AnomalyContext } from '@/contexts/anomaly-context'
import SynchronizedChartsMultipleScale from '../../overview/chart/synchronized-charts -multiple-scale'
import { dummyMutlipleYAxisAndScales } from './dummyMutlipleYAxisAndScales'


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
    const [currentZoomDateRange, setCurrentZoomDateRange] = useState<string>('Last 15 minutes')
    const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
    const [timeDifference, setTimeDifference] = useState<string>('Refreshed just now');
    const [filterAnomalyOptions, setFilterAnomalyOptions] = useState<CheckboxOption[]>([])
    const [selectedAnomalyOptions, setSelectedAnomalyOptions] = useState<string[]>([])
    const [filterServicesOptions, setFilterServiceOptions] = useState<string[]>([])
    const [selectedServicesOptions, setSelectedServiceOptions] = useState<string[]>([])
    const logType = selectedLog === 'Log APM' ? 'apm' : selectedLog === 'Log Brimo' ? 'brimo' : ''
    const selectedTimeRangeValue = timeRanges[selectedRange]
    const [isLoadingFilter, setIsLoadingFilter] = useState<boolean>(true)
    const [hasErrorFilter, setHasErrorFilter] = useState<boolean>(false)
    const [dataMetric, setDataMetric] = useState<MetricLogAnomalyResponse[]>([])
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

    const renderChart = () => {
        if (dataMetric.length === 0) {
            return (
                <div className="flex justify-center items-center">
                    <div className="spinner"></div>
                </div>
            )
        }

        switch (selectedLog) {
            case 'Log APM':
            case 'Log Brimo':
                // Get the keys of the object as an array
                const keys = Object.keys(defaultTimeRanges);
                // Find the index of the key
                const selectedKeyIndex = keys.indexOf(currentZoomDateRange);
        
                return (
                    <SynchronizedCharts
                        dataCharts={dataMetric} // Ensure dataMetric is relevant for Log Type
                        height={300}
                        width="100%"
                        zoomInDisabled={selectedKeyIndex <= 0}
                        zoomOutDisabled={selectedKeyIndex >= keys.length-1}
                        onZoomIn={handleGraphZoomIn}
                        onZoomOut={handleGraphZoomOut}
                        minXOnEmpty={new Date().getTime() - timeRanges[currentZoomDateRange] * 60 * 1000}
                        maxXOnEmpty={new Date().getTime()}
                    />
                );
            default:
                return (
                    <Typography variant="h6" component="h6" color="white">
                        No chart available for {selectedLog}
                    </Typography>
                )
        }
    }

    const handleRangeChange = async (rangeKey: string) => {
        const type = selectedLog === 'Log APM' ? 'apm' : 'brimo'
        const selectedTimeRange = defaultTimeRanges[rangeKey] // Convert rangeKey to number

        // Update the selected range state
        setSelectedRange(rangeKey)
        setLastRefreshTime(new Date());

        const filtersAnomaly = selectedAnomalyOptions.length > 0 ? selectedAnomalyOptions : []
        const filterServices = selectedServicesOptions.length > 0 ? selectedServicesOptions : []

        try {
            // Initiate both API calls concurrently and independently
            const logResultPromise = GetHistoricalLogAnomalies(type, 10, 1, filtersAnomaly, filterServices, selectedTimeRange)
            const metricResultPromise = GetMetricAnomalies(type, selectedTimeRange, filterServices)

            // Handle the result of the GetHistoricalLogAnomalies API call
            logResultPromise
                .then((logResult) => {
                    if (logResult.data) {
                        const { rows, columns, total_pages, page } = logResult.data

                        if (rows.length > 0) {
                            // Update the total number of pages based on the API response
                            setTotalPages(total_pages)

                            // Map the rows to the format required by the table
                            const newData = rows.map((row: any) => {
                                const mappedRow: any = {}
                                columns.forEach((col: any) => {
                                    mappedRow[col.key] = row[col.key]
                                })
                                return mappedRow
                            })

                            setData(newData) // Update the table data

                            // Update the pagination state
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex: page || 1,
                            }))
                        } else {
                            // Reset the table data and pagination if no data is found
                            setData([])
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex: 1,
                            }))
                        }
                    } else {
                        console.warn('API response data is null or undefined')
                    }
                })
                .catch((error) => {
                    console.error('Error fetching historical log anomalies:', error)
                    // Reset pagination in case of an error
                    setPagination((prev) => ({
                        ...prev,
                        pageIndex: 1,
                    }))
                })

            // Handle the result of the GetMetricAnomalies API call
            metricResultPromise
                .then((metricResult) => {
                    if (metricResult.data) {
                        setDataMetric(metricResult.data)
                    } else {
                        console.warn('API response data is null or undefined for metrics')
                    }
                })
                .catch((error) => {
                    console.error('Error fetching metric anomalies:', error)
                })
        } catch (error) {
            console.error('Unexpected error:', error)
        }
    }

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
        filter: string[] = [],
        date_range?: number // Make this optional and default to `undefined`
    ) => {
        table.setPageSize(newPageSize);
        setPagination((prev) => ({
            ...prev,
            pageSize: newPageSize,
            pageIndex: 0, // Reset to the first page when page size changes
        }));

        // Get the selected time range value here
        const selectedTimeRangeValue = timeRanges[selectedRange] || timeRanges['Last 15 minutes'];

        // Call API with the new page size
        try {
            const logAnomaliesPromise = GetHistoricalLogAnomalies(
                logType,
                newPageSize, // Set limit as the new page size
                page, // Reset to the first page
                filter,
                selectedServicesOptions,
                selectedTimeRangeValue
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
            console.error('Error fetching historical log anomalies:', error);
        }
    };

    const fetchDataByLog = async (
        logType: string,
        page: number,
        limit: number,
        filter: string[] = [],
        date_range: number
    ) => {
        // Start both API calls concurrently
        const logAnomaliesPromise = GetHistoricalLogAnomalies(
            logType,
            limit,
            page,
            selectedAnomalyOptions,
            selectedServicesOptions,
            date_range
        )
        const metricAnomaliesPromise = GetMetricAnomalies(logType, date_range, selectedServicesOptions)

        // Handle the result of the first API call
        logAnomaliesPromise
            .then((result) => {
                if (result.data) {
                    const { columns, rows, total_pages } = result.data

                    // Update the total number of pages based on the API response
                    setTotalPages(total_pages)

                    // Map the columns from the API response to the format required by the table
                    const newColumns = columns.map((column: any) => ({
                        id: column.key,
                        header: column.title,
                        accessorKey: column.key,
                    }))
                    setColumns(newColumns)

                    // Map the rows from the API response to the format required by the table
                    const newData = rows.map((row: any) => {
                        const mappedRow: any = {}
                        columns.forEach((col: any) => {
                            mappedRow[col.key] = row[col.key]
                        })
                        return mappedRow
                    })

                    // Update the table data
                    setData(newData)
                    setIsTableLoading(false)
                } else {
                    console.warn('API response data is null or undefined')
                }
            })
            .catch((error) => {
                handleApiError(error)
            })

        // Handle the result of the second API call
        metricAnomaliesPromise
            .then((metricResult) => {
                if (metricResult.data) {
                    setDataMetric(metricResult.data)
                    setIsChartLoading(false)
                } else {
                    console.warn('API response data is null or undefined for metrics')
                }
            })
            .catch((error) => {
                handleApiError(error)
            })
    }

    // Function to fetch data based on pagination
    const fetchDataByPagination = async (page: number, limit: number, filter: string[] = [], date_range: number) => {
        console.log('Fetching data for page:', page)
        let type = selectedLog === 'Log APM' ? 'apm' : selectedLog === 'Log Brimo' ? 'brimo' : ''
        const selectedTimeRangeValue = timeRanges[selectedRange]
        console.log(selectedTimeRangeValue)
        if (!type) {
            console.warn('Unknown log type:', selectedLog)
            return
        }

        try {
            const result = await GetHistoricalLogAnomalies(type, limit, page, [], [], selectedTimeRangeValue)

            if (result.data) {
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
            } else {
                console.warn('API response data is null or undefined')
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

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
            console.error('Failed to load checkbox options', error)
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
        const { selectedAnomalies, selectedServices } = filters

        // Update the state with the selected options
        setSelectedAnomalyOptions(selectedAnomalies)
        setSelectedServiceOptions(selectedServices)

        // Example: Fetch data based on the selected filters
        const type = selectedLog === 'Log APM' ? 'apm' : 'brimo'
        const timeRangeValue = timeRanges[selectedRange] // Get the specific time range value

        // Initiate both API calls concurrently and independently
        const logAnomaliesPromise = GetHistoricalLogAnomalies(
            type,
            pagination.pageSize, // Use the current page size
            1, // Start from the first page
            selectedAnomalies,
            selectedServices,
            timeRangeValue || 15 // Use the selected time range or fallback to 15 minutes
        )

        const metricAnomaliesPromise = GetMetricAnomalies(
            type,
            timeRangeValue || 15, // Use the selected time range or fallback to 15 minutes
            selectedServices
        )

        // Handle the result of the log anomalies API call
        logAnomaliesPromise
            .then((result) => {
                if (result.data) {
                    // Update the total number of pages based on the API response
                    setTotalPages(result.data.total_pages)

                    // Map the columns from the API response to the format required by the table
                    const newColumns = result.data.columns.map((column: any) => ({
                        id: column.key,
                        header: column.title,
                        accessorKey: column.key,
                    }))
                    setColumns(newColumns)

                    // Map the rows from the API response to the format required by the table
                    const newData = result.data.rows.map((row: any) => {
                        const mappedRow: any = {}
                        result.data?.columns.forEach((col: any) => {
                            mappedRow[col.key] = row[col.key]
                        })
                        return mappedRow
                    })

                    // Update the table data
                    setData(newData)

                    // Update the pagination state, resetting to the first page
                    setPagination((prev) => ({
                        ...prev,
                        pageIndex: 1, // Reset to the first page after applying filters
                    }))
                } else {
                    console.warn('API response data is null or undefined')
                }
            })
            .catch(handleApiError)

        // Handle the result of the metric anomalies API call
        metricAnomaliesPromise
            .then((result) => {
                if (result.data) {
                    setDataMetric(result.data)
                } else {
                    console.warn('API response data is null or undefined')
                }
            })
            .catch(handleApiError)
    }

    const nextPage = () => {
        const logType = selectedLog === 'Log APM' ? 'apm' : selectedLog === 'Log Brimo' ? 'brimo' : ''
        const selectedTimeRangeValue = timeRanges[selectedRange]
        console.log(selectedTimeRangeValue)

        setPagination((prev) => {
            const newPageIndex = Math.min(prev.pageIndex + 1, totalPages)

            if (selectedAnomalyOptions.length !== 0 && selectedServicesOptions.length === 0) {
                // If only anomaly options are selected
                GetHistoricalLogAnomalies(
                    logType,
                    prev.pageSize,
                    newPageIndex,
                    selectedAnomalyOptions,
                    [],
                    selectedTimeRangeValue
                )
                    .then((result) => processApiResult(result))
                    .catch((error) => handleApiError(error))
            } else if (selectedServicesOptions.length !== 0 && selectedAnomalyOptions.length === 0) {
                // If only service options are selected
                GetHistoricalLogAnomalies(
                    logType,
                    prev.pageSize,
                    newPageIndex,
                    [],
                    selectedServicesOptions,
                    selectedTimeRangeValue
                )
                    .then((result) => processApiResult(result))
                    .catch((error) => handleApiError(error))
            } else if (selectedAnomalyOptions.length !== 0 && selectedServicesOptions.length !== 0) {
                // If both anomaly and service options are selected
                GetHistoricalLogAnomalies(
                    logType,
                    prev.pageSize,
                    newPageIndex,
                    selectedAnomalyOptions,
                    selectedServicesOptions,
                    selectedTimeRangeValue
                )
                    .then((result) => processApiResult(result))
                    .catch((error) => handleApiError(error))
            } else {
                // If no filters are selected, proceed with normal pagination
                fetchDataByPagination(newPageIndex, prev.pageSize, [], selectedTimeRangeValue)
                    .then((result) => processApiResult(result))
                    .catch((error) => handleApiError(error))
            }

            return { ...prev, pageIndex: newPageIndex }
        })
    }

    const previousPage = () => {
        const logType = selectedLog === 'Log APM' ? 'apm' : selectedLog === 'Log Brimo' ? 'brimo' : ''
        const selectedTimeRangeValue = timeRanges[selectedRange]
        console.log(selectedTimeRangeValue)

        setPagination((prev) => {
            const newPageIndex = Math.max(prev.pageIndex - 1, 1)

            if (selectedAnomalyOptions.length !== 0 && selectedServicesOptions.length === 0) {
                // If only anomaly options are selected
                GetHistoricalLogAnomalies(
                    logType,
                    prev.pageSize,
                    newPageIndex,
                    selectedAnomalyOptions,
                    [],
                    selectedTimeRangeValue
                )
                    .then((result) => processApiResult(result))
                    .catch((error) => handleApiError(error))
            } else if (selectedServicesOptions.length !== 0 && selectedAnomalyOptions.length === 0) {
                // If only service options are selected
                GetHistoricalLogAnomalies(
                    logType,
                    prev.pageSize,
                    newPageIndex,
                    [],
                    selectedServicesOptions,
                    selectedTimeRangeValue
                )
                    .then((result) => processApiResult(result))
                    .catch((error) => handleApiError(error))
            } else if (selectedAnomalyOptions.length !== 0 && selectedServicesOptions.length !== 0) {
                // If both anomaly and service options are selected
                GetHistoricalLogAnomalies(
                    logType,
                    prev.pageSize,
                    newPageIndex,
                    selectedAnomalyOptions,
                    selectedServicesOptions,
                    selectedTimeRangeValue
                )
                    .then((result) => processApiResult(result))
                    .catch((error) => handleApiError(error))
            } else {
                // If no filters are selected, proceed with normal pagination
                fetchDataByPagination(newPageIndex, prev.pageSize, [], selectedTimeRangeValue)
                    .then((result) => processApiResult(result))
                    .catch((error) => handleApiError(error))
            }

            return { ...prev, pageIndex: newPageIndex }
        })
    }
    const handleGraphZoomIn = async () => {
        // Get the keys of the object as an array
        const keys = Object.keys(defaultTimeRanges);
        // Find the index of the key
        const selectedKeyIndex = keys.indexOf(currentZoomDateRange);

        // Do nothing if already at max zoomed in
        if (selectedKeyIndex <= 0) return
        
        // Select new range
        const newSelect = keys[selectedKeyIndex - 1];
        setCurrentZoomDateRange(newSelect)

        // Hit the GetMetricAnomalies API
        GetMetricAnomalies(selectedLog, timeRanges[newSelect], selectedServicesOptions)
            .then(result => {
                if (result.data) {
                    setDataMetric(result.data);
                } else {
                    console.warn('API response data is null or undefined');
                }
            })
            .catch(error => {
                console.error('Error fetching metric anomalies on date range change:', error);
            })
    }
    const handleGraphZoomOut = async () => {
        // Get the keys of the object as an array
        const keys = Object.keys(defaultTimeRanges);
        // Find the index of the key
        const selectedKeyIndex = keys.indexOf(currentZoomDateRange);

        // Do nothing if already at max zoomed out
        if (selectedKeyIndex >= keys.length-1) return
        
        // Select new range
        const newSelect = keys[selectedKeyIndex + 1];
        setCurrentZoomDateRange(newSelect)

        // Hit the GetMetricAnomalies API
        GetMetricAnomalies(selectedLog, timeRanges[newSelect], selectedServicesOptions)
            .then(result => {
                if (result.data) {
                    setDataMetric(result.data);
                } else {
                    console.warn('API response data is null or undefined');
                }
            })
            .catch(error => {
                console.error('Error fetching metric anomalies on date range change:', error);
            })
    }


    // Initial fetch when component mounts or selectedLog changes
    useEffect(() => {
        const type = selectedLog === 'Log APM' ? 'apm' : selectedLog === 'Log Brimo' ? 'brimo' : '';
        fetchDataByLog(type, pagination.pageIndex, pagination.pageSize, [], 15);
    }, []);

    useEffect(() => {
        const type = selectedLog === 'Log APM' ? 'apm' : selectedLog === 'Log Brimo' ? 'brimo' : ''

        // Fetch data based on the selected log
        fetchDataByLog(type, pagination.pageIndex, pagination.pageSize, [], 15)

        // Load filter options and reset the selected range
        loadAnomalyFilterOptions()
        loadServicesFilterOptions()
        // Reset Time Range
        setSelectedRange('')
    }, [selectedLog])

    useEffect(() => {
        // Get the keys of the object as an array
        const keys = Object.keys(defaultTimeRanges);
        // Find the index of the key
        const selectedKeyIndex = keys.indexOf(selectedRange === '' ? 'Last 15 minutes' : selectedRange);

        setCurrentZoomDateRange(keys[selectedKeyIndex])
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
