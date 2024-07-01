// DistributedTimelineChart.tsx

import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

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
            height: 450,
            type: 'rangeBar',
            zoom: {
                enabled: false,
            },
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
        // colors: ['#ffffff'],
    };

    return (
        <div id="chart">
            {typeof window !== 'undefined' && (
                <Chart options={options} series={series} type="rangeBar" height={450} />
            )}
        </div>
    );
};

export default DistributedTimelineChart;
