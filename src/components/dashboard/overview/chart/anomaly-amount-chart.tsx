import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface AnomalyAmountChartProps {
  anomalies: any[]; // Array of anomalies (optional)
  series: { service_name: string; data: [string, number][] | null }[]; // Array of series with service name and data
  startTime: string; // Add startTime prop
  endTime: string; // Add endTime prop
}

const AnomalyAmountChart = ({ anomalies = [], series = [], startTime, endTime }: AnomalyAmountChartProps) => {
  // Ensure series is always treated as an array
  const validSeries = Array.isArray(series) ? series : [series];

  // Safeguard: Handle services that have null or empty data
  console.log('Series structure:', validSeries);

  const chartSeries = validSeries
    .filter(s => Array.isArray(s.data) && s.data.length > 0) // Only include services with valid data
    .map(s => ({
      name: s.service_name, // Name of the service for the legend
      data: s.data!.map(d => [new Date(d[0]).getTime(), d[1]]) // Convert date strings to timestamps
    }));

  // Debugging: Check the chart series being passed to ApexCharts
  console.log('Chart series being passed to ApexCharts:', chartSeries);

  const options: ApexOptions = {
    chart: {
      group: 'overview',
      type: 'line',
      height: 300,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    tooltip: {
      enabled: true,
    },
    xaxis: {
      min: new Date(startTime).getTime(),
      max: new Date(endTime).getTime(),
      type: 'datetime',
      labels: {
        formatter(value) {
          const date = new Date(value);
          return date.toLocaleString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }).split(', ');
        },
        style: {
          colors: 'white', // White color for x-axis text
        },
        rotate: 0,
        hideOverlappingLabels: true,
        trim: true,
      },
      crosshairs: { show: true },
      axisBorder: { show: false },
    },
    yaxis: {
      min: 0,
      labels: {
        style: {
          colors: 'white', // White color for y-axis text
        },
      },
      tickAmount: 5,
    },
    stroke: {
      curve: 'smooth',
      width: 2, // Ensure line width is visible
    },
    markers: {
      size: 0.0000001, // Workaround hover marker not showing because discrete options
      hover: {
        size: 6, // Size of the marker when hovered
      },
    },
    grid: {
      borderColor: '#bdbdbd',
      row: {
        colors: ['transparent', 'transparent'],
        opacity: 1,
      },
      column: {
        opacity: 0.5,
      },
    },
    legend: {
      show: true, // Enable legend for multiple series
      labels: {
        colors: 'white',
      },
    },
  };

  return (
    <Chart
      options={options}
      series={chartSeries} // Pass the converted series for all services
      type="line"
      height={300}
      width={'100%'}
    />
  );
};

export default AnomalyAmountChart;
