import React, { useEffect, useState } from 'react';
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

    const toggleZoomOutButton = (disabled: boolean) => {
        const zoomOutButtons = document.querySelectorAll('.apexcharts-zoomout-icon');
        zoomOutButtons.forEach(button => {
            button.classList.toggle('zoom-disabled', disabled);
        });
    };

    useEffect(() => {
        console.log("Data Charts:", dataCharts);
    }, [dataCharts]);

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

    const discreteMarkers = dataCharts.map(metric =>
        metric.anomalies.map(a => ({
            seriesIndex: 0,
            dataPointIndex: metric.data.findIndex(d => d[0] === a[0]),
            fillColor: '#FF0000',
            strokeColor: '#FF0000',
            size: 4,
        }))
    );

    return (
        <div className="flex flex-col gap-4">
            {dataCharts.map((metric, index) => {
                const seriesData = metric.data.map(([date, number]) => ({
                    x: date || new Date().getTime(),
                    y: number,
                }));

                const chartOptions: ApexOptions = {
                    chart: {
                        id: `sync-${index}`, // Using static IDs for testing
                        // group: `log-anomaly`, // Temporarily removed to test marker rendering
                        type: 'line',
                        height: 160,
                        animations: { enabled: false },
                        toolbar: { tools: { pan: false, download: false } },
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
                                    xaxis: { min: minXOnEmpty, max: maxXOnEmpty },
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
                        x: {
                            formatter: (value) => formatDate(new Date(value), "yyyy-MM-dd HH:mm:ss"),
                        },
                    },
                    title: { text: metric.title, style: { color: 'white' } },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            formatter(value, _, __) {
                                const date = new Date(value);
                                return formatDate(date, "yyyy-MM-dd HH:mm").split(" ")
                            },
                            style: {
                                colors: 'white', // White color for x-axis text
                            },
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
                            formatter: (value: number) => {
                                // Check if the metric title or scale indicates it's "error rate"
                                if (metric.title.includes("Error Rate")) {
                                    const errorRateFormatter = new Intl.NumberFormat('id-ID', {
                                        minimumFractionDigits: 6, // Show 6 decimal places for error rate
                                        maximumFractionDigits: 6,
                                    });
                                    return errorRateFormatter.format(value); // Format with five decimal places
                                }
            
                                // Check if the metric title or scale indicates it's "amount"
                                if (metric.title.includes("Amount")) {
                                    const rupiahFormatter = new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 2, // Show 2 decimal places
                                        maximumFractionDigits: 2, // Limit to 2 decimal places
                                    });
                                    return rupiahFormatter.format(value).replace("Rp", "Rp."); // Add dot after "Rp."
                                }
            
                                // Handle small decimal numbers (less than 1 but greater than 0)
                                if (value < 1 && value > 0) {
                                    return value.toString(); // Show full precision for small decimal values
                                }
            
                                // Format larger numbers with thousands separators and two decimal places
                                const numberFormatter = new Intl.NumberFormat('id-ID', {
                                    minimumFractionDigits: 2, // Show 2 decimal places
                                    maximumFractionDigits: 2, // Limit to 2 decimal places
                                });
            
                                return numberFormatter.format(value); // Format with thousands separators
                            },
                            style: {
                                colors: 'white', // White color for axis text
                            },
                        },
                        axisBorder: { show: true, color: 'white', width: 2 },
                    },
                    stroke: { curve: 'smooth', width: 4 },
                    markers: {
                        size: 0.0000001, // Minimal size when not hovered
                        hover: {
                            size: 6, // Size of the marker when hovered
                        },
                        discrete: discreteMarkers[index],
                    },
                    grid: { row: { colors: ['transparent', 'transparent'], opacity: 1.5 }, padding: { top: -20 } },
                    legend: { labels: { colors: 'white' } },
                    colors: [colors[index % colors.length]],
                };

                // Log min and max values for x-axis
                console.log(`X-axis min for ${metric.title}:`, dataCharts.every(series => series.data.length <= 0) ? minXOnEmpty : minX);
                console.log(`X-axis max for ${metric.title}:`, dataCharts.every(series => series.data.length <= 0) ? maxXOnEmpty : maxX);

                const series = [{ name: metric.title, data: seriesData }];

                return (
                    <Chart
                        key={`chart-${Math.random()}-${index}`}
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
