import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { formatRupiah } from '@/helper';
import { AnomalyAmountResponse } from '@/modules/models/overviews';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface AnomalyAmountChartProps {
  data: AnomalyAmountResponse[] | null; // Array of series with service name and data
  startTime: string; // Add startTime prop
  endTime: string; // Add endTime prop
}

const AnomalyAmountChart = ({ data = [], startTime, endTime }: AnomalyAmountChartProps) => {
  // Ensure series is always treated as an array
  const validSeries = Array.isArray(data) ? data : [];

  // Ensure services with null data are included but with empty data arrays
  const chartSeries = validSeries
    .filter(s => Array.isArray(s.data) && s.data.length > 0) // Only include services with valid data
    .map(s => ({
      name: s.service_name, // Name of the service for the legend
      data: s.data.map((d: any) => [new Date(d[0]).getTime(), d[1]]) // Convert date strings to timestamps if data exists
    }));

  // Calculate the min and max timestamps from the data
  const allTimestamps = chartSeries.flatMap(s => s.data.map(d => d[0])); // Extract all timestamps
  const minTimestamp = Math.min(...allTimestamps);
  const maxTimestamp = Math.max(...allTimestamps);

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
      min: minTimestamp, // Use min timestamp from the data
      max: maxTimestamp, // Use max timestamp from the data
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
        formatter: (value) => formatRupiah(value), // Reuse the formatRupiah function here
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

  // Conditionally render the chart or the "Data not available" message
  return (
    <>
      {chartSeries.length > 0 ? (
        <Chart
          options={options}
          series={chartSeries} // Pass the converted series for all services
          type="line"
          height={300}
          width={'100%'}
        />
      ) : (
        <p className="text-center text-gray-500">Data is not available at the selected time</p>
      )}
    </>
  );
};

export default AnomalyAmountChart;
