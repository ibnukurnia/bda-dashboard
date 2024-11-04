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
            if (disabled) {
                button.classList.add('zoom-disabled');
            } else {
                button.classList.remove('zoom-disabled');
            }
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
                const chartOptions: ApexOptions = {
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
                            zoomedArea: {
                                fill: { color: '#90CAF9', opacity: 0.4 },
                                stroke: { color: '#0D47A1', opacity: 0.4, width: 1 },
                            },
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
                                        return {
                                            xaxis: {
                                                min: minX,
                                                max: maxX,
                                            },
                                        };
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
                                if (metric.title === "Error Rate DC || Error Rate ODC") {
                                    const errorRateFormatter = new Intl.NumberFormat('en-US', {
                                        minimumFractionDigits: 6,
                                        maximumFractionDigits: 6,
                                    });
                                    return errorRateFormatter.format(value);
                                }
                                if (metric.title === "Amount (Rp) DC") {
                                    const rupiahFormatter = new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 2,
                                    });
                                    return rupiahFormatter.format(value).replace("Rp", "Rp.");
                                }
                                if (value < 1 && value > 0) {
                                    return value.toString();
                                }
                                const numberFormatter = new Intl.NumberFormat('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                });

                                return numberFormatter.format(value);
                            },
                        },

                        x: {
                            formatter: (value) => {
                                const date = new Date(value);
                                return formatDate(date, "yyyy-MM-dd HH:mm:ss");
                            },
                        },
                    },
                    title: {
                        text: metric.title,
                        style: {
                            color: 'white',
                        },
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            formatter(value) {
                                const date = new Date(value);
                                return formatDate(date, "yyyy-MM-dd HH:mm").split(" ");
                            },
                            style: {
                                colors: 'white',
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
                            style: {
                                colors: 'white',
                            },
                            formatter: (value) => {
                                if (metric.title === "Error Rate DC || Error Rate ODC") {
                                    const errorRateFormatter = new Intl.NumberFormat('en-US', {
                                        minimumFractionDigits: 6,
                                        maximumFractionDigits: 6,
                                    });
                                    return errorRateFormatter.format(value);
                                }
                                if (metric.title === "Amount (Rp) DC") {
                                    const rupiahFormatter = new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                    });
                                    return rupiahFormatter.format(value).replace("Rp", "Rp.");
                                }
                                if (value < 1 && value > 0) {
                                    return value.toString();
                                }
                                const numberFormatter = new Intl.NumberFormat('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                });

                                return numberFormatter.format(value);
                            },
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
                        hover: {
                            size: 6,
                        },
                        discrete: metric.anomalies.map(a => ({
                            seriesIndex: 0,
                            dataPointIndex: metric.data.findIndex(d => d[0] === a[0]),
                            fillColor: '#FF0000',
                            strokeColor: '#FF0000',
                            size: 4,
                        }))
                    },
                    grid: {
                        row: {
                            colors: ['transparent', 'transparent'],
                            opacity: 1.5,
                        },
                        padding: {
                            top: -20
                        }
                    },
                    legend: {
                        labels: {
                            colors: 'white'
                        }
                    },
                    colors: [colors[index % (colors.length)]],
                };

                return (
                    <Chart
                        key={Math.random()}
                        options={chartOptions}
                        series={[{
                            name: metric.title,
                            data: metric.data.map(([date, number]) => ({
                                x: date,
                                y: number
                            })),
                        }]}
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
