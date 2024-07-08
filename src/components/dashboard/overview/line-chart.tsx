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
    title: string;
    lineColor?: string;
    yAxisMin?: number;
    yAxisMax?: number;
}

const LineChart: React.FC<LineChartProps> = ({ series, categories, height = 350, width = '100%', title, lineColor = '#FF5733', yAxisMin = 0, yAxisMax = 160 }) => {
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
            labels: {
                style: {
                    colors: '#FFFFFF',
                },
                formatter: (value) => `${value} GB`,
            },
        },
        stroke: {
            curve: 'straight',
        },
        colors: [lineColor],
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5,
            },
        },
    };

    const renderTitle = () => {
        const titleParts = title.split(' - ');
        return (
            <div className="title-container mb-4">
                <span className="text-white">{titleParts[0]} - {titleParts[1]}</span> - <span className="text-blue-500">{titleParts[2]}</span> - <span className="text-yellow-500">{titleParts[3]}</span>
            </div>
        );
    };

    return (
        <div id="chart" className="p-4">
            <div className="chart-title mb-4">
                {renderTitle()}
            </div>
            {typeof window !== 'undefined' && (
                <Chart options={options} series={series} type="line" height={height} width={width} />
            )}
        </div>
    );
};

export default LineChart;
