import React from 'react'
import dynamic from 'next/dynamic'
import { Typography } from '@mui/material'
import { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface SynchronizedChartsProps {
  dataCharts: {
    title: string
    data: any[]
  }[]
  height: number
  width: string
}

const SynchronizedCharts: React.FC<SynchronizedChartsProps> = ({ dataCharts, height, width }) => {
  return (
    <div className="flex flex-col gap-4">
      {dataCharts &&
        dataCharts.map((metric, index) => {
          const chartOptions: ApexOptions = {
            // markers: { size: 2 },
            chart: {
              id: `sync-${index}`,
              group: 'social',
              type: 'line',
              height: 160,
              toolbar: {
                show: false,
              },
              zoom: {
                enabled: false,
              },
              events: {
                mounted: (chartContext: any) => {
                  const chartEl = chartContext.el

                  // chartContext.w.globals.seriesX?.forEach((_: any, id: number) => {
                  //   const highest = chartContext.getHighestValueInSeries(id)
                  //   chartContext.addPointAnnotation({
                  //     x: new Date(
                  //       chartContext.w.globals.seriesX[id][chartContext.w.globals.series[id].indexOf(highest)]
                  //     ).getTime(),
                  //     y: highest,
                  //   })
                  // })

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

          return (
            <div key={index} className="flex flex-col gap-2">
              <Typography variant="h6" component="h6" color="white" fontWeight={600}>
                {metric.title}
              </Typography>
              {(() => {
                if (metric.data.every((series) => series.length === 0)) {
                  return <Typography color={'white'}>NO DATA AVAILABLE</Typography>
                } else {
                  return (
                    <Chart
                      options={chartOptions}
                      series={
                        [
                          {
                            name: metric.title,
                            data: metric.data,
                          },
                        ] as ApexAxisChartSeries
                      }
                      type="line"
                      height={height}
                      width={width}
                      data-chart-id={`chart${index + 1}`}
                    />
                  )
                }
              })()}
            </div>
          )
        })}
    </div>
  )
}

export default SynchronizedCharts
