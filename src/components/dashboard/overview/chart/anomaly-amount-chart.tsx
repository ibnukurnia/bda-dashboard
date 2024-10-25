import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { format } from 'date-fns';
import { useEffect, useRef, useState, useCallback } from 'react';
import { AnomalyAmountResponse } from '@/modules/models/overviews';
import Skeleton from '@/components/system/Skeleton/Skeleton';

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
  onZoomOut,
  onZoomIn,
}: AnomalyAmountChartProps) => {
  const validSeries = Array.isArray(data) ? data : [];
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

  const maxYValue = Math.max(...chartSeries.flatMap(s => s.data.map(d => d[1])));

  const [xaxisRange, setXaxisRange] = useState({
    min: minTimestamp,
    max: maxTimestamp,
  });
  const [yaxisRange, setYaxisRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: maxYValue * 1.1,
  });
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef(null);

  const updateAxisRanges = useCallback((zoomedMin: number, zoomedMax: number) => {
    const selectedData = chartSeries.flatMap(s =>
      s.data.filter(([timestamp]) => timestamp >= zoomedMin && timestamp <= zoomedMax)
    );

    if (selectedData.length) {
      const selectedYValues = selectedData.map(([_, value]) => value);
      const minY = Math.min(...selectedYValues);
      const maxY = Math.max(...selectedYValues) * 1.1;

      const selectedXValues = selectedData.map(([timestamp]) => timestamp);
      const minX = Math.min(...selectedXValues);
      const maxX = Math.max(...selectedXValues);

      setYaxisRange({ min: minY, max: maxY });
      setXaxisRange({ min: minX, max: maxX });
    }
  }, [chartSeries]);

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
      toolbar: {
        tools: { zoom: true, zoomin: true, zoomout: true, reset: false, download: false },
        autoSelected: 'zoom',
      },
      zoom: {
        enabled: true,
        type: 'x',
        zoomedArea: {
          fill: { color: '#90CAF9', opacity: 0.4 },
          stroke: { color: '#0D47A1', opacity: 0.4, width: 1 },
        },
      },
      events: {
        updated(_, options) {
          const currentMin = options.globals.minX;
          const currentMax = options.globals.maxX;
          setXaxisRange({ min: Math.max(minTimestamp, currentMin), max: Math.min(maxTimestamp, currentMax) });
        },
        beforeZoom: (chartContext, { xaxis }) => {
          const zoomedMin = Math.max(minTimestamp, xaxis.min);
          const zoomedMax = Math.min(maxTimestamp, xaxis.max);

          updateAxisRanges(zoomedMin, zoomedMax);

          if (onZoomIn) {
            onZoomIn(
              format(new Date(zoomedMin), 'yyyy-MM-dd HH:mm:ss'),
              format(new Date(zoomedMax), 'yyyy-MM-dd HH:mm:ss')
            );
          }
          return { xaxis: { min: zoomedMin, max: zoomedMax } };
        },
      },
    },
    xaxis: {
      min: xaxisRange.min,
      max: xaxisRange.max,
      type: 'datetime',
      labels: {
        formatter(value) {
          return format(new Date(value), 'yyyy-MM-dd HH:mm');
        },
        style: { colors: 'white' },
      },
    },
    yaxis: {
      min: yaxisRange.min,
      max: yaxisRange.max,
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
