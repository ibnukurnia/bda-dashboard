import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Typography } from '@mui/material';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface SynchronizedChartsProps {
    dataCharts: {
        title: string,
        series: {
            name: string
            data: [
                Date,
                number,
            ][],
        }[]
    }[];
    height: number;
    width: string;
}

const SynchronizedCharts: React.FC<SynchronizedChartsProps> = ({
    dataCharts,
    height,
    width,
}) => {
    if (!dataCharts || dataCharts.length === 0) {
        return (
            <div className="text-center text-2xl font-semibold text-white">
                DATA IS NOT AVAILABLE
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {dataCharts && dataCharts.map((metric, index) => {
                const { minDate, maxDate } = dataCharts[index].series.reduce(
                    (acc, seriesItem) => {
                        const seriesData = seriesItem.data;
                        if (seriesData.length === 0) return acc

                        const firstDate = new Date(seriesData[0][0])
                        const lastDate = new Date(seriesData[seriesData.length - 1][0])

                        // Update min and max dates in the accumulator
                        if (firstDate.getTime() < acc.minDate.getTime()) acc.minDate = firstDate;
                        if (lastDate.getTime() > acc.maxDate.getTime()) acc.maxDate = lastDate;

                        return acc;
                    },
                    { minDate: new Date('9999-12-31'), maxDate: new Date('1970-01-01') } // Initial accumulator values
                );

                const chartOptions: ApexOptions = {
                    chart: {
                        id: `sync-${index}`,
                        group: 'social',
                        type: 'line',
                        height: 160,
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
                            beforeZoom: (e, { xaxis }) => {
                                // Adjust the zoom range if it goes beyond the limits
                                if (xaxis.min < minDate) {
                                    xaxis.min = minDate;
                                }
                                if (xaxis.max > maxDate) {
                                    xaxis.max = maxDate;
                                }

                                return {
                                    xaxis: {
                                        min: xaxis.min,
                                        max: xaxis.max,
                                    },
                                };
                            },
                        },
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            formatter(value) {
                                const date = new Date(value);
                                return date.toLocaleDateString(
                                    'id-ID',
                                    { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }
                                );
                            },
                            style: {
                                colors: 'white',
                            },
                            rotate: 0,
                        },
                        tooltip: {
                            enabled: false,
                        },
                    },
                    yaxis: {
                        labels: {
                            style: {
                                colors: 'white',
                            },
                        },
                    },
                    stroke: {
                        curve: 'smooth',
                        width: 1,
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
                    <div key={index}>
                        <Typography variant="h6" component="h6" color="white">
                            {metric.title}
                        </Typography>
                        <Chart
                            options={chartOptions}
                            series={metric.series as ApexAxisChartSeries}
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
