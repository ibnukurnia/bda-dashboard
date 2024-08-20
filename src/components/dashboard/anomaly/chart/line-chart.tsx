import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

// Importing Chart component dynamically with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface LineChartProps {
    series: {
        name: string;
        data: number[];
    }[];
    categories: string[];
    height?: number;
    width?: string | number;
    lineColors?: string[];
    yAxisMin?: number;
    yAxisMax?: number;
}

const LineChart: React.FC<LineChartProps> = ({
    series,
    categories,
    height = 350,
    width = '100%',
    lineColors = ['#7CB9E8'],
    yAxisMin = 0,
    yAxisMax = 160
}) => {
    const options: ApexOptions = {
        chart: {
            type: 'line',
            zoom: {
                enabled: false,
            },
        },
        xaxis: {
            categories,
            labels: {
                style: {
                    colors: '#FFFFFF',
                },
            },
        },
        yaxis: {
            min: yAxisMin,
            max: yAxisMax,
            tickAmount: (yAxisMax - yAxisMin) / 10, // Automatically calculates the number of ticks
            labels: {
                style: {
                    colors: '#FFFFFF',
                },
                formatter: (value) => `${value}`, // Customize label format if needed
            },
        },
        stroke: {
            curve: 'straight',
        },
        colors: lineColors,
        grid: {
            row: {
                colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5,
            },
        },
    };

    return (
        <div id="chart" className="p-4">
            {/* Removed title rendering */}
            {typeof window !== 'undefined' && (
                <Chart options={options} series={series} type="line" height={height} width={width} />
            )}
        </div>
    );
};

export default LineChart;
