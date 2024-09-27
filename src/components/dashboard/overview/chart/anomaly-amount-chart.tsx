import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface AnomalyAmountChartProps {
  anomalies: any[],
  series: any[],
  startTime: string // Add startTime prop
  endTime: string // Add endTime prop
}

const AnomalyAmountChart = ({ anomalies, series, startTime, endTime }: AnomalyAmountChartProps) => {
  const options: ApexOptions = {
    chart: {
      group: 'overview',
      type: 'line',
      height: 120,
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
      // Set min and max based on user-selected start and end time
      min: new Date(startTime).getTime(),
      max: new Date(endTime).getTime(),
      type: 'datetime',
      labels: {
        formatter(value) {
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
      width: 1.5,
    },
    markers: {
        size: 0.0000001, // Workaround hover marker not showing because discrete options
        hover: {
            size: 6, // Size of the marker when hovered
        },
        discrete: anomalies.map(a => ({
            seriesIndex: 0, // Index of the series
            dataPointIndex: series.findIndex(d => d[0] === a[0]), // Index of the data point to display a marker
            fillColor: '#FF0000', // Custom fill color for the specific marker
            strokeColor: '#FF0000',
            size: 4, // Custom size for the specific marker
        }))
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
      series={series}
      type="line"
      height={300}
      width={'100%'}
    />
  )
}

export default AnomalyAmountChart
