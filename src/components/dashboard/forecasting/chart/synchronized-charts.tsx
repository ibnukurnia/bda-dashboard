import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
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
  minZoom?: number
  maxZoom?: number
  setZoom?: (params?: { minZoom?: number; maxZoom?: number }) => void
  selectedDate: string | Date
}

const SynchronizedCharts: React.FC<SynchronizedChartsProps> = ({
  dataCharts,
  height,
  width,
  chartTitle,
  loading,
  minZoom,
  maxZoom,
  setZoom,
  selectedDate,
}) => {
  const today = new Date(selectedDate)
  const todayZero = new Date(today?.getFullYear(), today?.getMonth(), today?.getDate()).getTime()
  const todayMaxTime = todayZero + 1000 * 60 * 60 * 24 - 1
  const selectedDateTime = new Date(
    new Date().setDate(new Date().getDate() + Math.abs(new Date().getDate() - new Date(selectedDate).getDate()))
  )

  const [zoomX, setZoomX] = useState({
    min: minZoom ?? selectedDateTime.getTime() - 1000 * 60 * 60 * 2,
    max: maxZoom ?? selectedDateTime.getTime() + 1000 * 60 * 60 * 2,
  })
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
        beforeResetZoom() {
          const resResetZoom = {
            min: selectedDateTime.getTime() - 1000 * 60 * 60 * 2,
            max: selectedDateTime.getTime() + 1000 * 60 * 60 * 2,
          }

          return {
            xaxis: resResetZoom,
          }
        },

        beforeZoom(_chart, { xaxis }) {
          // const today = new Date()
          // const todayZero = new Date(today?.getFullYear(), today?.getMonth(), today?.getDate()).getTime()
          // const todayMaxTime = todayZero + 1000 * 60 * 60 * 24 - 1

          const res = {
            min: xaxis.min < todayZero ? todayZero : xaxis.min,
            max: xaxis.max > todayMaxTime ? todayMaxTime : xaxis.max,
          }

          setZoom && setZoom({ minZoom: res.min, maxZoom: res.max })

          return {
            xaxis: res,
          }
        },
      },
    },
    tooltip: {
      enabled: true,
    },
    xaxis: {
      min: zoomX.min,
      max: zoomX.max,
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
        formatter(val) {
          return val?.toFixed(0)
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

  useLayoutEffect(() => {
    if (minZoom !== undefined && maxZoom !== undefined) {
      setZoomX({ min: minZoom, max: maxZoom })
    }
  }, [minZoom, maxZoom])

  useEffect(() => {
    const min = selectedDateTime.getTime() - 1000 * 60 * 60 * 2
    const max = selectedDateTime.getTime() + 1000 * 60 * 60 * 2
    setZoomX({ min, max })
    setZoom && setZoom({ minZoom: min, maxZoom: max })
  }, [selectedDate])

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
