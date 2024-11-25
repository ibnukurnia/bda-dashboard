import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'
import { Fragment, useEffect, useRef, useState } from 'react'
import Skeleton from '@/components/system/Skeleton/Skeleton'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface Spike {
  title: string;
  value: string;
}

interface DynamicUpdatingChartProps {
  series: any[];
  title?: string;
  subtitle?: string;
  spikes: Spike[];  // spikes is an array of Spike objects
  id?: string | number;
  startTime: string;
  endTime: string;
}

const DynamicUpdatingChart = ({ series, title, subtitle, startTime, endTime, spikes }: DynamicUpdatingChartProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef(null);
  console.log(subtitle)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once the chart is loaded
        }
      },
      {
        root: null, // Uses the viewport as the default root
        rootMargin: '0px',
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => {
      if (chartRef.current) {
        observer.unobserve(chartRef.current);
      }
    };
  }, []);

  const options: ApexOptions = {
    chart: {
      group: 'overview',
      type: 'line',
      height: 120,
      animations: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    title: {
      text: title,
      style: {
        color: 'white',
      },
    },
    subtitle: {
      text: subtitle,
      style: {
        color: 'white',
      },
    },
    tooltip: {
      enabled: true,
      x: {
        formatter: (value) => {
          const date = new Date(value);
          return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // For 24-hour format
          });
        },
      },
    },
    xaxis: {
      min: new Date(startTime).getTime(),
      max: new Date(endTime).getTime(),
      type: 'datetime',
      labels: {
        formatter(value) {
          const date = new Date(value);
          return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
        },
        style: {
          colors: 'white',
        },
      },
      crosshairs: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: 'white',
        },
        formatter(val) {
          return title?.toLowerCase()?.includes('apm') ? val?.toFixed(4) : val?.toFixed(0);
        },
      },
      tickAmount: 5,
    },
    stroke: {
      curve: 'smooth',
      width: 1.5,
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
      show: false,
      labels: {
        colors: 'white',
      },
    },
  };

  return (
    <div ref={chartRef}>
      {isVisible ? (
        <Fragment>
          <Chart
            options={options}
            series={series.length > 1 ? series.sort((a, b) => a.name.localeCompare(b.name)) : (series as ApexAxisChartSeries)}
            type="line"
            height={350}
            width={'100%'}
          />
          {/* Loop through the spikes and render each spike's title and value */}
          <div className="text-white text-sm ml-3">
            {spikes.map((spike, index) => (
              <p key={index} className="mb-1"> {/* Add margin-bottom */}
                {spike.title}: {spike.value ?? '-'}
              </p>
            ))}
          </div>

        </Fragment>
      ) : (
        <div className={`chart-section-col flex flex-col gap-2`}>
          <Skeleton height={12} width={"75px"} />
          <Skeleton height={12} width={"75px"} />
          <Skeleton variant="rounded" width={"100%"} height={230} />
          <Skeleton height={20} width={"125px"} />
        </div>
      )}
    </div>
  );
};

export default DynamicUpdatingChart;
