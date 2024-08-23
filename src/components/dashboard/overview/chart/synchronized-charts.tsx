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
            ],
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
    return (
        <div className="flex flex-col gap-4">
            {dataCharts && dataCharts.map((metric, index) => {
                const chartOptions: ApexOptions = {
                    chart: {
                        id: `sync-${index}`,
                        group: 'social',
                        type: 'line',
                        height: 160,
                        events: {
                            mounted: (chartContext: any) => {
                                const chartEl = chartContext.el;
                                chartEl.addEventListener('chart:updated', () => {
                                    const syncedCharts = document.querySelectorAll('[data-chart-id]');
                                    syncedCharts.forEach((chart: any) => {
                                        if (chart.dataset.chartId !== chartContext.id) {
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
                        },
                    },
                    xaxis: {
                        type: 'datetime',
                        labels: {
                            formatter(value, _, __) {
                                const date = new Date(value);
                                return date.toLocaleDateString(
                                    'id-ID',
                                    { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }
                                )
                            },
                            style: {
                                colors: 'white', // White color for x-axis text
                            },
                        },
                    },
                    yaxis: {
                        labels: {
                            style: {
                                colors: 'white', // White color for y-axis text
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
                    }
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
