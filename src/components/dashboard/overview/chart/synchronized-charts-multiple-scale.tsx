import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import './synchronized-charts.css';
import { MetricLogAnomalyResponse } from '@/modules/models/anomaly-predictions';
import { formatDate } from 'date-fns';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const colors = [
    '#4E88FF', '#00D8FF', '#FF4EC7', '#00E396', '#F9C80E', '#8C54FF',
    '#FF4560', '#FF7D00', '#7DFF6B', '#FF6EC7', '#1B998B', '#B28DFF',
    '#FF6666', '#3DDC97', '#F4A261', '#89CFF0'
  ]

interface SynchronizedChartsMultipleScaleProps {
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

const SynchronizedChartsMultipleScale: React.FC<SynchronizedChartsMultipleScaleProps> = ({
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
    useEffect(() => {
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
    }, [zoomInDisabled, zoomOutDisabled]);
  
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
            // group: 'social',
            type: 'line',
            height: 160,
            toolbar: {
                tools: {
                    zoom: false,
                    pan: false,
                    download: false,
                    reset: false,
                }
            },
            events: {
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
                formatter(value, _, __) {
                    const date = new Date(value);
                    return formatDate(date, "yyyy-MM-dd HH:mm")
                },
                style: {
                    colors: 'white', // White color for x-axis text
                },
                rotate: 0,
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
            opposite: index !== 0 && index >= Math.ceil((dataCharts.length-1) / 2),
            labels: {
                style: {
                    colors: 'white', // White color for y-axis text
                },
                formatter: (value) => value % 1 !== 0 ? value.toFixed(2) : value.toString(),
            },
            seriesName: metric.title,
            tooltip: {
                enabled: true,
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

export default SynchronizedChartsMultipleScale;
