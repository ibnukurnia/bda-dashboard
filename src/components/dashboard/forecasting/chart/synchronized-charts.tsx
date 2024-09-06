import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Typography } from '@mui/material'
import { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface SynchronizedChartsProps {
  chartTitle?: string
  dataCharts: {
    title: string
    data: any[]
  }[]
  height: number
  width: string
  loading?: boolean
}

const SynchronizedCharts: React.FC<SynchronizedChartsProps> = ({ dataCharts, height, width, chartTitle, loading }) => {
  const chartOptions: ApexOptions = {
    chart: {
      // id: `sync-${index}`,
      group: 'social',
      type: 'line',
      height: 160,
      toolbar: {
        show: true,
        tools: {
          download: false,
          pan: false,
        },
      },
      zoom: {
        enabled: true,
      },
      events: {
        mounted: (chartContext: any) => {
          const chartEl = chartContext.el

          chartEl.addEventListener('chart:updated', () => {
            const syncedCharts = document.querySelectorAll('[data-chart-id]')
            syncedCharts.forEach((chart: any) => {
              if (chart.dataset.chartId !== chartContext.id) {
                chart.__apexCharts.updateOptions({
                  xaxis: {
                    min: chartContext.w.globals.minX,
                    max: chartContext.w.globals.maxX,
                  },
                })
              }
            })
          })
        },
      },
    },
    tooltip: {
      enabled: true,
    },
    xaxis: {
      tooltip: {
        enabled: false,
      },
      type: 'datetime',
      labels: {
        formatter(value, _, __) {
          const date = new Date(value)
          return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
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
      labels: {
        colors: 'white',
      },
    },
  }

  const resDataChart = useMemo(() => {
    if (dataCharts.length > 0) {
      if (dataCharts?.[1]) {
        const dataChartsAdded = dataCharts[0].data.map((item) => {
          if (dataCharts[1].data.some((el) => el[0].slice(0, 16) == item[0].slice(0, 16))) {
            return [item[0], dataCharts[1].data.find((el) => el[0].slice(0, 16) == item[0].slice(0, 16))[1]]
          } else {
            return [item[0], null]
          }
        })

        return [dataCharts[0], { title: dataCharts[1].title, data: dataChartsAdded }]
      }

      return dataCharts
    }

    return []
  }, [dataCharts])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Typography variant="h6" component="h6" color="white" fontWeight={600}>
          {/* {metric.title} */}
          {chartTitle}
        </Typography>
        {(() => {
          if (loading) {
            return (
              <div className={`flex justify-center items-center h-[${height}px]`}>
                <div className="spinner"></div>
              </div>
            )
          } else {
            if (resDataChart.every((series) => series.data.length === 0)) {
              return (
                <div className={`flex items-center justify-center h-[${height}px]`}>
                  <Typography color={'white'}>
                    DATA UNAVAILABLE FOR THIS SELECTION. PLEASE SELECT OTHER DATA OR TRY AGAIN LATER.
                  </Typography>
                </div>
              )
            } else {
              return (
                <Chart
                  options={chartOptions}
                  series={resDataChart.map((item) => ({ name: item.title, data: item.data })) as ApexAxisChartSeries}
                  type="line"
                  height={height}
                  width={width}
                  // data-chart-id={`chart${index + 1}`}
                />
              )
            }
          }
        })()}
      </div>
    </div>
  )
}

export default SynchronizedCharts
