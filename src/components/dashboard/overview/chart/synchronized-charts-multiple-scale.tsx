import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import './synchronized-charts.css';
import { MetricLogAnomalyResponse } from '@/modules/models/anomaly-predictions';
import { formatDate } from 'date-fns';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

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
                        if (!zoomInDisabled) {
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
                        if (!zoomOutDisabled) {
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
        },
        yaxis: dataCharts.map((metric, index) => ({
            title: {
                text: metric.title,
                style: {
                    color: 'white', // White color for y-axis text
                },
            },
            opposite: index >= Math.ceil((dataCharts.length-1) / 2),
            labels: {
                style: {
                    colors: 'white', // White color for y-axis text
                },
                formatter: (value) => value.toFixed(2)
            },
            seriesName: metric.title,
            tooltip: {
                enabled: true,
            },
            axisBorder: {
              show: true, // Show the Y-axis line
              color: 'white', // Customize the color of the Y-axis line if needed
              width: 1, // Adjust the width of the Y-axis line
            },
        })),
        stroke: {
            curve: 'smooth',
            width: 4,
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
