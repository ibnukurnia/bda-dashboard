import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { formatRupiah } from '@/helper';
import { AnomalyAmountResponse } from '@/modules/models/overviews';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface AnomalyAmountChartProps {
  data: AnomalyAmountResponse[] | null;
  startTime: string;
  endTime: string;
  onZoomOut: (newStartTime: string, newEndTime: string) => void; // Add the zoom-out handler
}

const AnomalyAmountChart = ({ data = [], startTime, endTime, onZoomOut }: AnomalyAmountChartProps) => {
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
        show: true, // Enable the toolbar for zoom in/out/reset controls
        tools: {
          zoom: false,
          zoomin: true,
          zoomout: true,
          pan: false,
          reset: false, // Allows reset zoom functionality
          download: false,
        },
        autoSelected: 'zoom', // Set zoom as the default selected tool
      },
      zoom: {
        enabled: true, // Enable zooming
        type: 'x', // Ensure zoom is only applied to x-axis
        zoomedArea: {
          fill: {
            color: '#90CAF9', // Color of the zoomed area
            opacity: 0.4,
          },
          stroke: {
            color: '#0D47A1', // Border color of the zoomed area
            opacity: 0.4,
            width: 1,
          },
        },
      },
      events: {
        // Disable zoom out if zoom is within min-max range
        updated(_, options) {
          if (minTimestamp >= options.globals.minX && maxTimestamp <= options.globals.maxX) {
            console.log('Zoom is at the limit.');
            // Disable zoom out button logic here
          } else {
            console.log('Zoom is active.');
            // Enable zoom out button logic here
          }
        },
        beforeZoom: (chartContext, { xaxis }) => {
          const newMin = Math.max(minTimestamp, xaxis.min);
          const newMax = Math.min(maxTimestamp, xaxis.max);

          if (newMin === minTimestamp && newMax === maxTimestamp) {
            // Disable zoom out button
            console.log('Cannot zoom out further.');
          }

          return {
            xaxis: {
              min: newMin,
              max: newMax,
            },
          };
        },
        zoomed: (chartContext, { xaxis }) => {
          const zoomedMin = new Date(xaxis.min).toISOString();
          const zoomedMax = new Date(xaxis.max).toISOString();

          if (xaxis.min < minTimestamp || xaxis.max > maxTimestamp) {
            console.log('Zoom out detected, refetching data for the extended range.');
            onZoomOut(zoomedMin, zoomedMax); // Call the onZoomOut handler to refetch data
          }
        },
      },
    },
    tooltip: {
      enabled: true,
    },
    xaxis: {
      min: minTimestamp, // Minimum timestamp to set the lower zoom limit
      max: maxTimestamp, // Maximum timestamp to set the upper zoom limit
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
