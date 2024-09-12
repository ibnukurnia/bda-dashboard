import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface DonutChartProps {
  series: number[]
  labels?: string[]
}

const DonutChart = ({ series, labels }: DonutChartProps) => {
  // const series = [0, 3, 2, 1]
  const options: ApexOptions = {
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: { show: true, color: 'white', fontSize: '12px' },
            value: { show: true, color: 'white', fontSize: '32px', fontWeight: 700 },
          },
          size: '80%',
        },
      },
    },
    fill: {
      colors: [
        ({ seriesIndex }: any) => {
          if (seriesIndex === 0) {
            return '#dc2626'
          } else if (seriesIndex === 1) {
            return '#ea580c'
          } else if (seriesIndex === 2) {
            return '#facc15'
          } else if (seriesIndex === 3) {
            return '#16a34a'
          }
        },
      ],
    },
    labels: labels,
    colors: [
      ({ seriesIndex }: any) => {
        if (seriesIndex === 0) {
          return '#dc2626'
        } else if (seriesIndex === 1) {
          return '#ea580c'
        } else if (seriesIndex === 2) {
          return '#facc15'
        } else if (seriesIndex === 3) {
          return '#16a34a'
        }
      },
    ],
    chart: {
      type: 'donut',
      height: 120,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    title: {
      // text: title,
      style: {
        color: 'white',
      },
    },
    tooltip: {
      enabled: true,
    },
    xaxis: {
      max: new Date().getTime(),
      min: new Date().getTime() - 1000 * 60 * 15,
      categories: '',
      tooltip: {
        enabled: false,
      },
      type: 'datetime',
      labels: {
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
      labels: {
        style: {
          colors: 'white', // White color for y-axis text
        },
      },
      tickAmount: 6,
    },
    stroke: {
      show: false,
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
    <div>
      <Chart type={options.chart?.type} height={300} width={'100%'} options={options} series={series} />
    </div>
  )
}

export default DonutChart
