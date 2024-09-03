import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface DynamicUpdatingChartProps {
  series: any[]
  title?: string
}

const DynamicUpdatingChart = ({ series, title }: DynamicUpdatingChartProps) => {
  const options: ApexOptions = {
    chart: {
      type: 'line',
      height: 120,
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
      text: 'Dynamic Updating Chart',
      style: {
        color: 'white',
      },
    },
    tooltip: {
      enabled: true,
    },
    xaxis: {
      categories: '',
      tooltip: {
        enabled: false,
      },
      type: 'datetime',
      labels: {
        formatter(value, _, __) {
          const date = new Date(value)
          const formattedDate = date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
          return formattedDate.split(', ')
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
      min(min) {
        if (min > 0) {
          return min - 1
        }
        return min
      },
      max(max) {
        return max + 1
      },
      labels: {
        style: {
          colors: 'white', // White color for y-axis text
        },
      },
    },
    stroke: {
      curve: 'smooth',
      width: 1,
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
  }

  return (
    <Chart
      options={options}
      series={series as ApexAxisChartSeries}
      type="line"
      height={300}
      // data-chart-id={`chart${index + 1}`}
    />
  )
}

export default DynamicUpdatingChart
