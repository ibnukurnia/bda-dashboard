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

interface MultipleScaleChartProps {
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

const MultipleScaleChart: React.FC<MultipleScaleChartProps> = ({
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

    const combinedSeries: ApexAxisChartSeries = [];

    dataCharts.forEach((item) => {
        combinedSeries.push({
            name: `${item.title}`,
            data: item.data.map(([date, number]) => ({ x: date, y: number }))
        });
    });

    const chartOptions: ApexOptions = {
        chart: {
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
                beforeZoom: (chartContext, { xaxis }) => {
                    // Zoomed out
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
        yaxis: dataCharts.map((metric, index) => ({
            title: {
                text: metric.title,
                style: {
                    color: 'white', // White color for y-axis text
                },
            },
            opposite: index !== 0 && index >= Math.ceil((dataCharts.length - 1) / 2),
            labels: {
                formatter: (value: number) => {
                    // Check if metric.data is defined and has at least one element
                    if (!metric.data || metric.data.length === 0) {
                        // Return a default value or handle the empty case appropriately
                        return value.toFixed(0);
                    }

                    // Convert the number to a string
                    const valueString = metric.data[0][1].toString();

                    // Find the position of the decimal point
                    const decimalIndex = valueString.indexOf('.');

                    // If there is no decimal point, return the number without decimal places
                    if (decimalIndex === -1) {
                        return value.toFixed(0);
                    }

                    // Return the number of digits after the decimal point
                    return value.toFixed(valueString.length - decimalIndex - 1);
                },

                style: {
                    colors: 'white', // White color for y-axis text
                },
            },
            seriesName: metric.title,
            tooltip: {
                enabled: index === 0 || index === 1,
            },
            axisBorder: {
                show: true, // Show the Y-axis line
                color: colors[index % (colors.length)], // This gives the remainder after all full loops.
                width: 2, // Adjust the width of the Y-axis line
            },

        })),
        stroke: {
            curve: 'smooth',
            width: 4,
        },
        markers: {
            size: 0.0000001, // Workaround hover marker not showing because discrete options
            hover: {
                size: 6, // Size of the marker when hovered
            },
            discrete: dataCharts.flatMap((metric, index) => metric.anomalies.map(a => (
                {
                    seriesIndex: index, // Index of the series
                    dataPointIndex: metric.data.findIndex(d => d[0] === a[0]), // Index of the data point to display a marker
                    fillColor: '#FF0000', // Custom fill color for the specific marker
                    strokeColor: '#FF0000',
                    size: 6, // Custom size for the specific marker
                })
            ))
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'],
                opacity: 1.5,
            },
        },
        legend: {
            labels: {
                colors: 'white'
            }
        },
        colors: colors,
    };

    return (
        <div className="flex flex-col gap-4">
            <Chart
                options={chartOptions}
                series={combinedSeries}
                type="line"
                height={height}
                width={width}
            />
        </div>
    );
};

export default MultipleScaleChart;
