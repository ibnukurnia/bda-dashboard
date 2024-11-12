import { AnomalyOptionResponse, ClusterOptionResponse, Identifier, MetricLogAnomalyResponse } from "@/modules/models/anomaly-predictions";
import { GetColumnOption, GetMetricLogAnomalies } from "@/modules/usecases/anomaly-predictions";
import { useEffect, useRef, useState } from "react";
import { Typography } from "@mui/material";
import { format, isAfter, isBefore } from "date-fns";
import { ColumnOption } from "@/types/anomaly";
import { NAMESPACE_LABELS } from '@/constants'
import useUpdateEffect from "@/hooks/use-update-effect";
import MultipleScaleChart from "../chart/multiple-scale-charts";
import FilterGraphAnomaly from "../button/filterGraphAnomaly";
import SynchronizedCharts from "../chart/synchronized-charts";
import Toggle, { ToggleOption } from "../button/toggle";
import useInterval from "@/hooks/use-interval";
import Skeleton from "@/components/system/Skeleton/Skeleton";
import DropdownTime from "../button/dropdown-time";
import { useSearchParams } from "next/navigation";

const initialFilter = {
    scale: [],
    identifiers: [],
}

const CUSTOM_TIME_RANGES: Record<string, number> = {
    'Last 5 minutes': 5,
    'Last 10 minutes': 10,
    'Last 15 minutes': 15,
    'Last 30 minutes': 30,
    'Last 1 hours': 60,
    'Last 3 hours': 180,
    'Last 6 hours': 360,
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
    minX,
    maxX,
}: {
    data: MetricLogAnomalyResponse[];
    selectedGraphToggle: ToggleOption;
    onZoomOut: (minX: any, maxX: any) => void;
    minXOnEmpty?: number;
    maxXOnEmpty?: number;
    minX?: number;
    maxX?: number;
    animations?: boolean;
}) => {

    if (toggleList.indexOf(selectedGraphToggle) === 0) {
        return (
            <MultipleScaleChart
                dataCharts={data}
                height={600}
                width="100%"
                onZoomOut={onZoomOut}
                minXOnEmpty={minXOnEmpty}
                maxXOnEmpty={maxXOnEmpty}
                minX={minX}
                maxX={maxX}
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
                minX={minX}
                maxX={maxX}

            />
        )
    }
}
interface GraphicAnomalyCardProps {
    selectedDataSource: string;
    datasourceIdentifiers: Identifier[];
    selectedTimeRangeKey: string;
    timeRanges: Record<string, number>;
    isFullScreen: boolean;
    autoRefresh?: {
        enabled: boolean;
        interval: number | null;
    };
}

const GraphAnomalyCard: React.FC<GraphicAnomalyCardProps> = ({
    selectedDataSource,
    datasourceIdentifiers,
    timeRanges,
    isFullScreen,
    autoRefresh = {
        enabled: false,
        interval: null,
    },
}) => {
    const searchParams = useSearchParams();
    const [datasourceIdentifiersMetricOnly, setDatasourceIdentifiersMetricOnly] = useState<Identifier[]>([])
    const [calledEffectOnParam, setCalledEffectOnParam] = useState(false)
    const [selectedTimeRangeKey, setSelectedTimeRangeKey] = useState<string>('Last 15 minutes');
    const [dataColumn, setDataColumn] = useState<AnomalyOptionResponse>({ columns: [] });
    const [isDataColumnLoading, setIsDataColumnLoading] = useState(true); // Loading state
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
        identifiers: (null | string | string[])[];
    }>(initialFilter);
    const [selectedGraphToggle, setSelectedGraphToggle] = useState(toggleList[0]);
    const [initialLoading, setInitialLoading] = useState(true);
    const abortControllerRef = useRef<AbortController | null>(null);
    // Determine the selected time range value in minutes
    const selectedTimeRange = timeRanges[selectedTimeRangeKey] ?? 15;
    // Set up predefined start and end time calculations
    const endDateObj = new Date();
    endDateObj.setSeconds(0, 0);

    const startDateObj = new Date(endDateObj.getTime() - selectedTimeRange * 60000);
    const predefinedStartTime = format(startDateObj, 'yyyy-MM-dd HH:mm:ss');
    const predefinedEndTime = format(endDateObj, 'yyyy-MM-dd HH:mm:ss');

    const minX = dateRangeMode === "predefined" ?
        (() => {
            const x = new Date()
            x.setHours(x.getHours() - 6)
            return x.getTime()
        })() : new Date(customTime.startTime).getTime()
    const maxX = dateRangeMode === "predefined" ? new Date().getTime() : new Date(customTime.endTime).getTime()

    const getMinXOnEmpty = () => {
        if (dateRangeMode === "predefined") {
            return new Date().getTime() - timeRanges[selectedTimeRangeKey] * 60 * 1000;
        }
        if (dateRangeMode === "custom") {
            return new Date(customTime.startTime).getTime();
        }
    };

    const getMaxXOnEmpty = () => {
        if (dateRangeMode === "predefined") {
            return new Date().getTime();
        }
        if (dateRangeMode === "custom") {
            return new Date(customTime.endTime).getTime();
        }
    };

    async function fetchMetricLog(startTime: string, endTime: string) {
        if (
            selectedFilter.scale.length === 0 ||
            datasourceIdentifiers.some((identifier, identifierIdx) =>
                selectedFilter.identifiers[identifierIdx] == null ||
                identifier.is_multiple && selectedFilter.identifiers[identifierIdx]?.length === 0
            )
        ) return

        if (abortControllerRef.current) {
            abortControllerRef.current.abort("Create new fetch request");
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        const payloadSelectedIdentifier = datasourceIdentifiers.reduce<Record<string, null | string | string[]>>((acc, identifier, idx) => {
            acc[identifier.key] = selectedFilter.identifiers[idx]
            return acc
        }, {})

        const metricResultPromise = GetMetricLogAnomalies(
            {
                type: selectedDataSource,
                start_time: startTime,
                end_time: endTime,
                metric_name: selectedFilter.scale.map((scale) => scale.name),
                ...payloadSelectedIdentifier,
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

    const timeParamPlusInterval = (time: string) => {
        return format(new Date(time).setMilliseconds(autoRefresh.interval ?? 0), 'yyyy-MM-dd HH:mm:ss');
    };

    const handleGraphZoomOut = async (minX: any, maxX: any) => {
        if (
            dateRangeMode === "custom" &&
            lastTimeRangeParam.startTime != null &&
            lastTimeRangeParam.endTime != null &&
            (isBefore(lastTimeRangeParam.startTime, minX) || isAfter(lastTimeRangeParam.endTime, maxX))
        ) {
            return;
        }

        fetchMetricLog(format(new Date(minX), 'yyyy-MM-dd HH:mm:ss'), format(new Date(maxX), 'yyyy-MM-dd HH:mm:ss'));
    };

    const handleOnApplyFilter = (
        selectedScales: ColumnOption[],
        selectedIdentifiers: (null | string | string[])[],
    ) => {
        setSelectedFilter({
            scale: selectedScales,
            identifiers: selectedIdentifiers,
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
        // setIsDataColumnLoading(true); // Start loading before fetch

        GetColumnOption(selectedDataSource)
            .then((result) => {
                if (result.data) {
                    setDataColumn({ columns: result.data.columns });
                } else {
                    console.warn('API response data is null or undefined for column option');
                }
            })
            .catch((error) => {
                console.error('Error fetching column option:', error);
            })
            .finally(() => {
                setIsDataColumnLoading(false); // End loading after fetch completes
            });
    }, [selectedDataSource]);

    useEffect(() => {
        setDatasourceIdentifiersMetricOnly(datasourceIdentifiers.filter(identifier => identifier.on_metric))
    }, [datasourceIdentifiers])

    useEffect(() => {
        if (
            calledEffectOnParam ||
            datasourceIdentifiersMetricOnly == null ||
            dataColumn?.columns == null || dataColumn?.columns?.length === 0
        ) return

        const scale = dataColumn.columns.filter(dc => searchParams.getAll("anomaly").includes(dc.name))
        const identifiers = datasourceIdentifiersMetricOnly.map(identifier =>
            identifier.is_multiple ? searchParams.getAll(identifier.key) : searchParams.get(identifier.key))

        if (
            scale.length !== 0 &&
            identifiers.every(identifier => identifier && identifier?.length > 0)
        ) {
            setSelectedFilter({
                scale: dataColumn.columns.filter(dc => searchParams.getAll("anomaly").includes(dc.name)),
                identifiers: datasourceIdentifiersMetricOnly.map(identifier =>
                    identifier.is_multiple ? searchParams.getAll(identifier.key) : searchParams.get(identifier.key))
            })
        }

        setCalledEffectOnParam(true)
    }, [searchParams, datasourceIdentifiersMetricOnly, dataColumn])

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
                        selectedDataSource={selectedDataSource}
                        datasourceIdentifiers={datasourceIdentifiersMetricOnly}
                        selectedTimeRange={selectedTimeRangeKey}
                        timeRanges={CUSTOM_TIME_RANGES}
                        currentSelectedScales={selectedFilter.scale}
                        currentSelectedIdentifiers={selectedFilter.identifiers}
                        scaleOptions={dataColumn.columns}
                        onApplyFilters={handleOnApplyFilter}
                    />
                )}


                <div className="flex flex-row gap-2 self-end items-center">
                    <DropdownTime
                        timeRanges={CUSTOM_TIME_RANGES}
                        onRangeChange={handleRangeChange}
                        selectedRange={selectedTimeRangeKey} // Updated to use state
                    />
                </div>

            </div>
            <div className='flex flex-col gap-2'>
                <Typography variant="h5" component="h5" color="white">
                    {`Graphic ${NAMESPACE_LABELS[selectedDataSource]} Anomaly Records`}
                </Typography>
            </div>
            <div className="flex gap-2 items-center">
                {selectedFilter.identifiers[datasourceIdentifiers.length - 1] &&
                    <Typography variant="subtitle1" color="white">
                        {datasourceIdentifiers[datasourceIdentifiers.length - 1].title}: {selectedFilter.identifiers[datasourceIdentifiers.length - 1]}
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
                    selectedFilter.scale.length === 0
                }
                isLoading={initialLoading}
                isEmpty={dataMetric.length === 0}
            >
                <Graph
                    data={dataMetric}
                    selectedGraphToggle={selectedGraphToggle}
                    onZoomOut={handleGraphZoomOut}
                    minXOnEmpty={getMinXOnEmpty()}
                    maxXOnEmpty={getMaxXOnEmpty()}
                    minX={minX}
                    maxX={maxX}
                    animations={!!!autoRefresh.enabled}
                />
            </GraphWrapper>
        </div>
    );
};


export default GraphAnomalyCard