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
    const [dataMetric, setDataMetric] = useState<MetricLogAnomalyResponse[]>([])
    const [currentZoomDateRange, setCurrentZoomDateRange] = useState<string>(selectedTimeRangeKey === '' ? 'Last 15 minutes': selectedTimeRangeKey)
    const [selectedScales, setSelectedScales] = useState<ColumnOption[]>([]);
    const [selectedService, setSelectedService] = useState<string>('');

    // Get the keys of the object as an array
    const keys = Object.keys(timeRanges);
    // Find the index of the key
    const selectedKeyIndex = keys.indexOf(currentZoomDateRange);

    useEffect(() => {
        const selectedTimeRange = timeRanges[currentZoomDateRange] ?? 15
        const metricResultPromise = GetMetricLogAnomalies(selectedLog, selectedTimeRange, selectedService, selectedScales.map(scale => scale.name))

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
    }, [
        selectedLog,
        currentZoomDateRange,
        selectedService,
    ])

    useUpdateEffect(() => {
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
        // Get the keys of the object as an array
        const keys = Object.keys(timeRanges);
        // Find the index of the key
        const selectedKeyIndex = keys.indexOf(currentZoomDateRange);

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
                {selectedScales.length > 0 || selectedService.length > 0 &&
                    <Typography variant="subtitle1" color="white">
                        Service name: {selectedService}
                    </Typography>
                }
            </div>
            {/* {dataMetric.length === 0 &&
                <div className="flex justify-center items-center">
                    <div className="spinner"></div>
                </div>
            } */}
            {selectedScales.length <= 0 || selectedService.length <= 0 ?
                <Typography variant="subtitle1" color="white" align="center">
                    DATA IS NOT AVAILABLE. PLEASE USE FILTER BUTTON TO FETCH DATA
                </Typography>
                : <>
                    <SynchronizedChartsMultipleScale
                        dataCharts={dummyDataMetric.data as MetricLogAnomalyResponse[]}
                        height={600}
                        width="100%"
                        />
                    <SynchronizedCharts
                        dataCharts={dummyDataMetric.data as MetricLogAnomalyResponse[]} // Ensure dataMetric is relevant for Log Type
                        height={300}
                        width="100%"
                        zoomInDisabled={selectedKeyIndex <= 0}
                        zoomOutDisabled={selectedKeyIndex >= keys.length-1}
                        onZoomIn={handleGraphZoomIn}
                        onZoomOut={handleGraphZoomOut}
                        minXOnEmpty={new Date().getTime() - timeRanges[currentZoomDateRange] * 60 * 1000}
                        maxXOnEmpty={new Date().getTime()}
                    />
                </>
            }
        </div>
    )
}

export default GraphAnomalyCard