import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface DynamicUpdatingChartProps {
  series: any[]
  title?: string
  spike: string
  id?: string | number
  startTime: string // Add startTime prop
  endTime: string // Add endTime prop
}

const DynamicUpdatingChart = ({ series, title, startTime, endTime, spike }: DynamicUpdatingChartProps) => {
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
      text: title?.toLowerCase()?.includes('apm') ? 'error rate' : 'anomaly count',
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
            second: '2-digit', // Add seconds to the tooltip display
            hour12: false, // For 24-hour format, set to true for 12-hour AM/PM format
          });
        },
      },

    },


    xaxis: {
      // Set min and max based on user-selected start and end time
      min: new Date(startTime).getTime(),
      max: new Date(endTime).getTime(),
      type: 'datetime',
      labels: {
        formatter(value) {
          const date = new Date(value);
          const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // For 24-hour format, set to true for 12-hour AM/PM format
          });
          return formattedTime;
        },
        style: {
          colors: 'white', // White color for x-axis text
        },
        rotate: 0,
        hideOverlappingLabels: true,
        trim: true,
      },
      crosshairs: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      min: 0,
      max(max) {
        if (title?.toLowerCase()?.includes('apm')) {
          return max;
        } else if (max >= 5) {
          return max + 1;
        } else {
          return 5;
        }
      },
      labels: {
        style: {
          colors: 'white', // White color for y-axis text
        },
        formatter(val) {
          return title?.toLowerCase()?.includes('apm') ? val.toFixed(4) : val.toFixed(0);
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
    <>

      <Chart
        options={options}
        series={series.length > 1 ? series.sort((a, b) => a.name.localeCompare(b.name)) : (series as ApexAxisChartSeries)}
        type="line"
        height={350}
        width={'100%'}
      />
      <p className="text-white text-sm ml-3">
        Last Spike: {spike ? spike : '-'}
      </p>


    </>


  )
}

export default DynamicUpdatingChart
