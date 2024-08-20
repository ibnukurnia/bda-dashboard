import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface SynchronizedChartsProps {
    seriesNew: {
        name: string;
        data: number[][];
    }[];
    categories: string[];
    height: number;
    width: string;
    title: string;
    lineColors: string[];
    yAxisMin: number;
    yAxisMax: number;
}

const SynchronizedCharts: React.FC<SynchronizedChartsProps> = ({
    seriesNew,
    categories,
    height,
    width,
    title,
    lineColors,
    yAxisMin,
    yAxisMax
}) => {
    const chartOptions: ApexOptions = {
        chart: {
            id: 'sync',
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
                                        max: chartContext.w.globals.maxX
                                    }
                                });
                            }
                        });
                    });
                }
            }
        },
        xaxis: {
            type: 'datetime',
            categories: categories,
            labels: {
                style: {
                    colors: 'white', // White color for x-axis text
                }
            }
        },
        yaxis: {
            min: yAxisMin,
            max: yAxisMax,
            labels: {
                style: {
                    colors: 'white', // White color for y-axis text
                },
            },
        },
        stroke: {
            curve: 'straight'
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'],
                opacity: 1.5
            }
        }
    };

    return (
        <div className='flex flex-col gap-4'>
            {seriesNew.map((series, index) => (
                <div key={index}>
                    <Chart
                        options={{ ...chartOptions, colors: [lineColors[index % lineColors.length]] }}
                        series={[series]}
                        type="line"
                        height={height}
                        width={width}
                        data-chart-id={`chart${index + 1}`}
                    />
                </div>
            ))}
        </div>
    );
};

export default SynchronizedCharts;
