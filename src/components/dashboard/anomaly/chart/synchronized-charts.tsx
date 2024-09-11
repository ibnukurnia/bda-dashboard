import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Typography } from '@mui/material';
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

    return (
        <div className="flex flex-col gap-4">
            {dataCharts.map((metric, index) => {
                const chartOptions: ApexOptions = {
                    chart: {
                        id: `sync-${index}`,
                        group: 'log-anomaly',
                        type: 'line',
                        height: 160,
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
                            beforeZoom : (chartContext, {xaxis}) => {
                                // Zoomed out
                                if (xaxis.min < chartContext.minX && xaxis.max > chartContext.maxX) {
                                    if (!zoomOutDisabled) {
                                        onZoomOut && onZoomOut(xaxis.min, xaxis.max)
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
                                }
                            },
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
                        },
                        axisBorder: {
                          show: true, // Show the Y-axis line
                          color: 'white', // Customize the color of the Y-axis line if needed
                          width: 2, // Adjust the width of the Y-axis line
                        },
                    },
                    stroke: {
                        curve: 'smooth',
                        width: 4,
                        // colors: [colors[index % (colors.length)]], // This gives the remainder after all full loops.
                    },
                    markers: {
                        size: 0.0000001, // Workaround hover marker not showing because discrete options
                        hover: {
                            size: 6, // Size of the marker when hovered
                        },
                        discrete: metric.anomalies.map(a => ({
                            seriesIndex: 0, // Index of the series
                            dataPointIndex: metric.data.findIndex(d => d[0] === a[0]), // Index of the data point to display a marker
                            fillColor: '#FF0000', // Custom fill color for the specific marker
                            strokeColor: '#FF0000',
                            size: 4, // Custom size for the specific marker
                        }))
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
                    colors: [colors[index % (colors.length)]], // This gives the remainder after all full loops.
                };

                return (
                    <div key={metric.title}>
                        <Typography variant="h6" component="h6" color="white">
                            {metric.title}
                        </Typography>
                        <Chart
                            key={Math.random()} // Workaround synchronized tooltip bug
                            options={chartOptions}
                            series={[{
                                name: metric.title,
                                data: metric.data.map(([date, number]) => ({ x: date, y: number })),
                            }]}
                            type="line"
                            height={height}
                            width={width}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default SynchronizedCharts;
