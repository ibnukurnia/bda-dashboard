import React from 'react';
import Chart from 'react-apexcharts'; // Importing directly since 'use client' is used

import { ApexOptions } from 'apexcharts';

const DistributedTimelineChart: React.FC = () => {
    const series = [
        {
            name: 'Joe',
            data: [
                {
                    x: 'Design',
                    y: [
                        new Date('2022-03-05T13:00:00').getTime(),
                        new Date('2022-03-05T14:30:00').getTime(),
                    ],
                },
                {
                    x: 'Code',
                    y: [
                        new Date('2022-03-05T14:30:00').getTime(),
                        new Date('2022-03-05T16:30:00').getTime(),
                    ],
                },
                {
                    x: 'Deployment',
                    y: [
                        new Date('2022-03-05T17:00:00').getTime(),
                        new Date('2022-03-05T19:00:00').getTime(),
                    ],
                },
            ],
        },
    ];

    const options: ApexOptions = {
        chart: {
            height: 450, // Adjust the height of the chart
            type: 'rangeBar',
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false, // Hide or show the toolbar as needed
            },
            parentHeightOffset: 0, // Adjust the parent container's height offset
            offsetX: 20, // Adjusts the left padding of the chart
            offsetY: 20, // Adjusts the top padding of the chart
        },
        plotOptions: {
            bar: {
                horizontal: true,
                distributed: true,
                barHeight: '75%',
                // colors: {
                //     ranges: [
                //         {
                //             from: new Date('2022-03-05T13:00:00').getTime(),
                //             to: new Date('2022-03-05T21:00:00').getTime(),
                //             color: '#ffffff',
                //         },
                //     ],
                // },
            },
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: '#FFFFFF', // Change this to your desired color
                    fontSize: '12px',
                },
                datetimeFormatter: {
                    hour: 'HH:mm',
                },
            },
        },
        yaxis: {
            show: false,
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
        },
        tooltip: {
            x: {
                format: 'HH:mm',
            },
        },
    };

    return (
        <div id="chart">
            <Chart options={options} series={series} type="rangeBar" height={450} />
        </div>
    );
};

export default DistributedTimelineChart;