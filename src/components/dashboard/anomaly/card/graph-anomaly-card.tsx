import { AnomalyOptionResponse, ClusterOptionResponse, MetricLogAnomalyResponse } from "@/modules/models/anomaly-predictions";
import { GetColumnOption, GetMetricLogAnomalies } from "@/modules/usecases/anomaly-predictions";
import { useEffect, useRef, useState } from "react";
import { Typography } from "@mui/material";
import { format, isAfter, isBefore } from "date-fns";
import { ColumnOption } from "@/types/anomaly";
import { NAMESPACE_LABELS, PREDEFINED_TIME_RANGES } from '@/constants'
import useUpdateEffect from "@/hooks/use-update-effect";
import MultipleScaleChart from "../chart/multiple-scale-charts";
import FilterGraphAnomaly from "../button/filterGraphAnomaly";
import SynchronizedCharts from "../chart/synchronized-charts";
import Toggle, { ToggleOption } from "../button/toggle";
import useInterval from "@/hooks/use-interval";
import Skeleton from "@/components/system/Skeleton/Skeleton";
import DropdownTime from "../button/dropdown-time";

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
    selectedGraphToggle = toggleList[0],
    scaleCount,
    isLoading,
    isEmpty,
    isFieldRequired,
}: {
    children: React.ReactNode;
    selectedGraphToggle: ToggleOption;
    scaleCount: number,
    isLoading?: boolean;
    isEmpty?: boolean;
    isFieldRequired?: boolean;

}) => {
    if (isFieldRequired) return (
        <Typography variant="subtitle1" color="white" align="center">
            Please select a filter to view the data.
        </Typography>
    )
    if (isLoading) {
        if (toggleList.indexOf(selectedGraphToggle) === 0) {
            return <Skeleton
                height={600}
            />
        }
        if (toggleList.indexOf(selectedGraphToggle) === 1) {
            return Array.from(Array(scaleCount), (_, i) => (
                <Skeleton
                    key={i}
                    width={300}
                />
            ))
        }
    }
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
    // Create local state for selectedTimeRangeKey instead of receiving it as a prop
    const [selectedTimeRangeKey, setSelectedTimeRangeKey] = useState<string>('Last 15 minutes');
    const [dataColumn, setDataColumn] = useState<AnomalyOptionResponse>({ columns: [] });
    const [dataMetric, setDataMetric] = useState<MetricLogAnomalyResponse[]>([]);
    const [lastTimeRangeParam, setLastTimeRangeParam] = useState<{ startTime: string | null; endTime: string | null }>({
        startTime: null,
        endTime: null,
    });
    const [currentZoomDateRange, setCurrentZoomDateRange] = useState<string>(selectedTimeRangeKey);
    const [customTime, setCustomTime] = useState<{ startTime: string; endTime: string }>({
        startTime: new Date().toString(),
        endTime: new Date().toString(),
    });
    const [dateRangeMode, setDateRangeMode] = useState<"predefined" | "custom">("predefined");
    const [selectedFilter, setSelectedFilter] = useState<{
        scale: ColumnOption[];
        cluster: ClusterOptionResponse[];
        service: string | null;
        network: string | null;
        interface: string | null;
        node: string | null;
        category: string | null;
        domain: string | null;
    }>(initialFilter);
    const [selectedGraphToggle, setSelectedGraphToggle] = useState(toggleList[0]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
    const [timeDifference, setTimeDifference] = useState<string>('Refreshed just now');
    const abortControllerRef = useRef<AbortController | null>(null);

    // Determine the selected time range value in minutes
    const selectedTimeRange = timeRanges[selectedTimeRangeKey] ?? 15;

    // Set up predefined start and end time calculations
    const endDateObj = new Date();
    endDateObj.setSeconds(0, 0);

    const startDateObj = new Date(endDateObj.getTime() - selectedTimeRange * 60000);
    const predefinedStartTime = format(startDateObj, 'yyyy-MM-dd HH:mm:ss');
    const predefinedEndTime = format(endDateObj, 'yyyy-MM-dd HH:mm:ss');

    const getMinX = () => {
        if (dateRangeMode === "predefined") {
            return new Date().getTime() - timeRanges[selectedTimeRangeKey] * 60 * 1000;
        }
        if (dateRangeMode === "custom") {
            return new Date(customTime.startTime).getTime();
        }
    };

    const getMaxX = () => {
        if (dateRangeMode === "predefined") {
            return new Date().getTime();
        }
        if (dateRangeMode === "custom") {
            return new Date(customTime.endTime).getTime();
        }
    };

    async function fetchMetricLog(startTime: string, endTime: string) {
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
        )
            return;

        const controller = new AbortController();
        abortControllerRef.current = controller;

        const metricResultPromise = GetMetricLogAnomalies(
            {
                type: selectedDataSource,
                start_time: startTime,
                end_time: endTime,
                metric_name: selectedFilter.scale.map((scale) => scale.name),
                cluster: selectedFilter.cluster.map((cluster) => cluster.name),
                service_name: selectedFilter.service,
                network: selectedFilter.network,
                interface: selectedFilter.interface,
                node: selectedFilter.node,
                category: selectedFilter.category,
                domain: selectedFilter.domain,
            },
            controller.signal
        );

        return metricResultPromise
            .then((metricResult) => {
                if (metricResult.data) {
                    setLastTimeRangeParam({
                        startTime: startTime,
                        endTime: endTime,
                    });
                    setDataMetric(metricResult.data);
                } else {
                    console.warn('API response data is null or undefined for metrics');
                    setDataMetric([]);
                }
            })
            .catch((error) => {
                console.error('Error fetching metric anomalies:', error);
            })
            .finally(() => {
                setInitialLoading(false);
            });
    }

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

    const timeParamPlusInterval = (time: string) => {
        return format(new Date(time).setMilliseconds(autoRefresh.interval ?? 0), 'yyyy-MM-dd HH:mm:ss');
    };

    const handleGraphZoomOut = async (minX: any, maxX: any) => {
        if (
            lastTimeRangeParam.startTime != null &&
            lastTimeRangeParam.endTime != null &&
            (isBefore(lastTimeRangeParam.startTime, minX) || isAfter(lastTimeRangeParam.endTime, maxX))
        ) {
            return;
        }

        fetchMetricLog(format(new Date(minX), 'yyyy-MM-dd HH:mm:ss'), format(new Date(maxX), 'yyyy-MM-dd HH:mm:ss'));
    };

    // Check if any filter option is selected
    const isFilterApplied = !!(
        selectedFilter.scale.length > 0 ||
        selectedFilter.cluster.length > 0 ||
        selectedFilter.service ||
        selectedFilter.network ||
        selectedFilter.interface ||
        selectedFilter.node ||
        selectedFilter.category ||
        selectedFilter.domain
    );



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

    const handleRangeChange = async (rangeKey: string) => {
        setSelectedTimeRangeKey(rangeKey); // Update local state instead of using a prop
    };

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    useEffect(() => {
        setDataColumn({ columns: [] });
        setSelectedFilter(initialFilter);
        GetColumnOption(selectedDataSource)
            .then((result) => {
                if (result.data) {
                    setDataColumn(result.data);
                } else {
                    console.warn('API response data is null or undefined for column option');
                }
            })
            .catch((error) => {
                console.error('Error fetching column option:', error);
            });
    }, [selectedDataSource]);

    useUpdateEffect(() => {
        fetchMetricLog(predefinedStartTime, predefinedEndTime);
    }, [currentZoomDateRange]);

    useUpdateEffect(() => {
        fetchMetricLog(customTime.startTime, customTime.endTime);
    }, [customTime]);

    useUpdateEffect(() => {
        if (dateRangeMode === "predefined") {
            fetchMetricLog(predefinedStartTime, predefinedEndTime);
        } else if (dateRangeMode === "custom") {
            fetchMetricLog(customTime.startTime, customTime.endTime);
        }
    }, [selectedFilter]);

    useUpdateEffect(() => {
        if (selectedTimeRangeKey.includes(' - ')) {
            const [start, end] = selectedTimeRangeKey.split(' - ');
            setDateRangeMode("custom");
            setCustomTime({
                startTime: start,
                endTime: end,
            });
        } else {
            setDateRangeMode("predefined");
            setCurrentZoomDateRange(selectedTimeRangeKey);
        }
    }, [selectedTimeRangeKey]);

    useInterval(
        () =>
            fetchMetricLog(
                lastTimeRangeParam.startTime ? timeParamPlusInterval(lastTimeRangeParam.startTime) : predefinedStartTime,
                predefinedEndTime,
            ),
        autoRefresh.interval,
        autoRefresh.enabled
    );


    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-row justify-between">
                {!isFullScreen && (
                    <FilterGraphAnomaly
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
                    />
                )}

                <div className="flex flex-row gap-2 self-end items-center">
                    {isFilterApplied && <Typography variant="body2" component="p" color="white">
                        {timeDifference}
                    </Typography>}
                    <DropdownTime
                        timeRanges={PREDEFINED_TIME_RANGES}
                        onRangeChange={handleRangeChange}
                        selectedRange={selectedTimeRangeKey} // Updated to use state
                        disabled={!isFilterApplied} // Disable if no filter is applied
                    />
                </div>

            </div>

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
                selectedGraphToggle={selectedGraphToggle}
                scaleCount={selectedFilter.scale.length}
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
    );
};


export default GraphAnomalyCard