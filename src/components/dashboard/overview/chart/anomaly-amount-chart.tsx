import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { format } from 'date-fns';
import { useState } from 'react';
import { AnomalyAmountResponse } from '@/modules/models/overviews';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface AnomalyAmountChartProps {
  data: AnomalyAmountResponse[] | null;
  startTime: string;
  endTime: string;
  onZoomOut: (newStartTime: string, newEndTime: string) => void;
  onZoomIn?: (newStartTime: string, newEndTime: string) => void;
}

const AnomalyAmountChart = ({
  data = [],
  startTime,
  endTime,
  onZoomOut,
  onZoomIn,
}: AnomalyAmountChartProps) => {
  // Ensure series is always treated as an array
  const validSeries = Array.isArray(data) ? data : [];

  // Ensure services with null data are included but with empty data arrays
  const chartSeries = validSeries
    .filter(s => Array.isArray(s.data) && s.data.length > 0)
    .map(s => ({
      name: s.service_name,
      data: s.data.map((d: any) => [new Date(d[0]).getTime(), d[1]]), // Convert date strings to timestamps
      anomalies: Array.isArray(s.anomalies) ? s.anomalies.map((a: any) => [new Date(a[0]).getTime(), a[1]]) : [] // Handle anomalies
    }));

  // Calculate the min and max timestamps from the data
  const allTimestamps = chartSeries.flatMap(s => s.data.map(d => d[0]));
  const minTimestamp = Math.min(...allTimestamps); // Midnight timestamp
  const maxTimestamp = Math.max(...allTimestamps); // Current time

  // Calculate default view (middle of 00:00 - current)
  const defaultViewMidpoint = (minTimestamp + maxTimestamp) / 2;
  const defaultViewRange = (maxTimestamp - minTimestamp) / 4; // Show 25% of the total range

  const [xaxisRange, setXaxisRange] = useState({
    min: defaultViewMidpoint - defaultViewRange / 2,
    max: defaultViewMidpoint + defaultViewRange / 2,
  });

  const options: ApexOptions = {
    chart: {
      group: 'overview',
      type: 'line',
      height: 300,
      toolbar: {
        show: true,
        tools: {
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: false,
          reset: true,
        },
        autoSelected: 'zoom',
      },
      zoom: {
        enabled: true,
        type: 'x',
        zoomedArea: {
          fill: {
            color: '#90CAF9',
            opacity: 0.4,
          },
          stroke: {
            color: '#0D47A1',
            opacity: 0.4,
            width: 1,
          },
        },
      },
      events: {
        updated(_, options) {
          const currentMin = options.globals.minX;
          const currentMax = options.globals.maxX;

          // Prevent zoom out beyond midnight (minTimestamp) and current time (maxTimestamp)
          if (currentMin < minTimestamp || currentMax > maxTimestamp) {
            setXaxisRange({
              min: Math.max(minTimestamp, currentMin),
              max: Math.min(maxTimestamp, currentMax),
            });
          }
        },
        beforeZoom: (chartContext, { xaxis }) => {
          const zoomedMin = Math.max(minTimestamp, xaxis.min);
          const zoomedMax = Math.min(maxTimestamp, xaxis.max);

          const oneMinute = 60000;
          if (zoomedMax - zoomedMin < oneMinute) {
            return {
              xaxis: {
                min: zoomedMin,
                max: zoomedMin + oneMinute,
              },
            };
          }

          if (zoomedMin < minTimestamp || zoomedMax > maxTimestamp) {
            return {
              xaxis: {
                min: Math.max(minTimestamp, zoomedMin),
                max: Math.min(maxTimestamp, zoomedMax),
              },
            };
          }

          if (onZoomIn && zoomedMax - zoomedMin > oneMinute) {
            onZoomIn(
              format(new Date(zoomedMin), 'yyyy-MM-dd HH:mm:ss'),
              format(new Date(zoomedMax), 'yyyy-MM-dd HH:mm:ss')
            );
          }

          return {
            xaxis: {
              min: zoomedMin,
              max: zoomedMax,
            },
          };
        },
      },
    },
    xaxis: {
      min: xaxisRange.min,
      max: xaxisRange.max,
      type: 'datetime',
      labels: {
        formatter(value) {
          const date = new Date(value);
          return format(date, 'yyyy-MM-dd HH:mm');
        },
        style: {
          colors: 'white',
        },
      },
      crosshairs: { show: true },
    },
    yaxis: {
      min: 0,
      labels: {
        style: {
          colors: 'white',
        },
        formatter: (value) => {
          const formatter = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });
          return formatter.format(value).replace('Rp', 'Rp.');
        },
      },
      tickAmount: 5,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    markers: {
      size: 0.0000001,
      hover: {
        size: 6,
      },
      discrete: chartSeries.flatMap((metric, index) =>
        metric.anomalies.map((anomaly) => {
          const dataPointIndex = metric.data.findIndex(d => d[0] === anomaly[0]);
          return {
            seriesIndex: index,
            dataPointIndex,
            fillColor: '#FF0000',
            strokeColor: '#FF0000',
            size: 6,
          };
        }).filter(marker => marker.dataPointIndex !== -1)
      ),
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
      show: true,
      labels: {
        colors: 'white',
      },
    },
  };


  return (
    <Chart
      options={options}
      series={chartSeries}
      type="line"
      height={300}
      width="100%"
    />
  );
};

export default AnomalyAmountChart;
