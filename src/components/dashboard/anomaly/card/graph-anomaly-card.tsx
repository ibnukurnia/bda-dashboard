import { AnomalyOptionResponse, ClusterOptionResponse, MetricLogAnomalyResponse } from "@/modules/models/anomaly-predictions";
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
import useInterval from "@/hooks/use-interval";
import { NAMESPACE_LABELS } from "@/constants";

const initialFilter = {
    scale: [],
    cluster: [],
    service: null,
    network: null,
    interface: null,
    node: null,
    category: null,
    domain: null,
}

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
    selectedGraphToggle = toggleList[0],
    onZoomOut,
    minXOnEmpty,
    maxXOnEmpty,
    animations,
}: {
    data: MetricLogAnomalyResponse[];
    selectedGraphToggle: ToggleOption;
    onZoomOut: (minX: any, maxX: any) => void;
    minXOnEmpty?: number;
    maxXOnEmpty?: number;
    animations?: boolean;
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
                animations={animations}
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
                animations={animations}
            />
        )
    }
}
interface GraphicAnomalyCardProps {
    selectedDataSource: string;
    selectedTimeRangeKey: string;
    timeRanges: Record<string, number>;
    clusterOptions: ClusterOptionResponse[] | null | undefined;
    servicesOptions: string[] | null | undefined;
    networkOptions: string[] | null | undefined;
    nodeOptions: string[] | null | undefined;
    interfaceOptions: string[] | null | undefined;
    categoryOptions: string[] | null | undefined;
    domainOptions: string[] | null | undefined;
    deviceOptions: string[] | null | undefined;
    sensorOptions: string[] | null | undefined;
    isFullScreen: boolean;
    autoRefresh?: {
        enabled: boolean;
        interval: number | null;
    };
}

const GraphAnomalyCard: React.FC<GraphicAnomalyCardProps> = ({
    selectedDataSource,
    selectedTimeRangeKey,
    timeRanges,
    clusterOptions,
    servicesOptions,
    networkOptions,
    nodeOptions,
    interfaceOptions,
    categoryOptions,
    domainOptions,
    deviceOptions,
    sensorOptions,
    isFullScreen,
    autoRefresh = {
        enabled: false,
        interval: null,
    },

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
    const [selectedFilter, setSelectedFilter] = useState<{
        scale: ColumnOption[]
        cluster: ClusterOptionResponse[]
        service: string | null
        network: string | null
        interface: string | null
        node: string | null
        category: string | null
        domain: string | null
    }>(initialFilter)
    const [selectedGraphToggle, setSelectedGraphToggle] = useState(toggleList[0])
    const [initialLoading, setInitialLoading] = useState(true)

    const abortControllerRef = useRef<AbortController | null>(null); // Ref to store the AbortController

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
        setDataColumn({ columns: [] })
        setSelectedFilter(initialFilter)
        GetColumnOption(selectedDataSource)
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
    }, [selectedDataSource]);

    useUpdateEffect(() => {
        // Use selectedDataSource to determine which type is currently active
        fetchMetricLog(predefinedStartTime, predefinedEndTime);
    }, [currentZoomDateRange])

    useUpdateEffect(() => {
        fetchMetricLog(customTime.startTime, customTime.endTime)
    }, [customTime])

    useUpdateEffect(() => {
        if (dateRangeMode === "predefined") {
            fetchMetricLog(predefinedStartTime, predefinedEndTime)
            return
        }
        if (dateRangeMode === "custom") {
            fetchMetricLog(customTime.startTime, customTime.endTime)
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

    useInterval(
        () => fetchMetricLog(
            lastTimeRangeParam.startTime ?
                timeParamPlusInterval(lastTimeRangeParam.startTime) : predefinedStartTime,
            predefinedEndTime,
        ),
        autoRefresh.interval,
        autoRefresh.enabled
    )

    async function fetchMetricLog(
        startTime: string,
        endTime: string,
    ) {
        // Abort any ongoing fetch request before starting a new one
        if (abortControllerRef.current) {
            abortControllerRef.current.abort("Create new fetch request");
        }

        if (
            selectedFilter.scale.length === 0 ||
            (clusterOptions != null && selectedFilter.cluster.length === 0) ||
            (servicesOptions != null && selectedFilter.service == null) ||
            (networkOptions != null && selectedFilter.network == null) ||
            (interfaceOptions != null && selectedFilter.interface == null) ||
            (nodeOptions != null && selectedFilter.node == null) ||
            (categoryOptions != null && selectedFilter.category == null) ||
            (domainOptions != null && selectedFilter.domain == null)
        ) return

        // Create a new AbortController instance for the new fetch request
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const metricResultPromise = GetMetricLogAnomalies({
            type: selectedDataSource,
            start_time: startTime,
            end_time: endTime,
            metric_name: selectedFilter.scale.map(scale => scale.name),
            cluster: selectedFilter.cluster.map(cluster => cluster.name),
            service_name: selectedFilter.service,
            network: selectedFilter.network,
            interface: selectedFilter.interface,
            node: selectedFilter.node,
            category: selectedFilter.category,
            domain: selectedFilter.domain,
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
                    setDataMetric([])
                }
            })
            .catch((error) => {
                console.error('Error fetching metric anomalies:', error)
            })
            .finally(() => {
                setInitialLoading(false)
            })
    }

    const timeParamPlusInterval = (time: string) => {
        return format(new Date(time).setMilliseconds(autoRefresh.interval ?? 0), 'yyyy-MM-dd HH:mm:ss')
    }

    const handleGraphZoomOut = async (minX: any, maxX: any) => {
        if ((lastTimeRangeParam.startTime != null && lastTimeRangeParam.endTime != null) &&
            (isBefore(lastTimeRangeParam.startTime, minX) || isAfter(lastTimeRangeParam.endTime, maxX))) {
            return
        }

        fetchMetricLog(
            format(new Date(minX), 'yyyy-MM-dd HH:mm:ss'),
            format(new Date(maxX), 'yyyy-MM-dd HH:mm:ss'),
        )
    }

    const handleOnApplyFilter = (
        selectedScales: ColumnOption[],
        selectedCluster: ClusterOptionResponse[],
        selectedService: string | null,
        selectedNetwork: string | null,
        selectedInterface: string | null,
        selectedNode: string | null,
        selectedCategory: string | null,
        selectedDomain: string | null,
    ) => {
        setSelectedFilter({
            scale: selectedScales,
            cluster: selectedCluster,
            service: selectedService,
            network: selectedNetwork,
            interface: selectedInterface,
            node: selectedNode,
            category: selectedCategory,
            domain: selectedDomain,
        })
    }

    const handleSelectToggle = (value: ToggleOption) => {
        setSelectedGraphToggle(value)
    }

    return (
        <div className="flex flex-col gap-8">
            {!isFullScreen && <FilterGraphAnomaly
                currentSelectedScales={selectedFilter.scale}
                currentSelectedCluster={selectedFilter.cluster}
                currentSelectedService={selectedFilter.service}
                currentSelectedNetwork={selectedFilter.network}
                currentSelectedInterface={selectedFilter.interface}
                currentSelectedNode={selectedFilter.node}
                currentSelectedCategory={selectedFilter.category}
                currentSelectedDomain={selectedFilter.domain}
                scaleOptions={dataColumn.columns}
                clusterOptions={clusterOptions}
                servicesOptions={servicesOptions}
                networkOptions={networkOptions}
                nodeOptions={nodeOptions}
                interfaceOptions={interfaceOptions}
                categoryOptions={categoryOptions}
                domainOptions={domainOptions}
                deviceOptions={deviceOptions}
                sensorOptions={sensorOptions}
                onApplyFilters={handleOnApplyFilter}
            />}
            <div className='flex flex-col gap-2'>
                <Typography variant="h5" component="h5" color="white">
                    {`Graphic ${NAMESPACE_LABELS[selectedDataSource]} Anomaly Records`}
                </Typography>
            </div>
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
                isFieldRequired={
                    selectedFilter.scale.length === 0 ||
                    (clusterOptions != null && selectedFilter.cluster.length === 0) ||
                    (servicesOptions != null && selectedFilter.service == null)
                }
                isLoading={initialLoading}
                isEmpty={dataMetric.length === 0}
            >
                <Graph
                    data={dataMetric}
                    selectedGraphToggle={selectedGraphToggle}
                    onZoomOut={handleGraphZoomOut}
                    minXOnEmpty={getMinX()}
                    maxXOnEmpty={getMaxX()}
                    animations={!!!autoRefresh.enabled}
                />
            </GraphWrapper>
        </div>
    )
}

export default GraphAnomalyCard