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
]

interface SynchronizedChartsProps {
    dataCharts: MetricLogAnomalyResponse[];
    height: number;
    width: string;
    onZoomOut?: (minX: any, maxX: any) => void;
    minX?: any;
    maxX?: any;
    minXOnEmpty?: any;
    maxXOnEmpty?: any;
    animations?: boolean;
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
    animations,
}) => {
    const [zoomOutDisabled, setZoomOutDisabled] = useState(false)

    const toggleZoomOutButton = (disabled: boolean) => {
        const zoomOutButtons = document.querySelectorAll('.apexcharts-zoomout-icon');

        zoomOutButtons.forEach(button => {
            if (disabled) {
                button.classList.add('zoom-disabled');
            } else {
                button.classList.remove('zoom-disabled');
            }
        });
    }

    useEffect(() => {
        toggleZoomOutButton(zoomOutDisabled)
    }, [zoomOutDisabled]);

    console.log(dataCharts)

    useEffect(() => {
        setZoomOutDisabled(false)
    }, [dataCharts])

    if (!dataCharts || dataCharts.length === 0) {
        return (
            <div className="text-center text-2xl font-semibold text-white">
                DATA IS NOT AVAILABLE
            </div>
        )
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
                            enabled: animations,
                        },
                        toolbar: {
                            tools: {
                                pan: false,
                                download: false,
                            }
                        },
                        events: {
                            updated(_, options) {
                                if (minX >= options.globals.minX && maxX <= options.globals.maxX) {
                                    setZoomOutDisabled(true)
                                    toggleZoomOutButton(true)
                                } else {
                                    setZoomOutDisabled(false)
                                    toggleZoomOutButton(false)
                                }
                            },
                            beforeResetZoom() {
                              return {
                                xaxis: {
                                    min: minXOnEmpty,
                                    max: maxXOnEmpty,
                                  },
                              }
                            },
                            beforeZoom: (chartContext, { xaxis }) => {
                                if (xaxis.min < chartContext.minX && xaxis.max > chartContext.maxX) {
                                    if (!zoomOutDisabled) {
                                        onZoomOut && onZoomOut(
                                            minX >= xaxis.min ? minX : xaxis.min,
                                            maxX <= xaxis.max ? maxX : xaxis.max,
                                        )
                                    }

                                    if (minX >= xaxis.min && maxX <= xaxis.max) {
                                        setZoomOutDisabled(true)
                                        return {
                                            xaxis: {
                                                min: minX,
                                                max: maxX,
                                            }
                                        }
                                    } else {
                                        setZoomOutDisabled(false)
                                    }
                                    return {
                                        xaxis: {
                                            min: minX >= xaxis.min ? minX : xaxis.min,
                                            max: maxX <= xaxis.max ? maxX : xaxis.max,
                                        }
                                    }
                                }
                            },
                        },
                    },
                    tooltip: {
                        enabled: true, // Enable tooltips
                        shared: true, // Display the tooltip for all series at once
                        intersect: false, // Tooltip will appear for the closest point on hover, not just when you directly hover over the point
                        y: {
                            formatter: (value) => {
                                // Check if the Y-axis is for 'amount' and format as Rupiah
                                if (metric.title === "Amount (Rp) DC") {
                                    const rupiahFormatter = new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 2, // Always show at least 2 decimal places
                                    });
                                    return rupiahFormatter.format(value).replace("Rp", "Rp."); // Format as Rupiah and add dot after "Rp."
                                }

                                // If the value is less than 1, display the full decimal value without trimming it
                                if (value < 1 && value > 0) {
                                    return value.toString(); // Show the full precision of small decimal values
                                }

                                // For values 1000 or greater, format with thousands separators and 2 decimal places
                                const numberFormatter = new Intl.NumberFormat('en-US', {
                                    minimumFractionDigits: 2, // Ensure two decimal places
                                    maximumFractionDigits: 2, // Limit to two decimal places
                                });

                                return numberFormatter.format(value); // Format with commas and two decimal places
                            },
                        },
                        x: {
                            formatter: (value) => {
                                const date = new Date(value);
                                return formatDate(date, "yyyy-MM-dd HH:mm:ss")
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
                                return formatDate(date, "yyyy-MM-dd HH:mm").split(" ")
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
                        labels: {
                            style: {
                                colors: 'white',
                            },
                            formatter: (value) => {
                                // Check if the Y-axis is for 'amount' and format as Rupiah
                                if (metric.title === "Amount (Rp) DC") {
                                    // Format as Rupiah
                                    const rupiahFormatter = new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0, // Removes decimal places
                                    });
                                    return rupiahFormatter.format(value).replace("Rp", "Rp."); // Adding dot after "Rp."
                                }

                                // Handle small decimal numbers (less than 1 but greater than 0)
                                if (value < 1 && value > 0) {
                                    return value.toString(); // Show full precision for small decimal values
                                }

                                // Format larger numbers with thousands separators and two decimal places
                                const numberFormatter = new Intl.NumberFormat('en-US', {
                                    minimumFractionDigits: 2, // Show 2 decimal places
                                    maximumFractionDigits: 2, // Limit to 2 decimal places
                                });

                                return numberFormatter.format(value); // Format with thousands separators
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
