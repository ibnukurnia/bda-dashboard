import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { AnomalyAmountResponse } from '@/modules/models/overviews';
import Skeleton from '@/components/system/Skeleton/Skeleton';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface AnomalyAmountChartProps {
  data: AnomalyAmountResponse[] | null;
}

const AnomalyAmountChart = ({
  data = [],
}: AnomalyAmountChartProps) => {
  const validSeries = Array.isArray(data) ? data : [];

  // Check if all `data` fields in the objects are null
  const allDataNull = validSeries.every(s => s.data === null);

  const chartSeries = validSeries
    .filter(s => Array.isArray(s.data) && s.data.length > 0)
    .map(s => ({
      name: s.service_name,
      data: s.data.map((d: any) => [new Date(d[0]).getTime(), d[1]]),
      anomalies: Array.isArray(s.anomalies) ? s.anomalies.map((a: any) => [new Date(a[0]).getTime(), a[1]]) : [],
    }));

  const allTimestamps = chartSeries.flatMap(s => s.data.map(d => d[0]));
  const minTimestamp = Math.min(...allTimestamps);
  const maxTimestamp = Math.max(...allTimestamps);

  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });
    if (chartRef.current) observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, []);

  const options: ApexOptions = {
    chart: {
      type: 'line',
      height: 400,
      animations: {
        enabled: false,
      },
      toolbar: {
        tools: { pan: false, download: false },
        autoSelected: 'zoom',
      },
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true,
        zoomedArea: {
          fill: { color: '#90CAF9', opacity: 0.4 },
          stroke: { color: '#0D47A1', opacity: 0.4, width: 1 },
        },
      },
      events: {
        beforeZoom: (_, { xaxis }) => {
          const zoomedMin = Math.max(minTimestamp, xaxis.min);
          const zoomedMax = Math.min(maxTimestamp, xaxis.max);

          return { xaxis: { min: zoomedMin, max: zoomedMax } };
        },
      },
    },
    xaxis: {
      min: minTimestamp,
      max: maxTimestamp,
      type: 'datetime',
      labels: {
        formatter(value) {
          return format(new Date(value), 'yyyy-MM-dd HH:mm');
        },
        style: { colors: 'white' },
      },
    },
    yaxis: {
      min: 0,
      labels: {
        style: { colors: 'white' },
        formatter: (value) => {
          const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });
          return formatter.format(value).replace('Rp', 'Rp.');
        },
      },
    },
    stroke: { curve: 'smooth', width: 2 },
    markers: {
      size: 0.0000001,
      hover: { size: 6 },
      discrete: chartSeries.flatMap((metric, index) =>
        metric.anomalies.map((anomaly) => {
          const dataPointIndex = metric.data.findIndex(d => d[0] === anomaly[0]);
          return { seriesIndex: index, dataPointIndex, fillColor: '#FF0000', strokeColor: '#FF0000', size: 6 };
        }).filter(marker => marker.dataPointIndex !== -1)
      ),
    },
    grid: { borderColor: '#bdbdbd' },
    legend: { show: true, labels: { colors: 'white' } },
  };

  if (allDataNull || chartSeries.length === 0) {
    return <p className="text-center text-white">No data available.</p>;
  }

  return (
    <div ref={chartRef}>
      {isVisible ? (
        <Chart options={options} series={chartSeries} type="line" height={400} width="100%" />
      ) : (
        <Skeleton height={400} />
      )}
    </div>
  );
};

export default AnomalyAmountChart;
