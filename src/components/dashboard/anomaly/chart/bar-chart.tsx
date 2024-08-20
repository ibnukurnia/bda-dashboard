import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
// import { ApexCharts } from 'react-apexcharts';

// Dynamically import Chart component to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface BarChartProps {
    series: {
        data: number[];
    }[];
    height?: number;
    width?: string | number;
    categories: string[]; // Add categories prop
}


const BarChart: React.FC<BarChartProps> = ({
    series,
    height = 350,
    width = '100%',
    categories, // Destructure categories prop
}) => {
    const options: ApexOptions = {
        chart: {
            type: 'bar',
            height: 350,
        },
        plotOptions: {
            bar: {
                borderRadius: 5,
                borderRadiusApplication: 'end',
                horizontal: true,
            },
        },
        fill: {
            colors: ['#034694'], // Set bar color here
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: categories, // Use the categories prop here
            labels: {
                style: {
                    colors: '#FFFFFF', // Color of the x-axis labels
                    fontSize: '14px', // Font size of the x-axis labels
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#FFFFFF', // Color of the x-axis labels
                    fontSize: '14px', // Font size of the x-axis labels
                }
            },
        },
        grid: {
            row: {
                colors: ['white'],
                opacity: 0.8,
            },
        },
    };

    return (
        <div style={{ width }}>
            {typeof window !== 'undefined' && (
                <Chart options={options} series={series} type="bar" height={height} width={width} />
            )}
        </div>
    );
};


export default BarChart;
