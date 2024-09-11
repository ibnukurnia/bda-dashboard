import { AnomalyOptionResponse, MetricLogAnomalyResponse } from "@/modules/models/anomaly-predictions";
import { GetColumnOption, GetMetricLogAnomalies } from "@/modules/usecases/anomaly-predictions";
import { useEffect, useRef, useState } from "react";
import { Typography } from "@mui/material";
import useUpdateEffect from "@/hooks/use-update-effect";
import MultipleScaleChart from "../chart/multiple-scale-charts";
import FilterGraphAnomaly from "../button/filterGraphAnomaly";
import SynchronizedCharts from "../chart/synchronized-charts";
import { ColumnOption } from "@/types/anomaly";
import { format, isAfter, isBefore } from "date-fns";
import Toggle, { ToggleOption } from "../button/toggle";

const toggleList: ToggleOption[] = [
    {
        id: "multi-scale",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="12" height="12" x="0" y="0" viewBox="0 0 438.536 438.536">
                <g>
                    <path d="M414.41 24.123C398.333 8.042 378.963 0 356.315 0H82.228C59.58 0 40.21 8.042 24.126 24.123 8.045 40.207.003 59.576.003 82.225v274.084c0 22.647 8.042 42.018 24.123 58.102 16.084 16.084 35.454 24.126 58.102 24.126h274.084c22.648 0 42.018-8.042 58.095-24.126 16.084-16.084 24.126-35.454 24.126-58.102V82.225c-.001-22.649-8.043-42.021-24.123-58.102z" fill="#ffffff">
                    </path>
                </g>
            </svg>
        ),
    },
    {
        id: "single-scale",
        icon: (
            <svg id="fi_8867520" height="12" width="12" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <path d="m40.421 296.421c-22.289 0-40.421-18.132-40.421-40.421s18.132-40.421 40.421-40.421h431.158c22.289 0 40.421 18.132 40.421 40.421s-18.132 40.421-40.421 40.421z" fill="#ffffff">
                    </path>
                    <path d="m40.421 107.789c-22.289 0-40.421-18.131-40.421-40.421s18.132-40.421 40.421-40.421h431.158c22.289 0 40.421 18.132 40.421 40.421s-18.132 40.421-40.421 40.421z" fill="#ffffff">
                    </path>
                    <path d="m40.421 485.053c-22.289 0-40.421-18.132-40.421-40.421s18.132-40.421 40.421-40.421h431.158c22.289 0 40.421 18.132 40.421 40.421s-18.132 40.421-40.421 40.421z" fill="#ffffff">
                    </path>
                </g>
            </svg>
        ),
    }
]

const GraphWrapper = ({
    children,
    isLoading,
    isEmpty,
    isFieldRequired,
}: {
    children: React.ReactNode;
    isLoading?: boolean;
    isEmpty?: boolean;
    isFieldRequired?: boolean;
}) => {
    if (isFieldRequired) return (
        <Typography variant="subtitle1" color="white" align="center">
            Please select a filter to view the data.
        </Typography>
    )
    if (isLoading) return (
        <div className="flex justify-center items-center">
            <div className="spinner"></div>
        </div>
    )
    if (isEmpty) return (
        <div className="text-center py-4">
            <Typography variant="subtitle1" color="white" align="center">
                Data is not available.
            </Typography>
        </div>
    )
    return children
}

const Graph = ({
    data,
    selectedGraphToggle,
    onZoomOut,
    minXOnEmpty,
    maxXOnEmpty,
}: {
    data: MetricLogAnomalyResponse[];
    selectedGraphToggle: ToggleOption;
    onZoomOut: (minX: any, maxX: any) => void;
    minXOnEmpty?: number;
    maxXOnEmpty?: number;
}) => {
    const minX = new Date()
    minX.setHours(minX.getHours() - 24)
    const maxX = new Date()

    if (toggleList.indexOf(selectedGraphToggle) === 0) {
        return (
            <MultipleScaleChart
                dataCharts={data}
                height={600}
                width="100%"
                onZoomOut={onZoomOut}
                minXOnEmpty={minXOnEmpty}
                maxXOnEmpty={maxXOnEmpty}
                minX={minX.getTime()}
                maxX={maxX.getTime()}
            />
        )
    }
    if (toggleList.indexOf(selectedGraphToggle) === 1) {
        return (
            <SynchronizedCharts
                dataCharts={data}
                height={300}
                width="100%"
                onZoomOut={onZoomOut}
                minXOnEmpty={minXOnEmpty}
                maxXOnEmpty={maxXOnEmpty}
                minX={minX.getTime()}
                maxX={maxX.getTime()}
            />
        )
    }
}
interface GraphicAnomalyCardProps {
    selectedLog?: string;
    selectedSecurity?: string;
    selectedUtilization?: string;
    selectedTimeRangeKey: string;
    timeRanges: Record<string, number>;
    servicesOptions: string[];
}

const GraphAnomalyCard: React.FC<GraphicAnomalyCardProps> = ({
    selectedLog,
    selectedUtilization,
    selectedSecurity,
    selectedTimeRangeKey,
    timeRanges,
    servicesOptions,
}) => {
    const [dataColumn, setDataColumn] = useState<AnomalyOptionResponse>({ columns: [] })
    const [dataMetric, setDataMetric] = useState<MetricLogAnomalyResponse[]>([])
    const [lastTimeRangeParam, setLastTimeRangeParam] = useState<{
        startTime: string | null;
        endTime: string | null;
    }>({
        startTime: null,
        endTime: null,
    })
    const [currentZoomDateRange, setCurrentZoomDateRange] = useState<string>(selectedTimeRangeKey === '' ? 'Last 15 minutes' : selectedTimeRangeKey)
    const [customTime, setCustomTime] = useState<{
        startTime: string;
        endTime: string;
    }>({ startTime: new Date().toString(), endTime: new Date().toString() })
    const [dateRangeMode, setDateRangeMode] = useState<"predefined" | "custom">("predefined")
    const [selectedFilter, setSelectedFilter] = useState<{ scale: ColumnOption[], service: string }>({ scale: [], service: "" })
    const [selectedGraphToggle, setSelectedGraphToggle] = useState(toggleList[0])
    const [initialLoading, setInitialLoading] = useState(true)
    const activeType = selectedLog ?? selectedUtilization ?? selectedSecurity ?? '';


    const abortControllerRef = useRef<AbortController | null>(null); // Ref to store the AbortController


    // Get the keys of the object as an array
    const keys = Object.keys(timeRanges);
    // Find the index of the key
    const selectedKeyIndex = keys.indexOf(currentZoomDateRange);
    const selectedTimeRange = timeRanges[currentZoomDateRange] ?? 15

    // Calculate endDate as the current time, rounding down the seconds to 00
    const endDateObj = new Date();
    endDateObj.setSeconds(0, 0); // Set seconds and milliseconds to 00

    // Calculate startDate by subtracting the selected time range (in minutes) from the endDate
    const startDateObj = new Date(endDateObj.getTime() - selectedTimeRange * 60000); // 60000 ms = 1 minute

    // Convert startDate and endDate to strings
    const predefinedStartTime = format(startDateObj, 'yyyy-MM-dd HH:mm:ss');
    const predefinedEndTime = format(endDateObj, 'yyyy-MM-dd HH:mm:ss');

    const getMinX = () => {
        if (dateRangeMode === "predefined") {
            return new Date().getTime() - timeRanges[currentZoomDateRange] * 60 * 1000
        }
        if (dateRangeMode === "custom") {
            return new Date(customTime.startTime).getTime()
        }
    }
    const getMaxX = () => {
        if (dateRangeMode === "predefined") {
            return new Date().getTime()
        }
        if (dateRangeMode === "custom") {
            return new Date(customTime.endTime).getTime()
        }
    }

    useEffect(() => {
        // Cleanup function to abort fetch when the component unmounts
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [])
    
    useEffect(() => {
        setDataColumn({columns: []})
        setSelectedFilter({ scale: [], service: "" })
        GetColumnOption(activeType)
            .then((result) => {
                if (result.data) {
                    setDataColumn(result.data)
                } else {
                    console.warn('API response data is null or undefined for column option')
                }
            })
            .catch((error) => {
                console.error('Error fetching column option:', error)
            })
    }, [activeType]);

    useUpdateEffect(() => {
        if (selectedFilter.scale.length <= 0 || selectedFilter.service.length <= 0) return;

        // Use activeType to determine which type is currently active
        fetchMetricLog(activeType, predefinedStartTime, predefinedEndTime, selectedFilter.service, selectedFilter.scale.map(scale => scale.name));
    }, [currentZoomDateRange])

    useUpdateEffect(() => {
        if (selectedFilter.scale.length <= 0 || selectedFilter.service.length <= 0) return
        fetchMetricLog(activeType, customTime.startTime, customTime.endTime, selectedFilter.service, selectedFilter.scale.map(scale => scale.name))
    }, [customTime])

    useUpdateEffect(() => {
        if (selectedFilter.scale.length <= 0 || selectedFilter.service.length <= 0) return

        if (dateRangeMode === "predefined") {
            fetchMetricLog(activeType, predefinedStartTime, predefinedEndTime, selectedFilter.service, selectedFilter.scale.map(scale => scale.name))
            return
        }
        if (dateRangeMode === "custom") {
            fetchMetricLog(activeType, customTime.startTime, customTime.endTime, selectedFilter.service, selectedFilter.scale.map(scale => scale.name))
        }
    }, [selectedFilter])

    useUpdateEffect(() => {
        if (selectedTimeRangeKey.includes(' - ')) {
            // Handle custom range
            const [start, end] = selectedTimeRangeKey.split(' - ');
            setDateRangeMode("custom")
            setCustomTime({
                startTime: start,
                endTime: end,
            })
            return
        }

        setDateRangeMode("predefined")
        setCurrentZoomDateRange(selectedTimeRangeKey)
    }, [selectedTimeRangeKey])

    const fetchMetricLog = async (
        activeType: string,
        startTime: string,
        endTime: string,
        serviceName: string,
        scales: string[],
    ) => {
        // Abort any ongoing fetch request before starting a new one
        if (abortControllerRef.current) {
            abortControllerRef.current.abort("Create new fetch request");
        }

        // Create a new AbortController instance for the new fetch request
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const metricResultPromise = GetMetricLogAnomalies({
            type: activeType,
            start_time: startTime,
            end_time: endTime,
            service_name: serviceName,
            metric_name: scales,
        }, controller.signal)

        return metricResultPromise
            .then((metricResult) => {
                if (metricResult.data) {
                    setLastTimeRangeParam({
                        startTime: startTime,
                        endTime: endTime,
                    })
                    setDataMetric(metricResult.data)
                } else {
                    console.warn('API response data is null or undefined for metrics')
                }
                setInitialLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching metric anomalies:', error)
                setInitialLoading(false)
            })
    }

    const handleGraphZoomOut = async (minX: any, maxX: any) => {
        if ((lastTimeRangeParam.startTime != null && lastTimeRangeParam.endTime != null) &&
             (isBefore(lastTimeRangeParam.startTime, minX) || isAfter(lastTimeRangeParam.endTime, maxX))) {
                return
        }

        fetchMetricLog(
            activeType,
            format(new Date(minX), 'yyyy-MM-dd HH:mm:ss'),
            format(new Date(maxX), 'yyyy-MM-dd HH:mm:ss'),
            selectedFilter.service,
            selectedFilter.scale.map(scale => scale.name)
        )
    }

    const handleOnApplyFilter = (selectedScales: ColumnOption[], selectedService: string) => {
        setSelectedFilter({
            scale: selectedScales,
            service: selectedService,
        })

    }

    const handleSelectToggle = (value: ToggleOption) => {
        setSelectedGraphToggle(value)
    }

    return (
        <div className="flex flex-col gap-8">
            <FilterGraphAnomaly
                currentSelectedScales={selectedFilter.scale}
                currentSelectedService={selectedFilter.service}
                scaleOptions={dataColumn.columns}
                servicesOptions={servicesOptions}
                onApplyFilters={handleOnApplyFilter}
            />
            <Typography variant="h5" component="h5" color="white">
                Graphic Anomaly Records
            </Typography>
            <div className="flex gap-2 items-center">
                {selectedFilter.service &&
                    <Typography variant="subtitle1" color="white">
                        Service name: {selectedFilter.service}
                    </Typography>
                }
                {dataMetric.length !== 0 &&
                    <div className="ml-auto">
                        <Toggle
                            defaultToggle={selectedGraphToggle}
                            handleSelect={handleSelectToggle}
                            toggleList={toggleList}
                        />
                    </div>
                }
            </div>
            <GraphWrapper
                isFieldRequired={selectedFilter.scale.length <= 0 || selectedFilter.service.length <= 0}
                isLoading={initialLoading}
                isEmpty={dataMetric.length === 0}
            >
                <Graph
                    data={dataMetric}
                    selectedGraphToggle={selectedGraphToggle}
                    onZoomOut={handleGraphZoomOut}
                    minXOnEmpty={getMinX()}
                    maxXOnEmpty={getMaxX()}
                />
            </GraphWrapper>
        </div>
    )
}

export default GraphAnomalyCard