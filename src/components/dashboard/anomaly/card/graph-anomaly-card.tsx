import { AnomalyOptionResponse, MetricLogAnomalyResponse } from "@/modules/models/anomaly-predictions";
import { GetColumnOption, GetMetricLogAnomalies } from "@/modules/usecases/anomaly-predictions";
import { useEffect, useRef, useState } from "react";
import { Typography } from "@mui/material";
import useUpdateEffect from "@/hooks/use-update-effect";
import SynchronizedChartsMultipleScale from "../../overview/chart/synchronized-charts-multiple-scale";
import { dummyDataMetric, dummyMutlipleYAxisAndScales, dummyScalesOption } from "../panels/dummyMutlipleYAxisAndScales";
import FilterGraphAnomaly from "../button/filterGraphAnomaly";
import SynchronizedCharts from "../../overview/chart/synchronized-charts";
import { ColumnOption } from "@/types/anomaly";
import { format } from "date-fns";
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
            DATA IS NOT AVAILABLE. PLEASE USE FILTER BUTTON TO FETCH DATA
        </Typography>
    )
    if (isLoading) return (
        <div className="flex justify-center items-center">
            <div className="spinner"></div>
        </div>
    )
    if (isEmpty) return (
        <div className="text-center py-4">
            <div className="text-center text-2xl font-semibold text-white">DATA IS NOT AVAILABLE</div>
        </div>
    )
    return children
}

const Graph = ({
    data,
    selectedGraphToggle,
    zoomInDisabled,
    zoomOutDisabled,
    onZoomIn,
    onZoomOut,
    minXOnEmpty,
    maxXOnEmpty,
}: {
    data: MetricLogAnomalyResponse[];
    selectedGraphToggle: ToggleOption;
    zoomInDisabled: boolean;
    zoomOutDisabled: boolean;
    onZoomIn: (minX: any, maxX: any) => void;
    onZoomOut: (minX: any, maxX: any) => void;
    minXOnEmpty?: number;
    maxXOnEmpty?: number;
}) => {
    if (toggleList.indexOf(selectedGraphToggle) === 0) {
        return(
            <SynchronizedChartsMultipleScale
                dataCharts={data}
                height={600}
                width="100%"
                zoomInDisabled={zoomInDisabled}
                zoomOutDisabled={zoomOutDisabled}
                onZoomIn={onZoomIn}
                onZoomOut={onZoomOut}
                minXOnEmpty={minXOnEmpty}
                maxXOnEmpty={maxXOnEmpty}
            />
        )
    }
    if (toggleList.indexOf(selectedGraphToggle) === 1) {
        return(
            <SynchronizedCharts
                dataCharts={data} // Ensure dataMetric is relevant for Log Type
                height={300}
                width="100%"
                zoomInDisabled={zoomInDisabled}
                zoomOutDisabled={zoomOutDisabled}
                onZoomIn={onZoomIn}
                onZoomOut={onZoomOut}
                minXOnEmpty={minXOnEmpty}
                maxXOnEmpty={maxXOnEmpty}
            />
        )
    }
}
interface GraphicAnomalyCardProps {
    selectedLog: string;
    selectedTimeRangeKey: string;
    timeRanges: Record<string, number>;
    servicesOptions: string[];
}

const GraphAnomalyCard: React.FC<GraphicAnomalyCardProps> = ({
    selectedLog,
    selectedTimeRangeKey,
    timeRanges,
    servicesOptions,
}) => {
    const [dataColumn, setDataColumn] = useState<AnomalyOptionResponse>({columns: []})
    const [dataMetric, setDataMetric] = useState<MetricLogAnomalyResponse[]>([])
    const [currentZoomDateRange, setCurrentZoomDateRange] = useState<string>(selectedTimeRangeKey === '' ? 'Last 15 minutes': selectedTimeRangeKey)
    const [customTime, setCustomTime] = useState<{
        startTime: string;
        endTime: string;
    }>({ startTime: new Date().toString(), endTime: new Date().toString()})
    const [dateRangeMode, setDateRangeMode] = useState<"predefined" | "custom">("predefined")
    const [selectedFilter, setSelectedFilter] = useState<{scale: ColumnOption[], service: string}>({scale:[], service: ""})
    const [selectedGraphToggle, setSelectedGraphToggle] = useState(toggleList[0])
    const [initialLoading, setInitialLoading] = useState(true)

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

    // Cleanup function to abort fetch when the component unmounts
    useEffect(() => {
        GetColumnOption(selectedLog)
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

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    useUpdateEffect(() => {
        if (selectedFilter.scale.length <= 0 || selectedFilter.service.length <= 0) return
        fetchMetricLog(selectedLog, predefinedStartTime, predefinedEndTime, selectedFilter.service, selectedFilter.scale.map(scale => scale.name))
    }, [
        currentZoomDateRange,
    ])
    
    useUpdateEffect(() => {
        if (selectedFilter.scale.length <= 0 || selectedFilter.service.length <= 0) return
        fetchMetricLog(selectedLog, customTime.startTime, customTime.endTime, selectedFilter.service, selectedFilter.scale.map(scale => scale.name))
    }, [
        customTime,
    ])

    useUpdateEffect(() => {
        if (selectedFilter.scale.length <= 0 || selectedFilter.service.length <= 0) return

        if (dateRangeMode === "predefined") {
            fetchMetricLog(selectedLog, predefinedStartTime, predefinedEndTime, selectedFilter.service, selectedFilter.scale.map(scale => scale.name))
            return
        }
        if (dateRangeMode === "custom") {
            fetchMetricLog(selectedLog, customTime.startTime, customTime.endTime, selectedFilter.service, selectedFilter.scale.map(scale => scale.name))
            return
        }
    }, [
        selectedLog,
        selectedFilter,
    ])

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
        logType: string,
        startTime: string,
        endTime: string,
        serviceName: string,
        scales: string[],
    ) => {
        // Abort any ongoing fetch request before starting a new one
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
    
        // Create a new AbortController instance for the new fetch request
        const controller = new AbortController();
        abortControllerRef.current = controller;
    
        const metricResultPromise = GetMetricLogAnomalies({
            type: logType,
            start_time: startTime,
            end_time: endTime,
            service_name: serviceName,
            metric_name: scales,
        }, controller.signal)

        return metricResultPromise
            .then((metricResult) => {
                if (metricResult.data) {
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

    const handleGraphZoomIn = async (minX: any, maxX: any) => {
        if (dateRangeMode === "custom" && minX && maxX) {
            setCustomTime({
                startTime: minX,
                endTime: maxX,
            })
            return
        }

        // Do nothing if already at max zoomed in
        if (selectedKeyIndex <= 0) return
        
        // Select new range
        const newSelect = keys[selectedKeyIndex - 1];
        setCurrentZoomDateRange(newSelect)
    }
    const handleGraphZoomOut = async (minX: any, maxX: any) => {
        if (dateRangeMode === "custom" && minX && maxX) {
            setCustomTime({
                startTime: minX,
                endTime: maxX,
            })
            return
        }

        // Do nothing if already at max zoomed out
        if (selectedKeyIndex >= keys.length-1) return
        
        // Select new range
        const newSelect = keys[selectedKeyIndex + 1];
        setCurrentZoomDateRange(newSelect)
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
        <div className="flex flex-col gap-4">
            <Typography variant="h5" component="h5" color="white">
                Graphic Anomaly Records
            </Typography>
            <div className="flex gap-2 items-center">
                <FilterGraphAnomaly
                    currentSelectedScales={selectedFilter.scale}
                    currentSelectedService={selectedFilter.service}
                    scaleOptions={dataColumn.columns}
                    servicesOptions={servicesOptions}
                    onApplyFilters={handleOnApplyFilter}
                />
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
                    zoomInDisabled={selectedKeyIndex <= 0}
                    zoomOutDisabled={selectedKeyIndex >= keys.length-1}
                    onZoomIn={handleGraphZoomIn}
                    onZoomOut={handleGraphZoomOut}
                    minXOnEmpty={getMinX()}
                    maxXOnEmpty={getMaxX()}
                />
            </GraphWrapper>
        </div>
    )
}

export default GraphAnomalyCard