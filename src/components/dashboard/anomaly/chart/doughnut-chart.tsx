import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
    data: ChartData<'doughnut'>;
    options?: ChartOptions<'doughnut'>;
}

const DoughnutChartComponent: React.FC<DoughnutChartProps> = ({ data, options }) => {
    return <Doughnut data={data} options={options} style={{ background: '#0A1635', borderRadius: "12px", width: '100%' }} />;
};

export default DoughnutChartComponent;
