import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import './custom-chart-styles.css';
import { MetricLogAnomalyResponse } from '@/modules/models/anomaly-predictions';
import { formatDate } from 'date-fns';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const colors = [
    '#4E88FF', '#00D8FF', '#FF4EC7', '#00E396', '#F9C80E', '#8C54FF',
    '#FF4560', '#FF7D00', '#7DFF6B', '#FF6EC7', '#1B998B', '#B28DFF',
    '#FF6666', '#3DDC97', '#F4A261', '#89CFF0'
];

interface SynchronizedChartsProps {
    dataCharts: MetricLogAnomalyResponse[];
    height: number;
    width: string;
    onZoomOut?: (minX: any, maxX: any) => void;
    minX?: any;
    maxX?: any;
    minXOnEmpty?: any;
    maxXOnEmpty?: any;
}

const SynchronizedCharts: React.FC<SynchronizedChartsProps> = ({
    dataCharts,
    height,
    width,
    onZoomOut,
    minX,
    maxX,
    minXOnEmpty,
    maxXOnEmpty,
}) => {
    const [zoomOutDisabled, setZoomOutDisabled] = useState(false);

    useEffect(() => {
        console.log("Data Charts:", dataCharts);
    }, [dataCharts]);

    const toggleZoomOutButton = (disabled: boolean) => {
        const zoomOutButtons = document.querySelectorAll('.apexcharts-zoomout-icon');
        zoomOutButtons.forEach(button => {
            button.classList.toggle('zoom-disabled', disabled);
        });
    };

    useEffect(() => {
        toggleZoomOutButton(zoomOutDisabled);
    }, [zoomOutDisabled]);

    useEffect(() => {
        setZoomOutDisabled(false);
    }, [dataCharts]);

    if (!dataCharts || dataCharts.length === 0) {
        return (
            <div className="text-center text-2xl font-semibold text-white">
                DATA IS NOT AVAILABLE
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {dataCharts.map((metric, index) => {
                console.log(`Metric ${index}: Title: ${metric.title}, Color: ${colors[index % colors.length]}`);

                // Use useMemo to memorize the options and series per chart
                const chartOptions: ApexOptions = useMemo(() => ({
                    chart: {
                        id: `sync-${index}`,
                        group: 'log-anomaly',
                        type: 'line',
                        height: 160,
                        animations: {
                            enabled: false,
                        },
                        toolbar: {
                            tools: {
                                pan: false,
                                download: false,
                            },
                        },
                        zoom: {
                            enabled: true,
                            type: 'x',
                            autoScaleYaxis: true,
                        },
                        events: {
                            updated(_, options) {
                                if (minX >= options.globals.minX && maxX <= options.globals.maxX) {
                                    setZoomOutDisabled(true);
                                    toggleZoomOutButton(true);
                                } else {
                                    setZoomOutDisabled(false);
                                    toggleZoomOutButton(false);
                                }
                            },
                            beforeResetZoom() {
                                return {
                                    xaxis: {
                                        min: minXOnEmpty,
                                        max: maxXOnEmpty,
                                    },
                                };
                            },
                            beforeZoom: (chartContext, { xaxis }) => {
                                console.log("Zoom selected range:", { min: xaxis.min, max: xaxis.max });
                                if (xaxis.min < chartContext.minX && xaxis.max > chartContext.maxX) {
                                    if (!zoomOutDisabled) {
                                        onZoomOut && onZoomOut(
                                            minX >= xaxis.min ? minX : xaxis.min,
                                            maxX <= xaxis.max ? maxX : xaxis.max,
                                        );
                                    }

                                    if (minX >= xaxis.min && maxX <= xaxis.max) {
                                        setZoomOutDisabled(true);
                                        return { xaxis: { min: minX, max: maxX } };
                                    } else {
                                        setZoomOutDisabled(false);
                                    }
                                    return {
                                        xaxis: {
                                            min: minX >= xaxis.min ? minX : xaxis.min,
                                            max: maxX <= xaxis.max ? maxX : xaxis.max,
                                        },
                                    };
                                }
                            },
                        },
                    },
                    tooltip: {
                        enabled: true,
                        shared: true,
                        intersect: false,
                        y: {
                            formatter: (value) => {
                                const formatter = new Intl.NumberFormat('en-US', {
                                    minimumFractionDigits: metric.title.includes("Error Rate") ? 6 : 2,
                                    maximumFractionDigits: metric.title.includes("Error Rate") ? 6 : 2,
                                });
                                return formatter.format(value);
                            },
                        },
                        x: {
                            formatter: (value) => formatDate(new Date(value), "yyyy-MM-dd HH:mm:ss"),
                        },
                    },
                    title: {
                        text: metric.title,
                        style: { color: 'white' },
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            style: { colors: 'white' },
                            rotate: 0,
                            hideOverlappingLabels: true,
                            trim: true,
                        },
                        min: dataCharts.every(series => series.data.length <= 0) ? minXOnEmpty : undefined,
                        max: dataCharts.every(series => series.data.length <= 0) ? maxXOnEmpty : undefined,
                    },
                    yaxis: {
                        min: 0,
                        labels: {
                            style: { colors: 'white' },
                        },
                        axisBorder: {
                            show: true,
                            color: 'white',
                            width: 2,
                        },
                    },
                    stroke: {
                        curve: 'smooth',
                        width: 4,
                    },
                    markers: {
                        size: 0.0000001,
                        hover: { size: 6 },
                    },
                    grid: {
                        row: {
                            colors: ['transparent', 'transparent'],
                            opacity: 1.5,
                        },
                        padding: { top: -20 },
                    },
                    legend: { labels: { colors: 'white' } },
                    colors: [colors[index % colors.length]], // Ensure unique color per chart
                }), [index, metric.title]); // Depend on index and title to avoid repeated color

                // Use unique key for series to ensure ApexCharts recognizes unique series data
                const series = useMemo(() => [{
                    name: metric.title,
                    data: metric.data.map(([date, number]) => ({ x: date, y: number })),
                }], [metric.title, metric.data]);

                return (
                    <Chart
                        key={`chart-${index}`} // Unique key per chart
                        options={chartOptions}
                        series={series}
                        type="line"
                        height={height}
                        width={width}
                    />
                );
            })}
        </div>
    );
};

export default SynchronizedCharts;
