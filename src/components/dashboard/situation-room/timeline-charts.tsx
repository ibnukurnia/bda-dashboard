'use client';

import React, { useEffect, useState } from 'react';
import { ApexOptions } from 'apexcharts';

const DistributedTimelineChart: React.FC = () => {
    const [Chart, setChart] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const loadChart = async () => {
                const { default: ChartModule } = await import('react-apexcharts');
                setChart(() => ChartModule);
            };

            loadChart();
        }
    }, []);

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
            toolbar: {
                show: false,
            },
            parentHeightOffset: 0,
            offsetX: 20,
            offsetY: 20,
        },
        plotOptions: {
            bar: {
                horizontal: true,
                distributed: true,
                barHeight: '75%',
            },
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: '#FFFFFF',
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
            {Chart && (
                <Chart options={options} series={series} type="rangeBar" height={450} />
            )}
        </div>
    );
};

export default DistributedTimelineChart;
