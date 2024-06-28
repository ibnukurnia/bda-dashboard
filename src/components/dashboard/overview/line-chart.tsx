import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface LineChartProps {
    data: ChartData<'line'>;
    options?: ChartOptions<'line'>;
}

const LineChartComponent: React.FC<LineChartProps> = ({ data, options }) => {
    return <Line data={data} options={options} style={{ background: '#0A1635', borderRadius: "12px", width: '100%' }} />;
};

export default LineChartComponent;
