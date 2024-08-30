import { MetricLogAnomalyResponse } from "@/modules/models/anomaly-predictions";
import { GetMetricLogAnomalies } from "@/modules/usecases/anomaly-predictions";
import { useEffect, useState } from "react";
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
    minXOnEmpty: number;
    maxXOnEmpty: number;
}) => {
    if (toggleList.indexOf(selectedGraphToggle) === 0) {
        return(
            <SynchronizedChartsMultipleScale
                dataCharts={data}
                height={600}
                width="100%"
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
    customTime: {
        startTime: string;
        endTime: string;
    }
    servicesOptions: string[];
}

const GraphAnomalyCard: React.FC<GraphicAnomalyCardProps> = ({
    selectedLog,
    selectedTimeRangeKey,
    timeRanges,
    customTime,
    servicesOptions,
}) => {
    const [dataMetric, setDataMetric] = useState<MetricLogAnomalyResponse[]>([])
    const [currentZoomDateRange, setCurrentZoomDateRange] = useState<string>(selectedTimeRangeKey === '' ? 'Last 15 minutes': selectedTimeRangeKey)
    const [selectedScales, setSelectedScales] = useState<ColumnOption[]>([]);
    const [selectedService, setSelectedService] = useState<string>('');
    const [selectedGraphToggle, setSelectedGraphToggle] = useState(toggleList[0])
    const [isLoading, setIsLoading] = useState(false)

    // Get the keys of the object as an array
    const keys = Object.keys(timeRanges);
    // Find the index of the key
    const selectedKeyIndex = keys.indexOf(currentZoomDateRange);

    useEffect(() => {
        if (selectedScales.length <= 0 || selectedService.length <= 0) return

        setIsLoading(true)
        const selectedTimeRange = timeRanges[currentZoomDateRange] ?? 15

        // Calculate endDate as the current time, rounding down the seconds to 00
        const endDateObj = new Date();
        endDateObj.setSeconds(0, 0); // Set seconds and milliseconds to 00

        // Calculate startDate by subtracting the selected time range (in minutes) from the endDate
        const startDateObj = new Date(endDateObj.getTime() - selectedTimeRange * 60000); // 60000 ms = 1 minute

        // Convert startDate and endDate to strings
        const predefinedStartTime = format(startDateObj, 'yyyy-MM-dd HH:mm:ss');
        const predefinedEndTime = format(endDateObj, 'yyyy-MM-dd HH:mm:ss');

        const metricResultPromise = GetMetricLogAnomalies(selectedLog, predefinedStartTime, predefinedEndTime, selectedService, selectedScales.map(scale => scale.name))

        metricResultPromise
            .then((metricResult) => {
                if (metricResult.data) {
                    setDataMetric(metricResult.data)
                } else {
                    console.warn('API response data is null or undefined for metrics')
                }
                setIsLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching metric anomalies:', error)
                setIsLoading(false)
            })
    }, [
        selectedLog,
        currentZoomDateRange,
        selectedService,
    ])
    
    useUpdateEffect(() => {
        if (selectedScales.length <= 0 || selectedService.length <= 0) return

        setIsLoading(true)
        const metricResultPromise = GetMetricLogAnomalies(selectedLog, customTime.startTime, customTime.endTime, selectedService, selectedScales.map(scale => scale.name))

        metricResultPromise
            .then((metricResult) => {
                if (metricResult.data) {
                    setDataMetric(metricResult.data)
                } else {
                    console.warn('API response data is null or undefined for metrics')
                }
                setIsLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching metric anomalies:', error)
                setIsLoading(false)
            })
    }, [
        customTime
    ])
    useUpdateEffect(() => {
        // Skip if custom range
        if (selectedTimeRangeKey.includes(' - ')) return

        setCurrentZoomDateRange(selectedTimeRangeKey)
    }, [selectedTimeRangeKey])

    const handleGraphZoomIn = async () => {
        // Do nothing if already at max zoomed in
        if (selectedKeyIndex <= 0) return
        
        // Select new range
        const newSelect = keys[selectedKeyIndex - 1];
        setCurrentZoomDateRange(newSelect)
    }
    const handleGraphZoomOut = async () => {
        // Do nothing if already at max zoomed out
        if (selectedKeyIndex >= keys.length-1) return
        
        // Select new range
        const newSelect = keys[selectedKeyIndex + 1];
        setCurrentZoomDateRange(newSelect)
    }

    const handleOnApplyFilter = (selectedScales: ColumnOption[], selectedService: string) => {
        setSelectedScales(selectedScales)
        setSelectedService(selectedService)
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
                    currentSelectedScales={selectedScales}
                    currentSelectedService={selectedService}
                    scaleOptions={dummyScalesOption.data.columns}
                    servicesOptions={servicesOptions}
                    onApplyFilters={handleOnApplyFilter}
                />
                {selectedService &&
                    <Typography variant="subtitle1" color="white">
                        Service name: {selectedService}
                    </Typography>
                }
                {/* {dataMetric.length !== 0 && */}
                {selectedService &&
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
                isFieldRequired={selectedScales.length <= 0 || selectedService.length <= 0}
                // isLoading={isLoading}
                // isEmpty={dataMetric.length === 0}
            >
                <Graph
                    data={dummyDataMetric.data as MetricLogAnomalyResponse[]}
                    selectedGraphToggle={selectedGraphToggle}
                    zoomInDisabled={selectedKeyIndex <= 0}
                    zoomOutDisabled={selectedKeyIndex >= keys.length-1}
                    onZoomIn={handleGraphZoomIn}
                    onZoomOut={handleGraphZoomOut}
                    minXOnEmpty={new Date().getTime() - timeRanges[currentZoomDateRange] * 60 * 1000}
                    maxXOnEmpty={new Date().getTime()}
                />
            </GraphWrapper>
        </div>
    )
}

export default GraphAnomalyCard