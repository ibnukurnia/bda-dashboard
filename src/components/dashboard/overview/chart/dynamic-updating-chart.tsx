import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface DynamicUpdatingChartProps {
  series: any[]
  title?: string
  id?: string | number
}

const DynamicUpdatingChart = ({ series, title }: DynamicUpdatingChartProps) => {
  const options: ApexOptions = {
    // colors: ['#dc2626', '#dc2626'],
    // colors: (() => {
    //   if (title?.toLowerCase()?.includes('apm')) {
    //     return [
    //       series?.[0]?.data?.[0][1] > 0.0004 ? '#dc2626' : '#2E93fA',
    //       series?.[1]?.data?.[0][1] > 0.002 ? '#dc2626' : '#66DA26',
    //     ]
    //   } else if (title?.toLowerCase()?.includes('db')) {
    //     return [series?.[0]?.data?.[0][1] > 3 ? '#dc2626' : '#2E93fA']
    //   }
    // })(),
    chart: {
      // id: `chart-${id}`,
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
    title: {
      text: title,
      style: {
        color: 'white',
      },
    },
    subtitle: {
      text: title?.toLowerCase()?.includes('apm') ? 'Error rate' : 'Anomaly count',
      style: {
        color: 'white',
      },
    },
    tooltip: {
      enabled: true,
    },
    xaxis: {
      max: new Date().getTime(),
      // min: new Date().getTime() - 1000 * 60 * 30,
      min: new Date().getTime() - 1000 * 60 * 15,
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
      min: 0,
      max(max) {
        if (title?.toLowerCase()?.includes('apm')) {
          return max
        } else if (max >= 5) {
          return max + 1
        } else {
          return 5
        }
      },
      labels: {
        style: {
          colors: 'white', // White color for y-axis text
        },
        formatter: function (val) {
          return title?.toLowerCase()?.includes('apm') ? val.toFixed(4) : val.toFixed(0)
        },
      },
      // title: {
      //   text: title?.toLowerCase()?.includes('apm') ? 'Error rate' : 'Anomaly count',
      //   style: { color: '#ffffff' },
      // },
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
  }

  return (
    <Chart
      // key={`chart-${Math.random()}`}
      options={options}
      series={series.length > 1 ? series.sort((a, b) => a.name.localeCompare(b.name)) : (series as ApexAxisChartSeries)}
      type="line"
      height={300}
      width={'100%'}
      // data-chart-id={`chart${index + 1}`}
    />
  )
}

export default DynamicUpdatingChart
