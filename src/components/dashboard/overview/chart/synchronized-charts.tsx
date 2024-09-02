import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Typography } from '@mui/material';
import './synchronized-charts.css';
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
    zoomInDisabled?: boolean;
    onZoomIn?: (minX: any, maxX: any) => void;
    zoomOutDisabled?: boolean;
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
    zoomInDisabled,
    onZoomIn,
    zoomOutDisabled,
    onZoomOut,
    minX,
    maxX,
    minXOnEmpty,
    maxXOnEmpty,
}) => {
    const disableZoomButtons = () => {
        const zoomInButtons = document.querySelectorAll('.apexcharts-zoomin-icon');
        const zoomOutButtons = document.querySelectorAll('.apexcharts-zoomout-icon');
    
        zoomInButtons.forEach(button => {
            if (zoomInDisabled) {
                button.classList.add('zoom-disabled');
            } else {
                button.classList.remove('zoom-disabled');
            }
      });
      
      zoomOutButtons.forEach(button => {
            if (zoomOutDisabled) {
                button.classList.add('zoom-disabled');
            } else {
                button.classList.remove('zoom-disabled');
            }
        });
    }

    useEffect(() => {
        disableZoomButtons()
    }, [zoomInDisabled, zoomOutDisabled]);
  
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
                                zoomin: true,
                                zoomout: true,
                                zoom: false,
                                pan: false,
                                download: false,
                                reset: false,
                            }
                        },
                        events: {
                            mounted: (chartContext: any) => {
                                const chartEl = chartContext?.el;
                                if (!chartEl) {
                                    console.error('Chart element is null:', chartContext);
                                    return;
                                }
                                chartEl.addEventListener('chart:updated', () => {
                                    const syncedCharts = document.querySelectorAll('[data-chart-id]');
                                    syncedCharts.forEach((chart: any) => {
                                        if (chart?.dataset?.chartId !== chartContext.id && chart?.__apexCharts) {
                                            chart.__apexCharts.updateOptions({
                                                xaxis: {
                                                    min: chartContext.w.globals.minX,
                                                    max: chartContext.w.globals.maxX,
                                                },
                                            });
                                        }
                                    });
                                });
                            },
                            updated() {
                                disableZoomButtons()
                            },
                            beforeZoom : (chartContext, {xaxis}) => {
                                // Zoomed in
                                if (xaxis.min > chartContext.minX && xaxis.max < chartContext.maxX) {
                                    if (zoomInDisabled) {
                                        return {
                                            xaxis: {
                                                min: chartContext.minX,
                                                max: chartContext.maxX,
                                            }
                                        }
                                    }
                                    onZoomIn && onZoomIn(chartContext.minX, chartContext.maxX)
                                }
                                // Zoomed out
                                if (xaxis.min < chartContext.minX && xaxis.max > chartContext.maxX) {
                                    if (zoomOutDisabled) {
                                        return {
                                            xaxis: {
                                                min: minX && minX > chartContext.minX ? minX : chartContext.minX,
                                                max: maxX && maxX < chartContext.maxX ? maxX : chartContext.maxX,
                                            }
                                        }
                                    }
                                    onZoomOut && onZoomOut(chartContext.minX, chartContext.maxX)
                                }
                            },
                        },
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            formatter(value) {
                                const date = new Date(value);
                                return formatDate(date, "yyyy-MM-dd HH:mm")
                            },
                            style: {
                                colors: 'white',
                            },
                            rotate: 0,
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
                        tooltip: {
                            enabled: true,
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
                        colors: [colors[index % (colors.length)]], // This gives the remainder after all full loops.
                    },
                    markers: {
                        size: 0.0000001, // Workaround hover marker not showing because discrete options
                        hover: {
                            size: 6, // Size of the marker when hovered
                        },
                        discrete: dataCharts.flatMap((metric, index) => metric.anomalies.map(a =>(
                            {
                                seriesIndex: index, // Index of the series
                                dataPointIndex: metric.data.findIndex(d => d[0] === a[0]), // Index of the data point to display a marker
                                fillColor: '#FF0000', // Custom fill color for the specific marker
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
                    colors: [colors[index % (colors.length)]], // This gives the remainder after all full loops.
                };

                return (
                    <div key={metric.title}>
                        <Typography variant="h6" component="h6" color="white">
                            {metric.title}
                        </Typography>
                        <Chart
                            options={chartOptions}
                            series={[{
                                name: metric.title,
                                data: metric.data.map(([date, number]) => ({ x: date, y: number })),
                            }]}
                            type="line"
                            height={height}
                            width={width}
                            data-chart-id={`chart${index + 1}`}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default SynchronizedCharts;