import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { Typography } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import { format } from 'date-fns'
import { formatWithDotsAndComma } from '@/helper'

// Dynamically import ApexCharts to avoid server-side rendering issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface SynchronizedChartsProps {
  chartTitle?: string
  dataCharts: {
    title: string
    data: any[]
  }[]
  height: number
  width: string
  minZoom?: number
  maxZoom?: number
  setZoom?: (params?: { minZoom?: number; maxZoom?: number }) => void
  selectedDate: string | Date
  withAlertThreshold?: boolean
}

const SynchronizedCharts: React.FC<SynchronizedChartsProps> = ({
  dataCharts,
  height,
  width,
  chartTitle,
  minZoom,
  maxZoom,
  setZoom,
  selectedDate,
  withAlertThreshold,
}) => {
  // Initialize date and time range for the chart
  const today = new Date(selectedDate)
  const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const todayMaxTime = todayZero + 1000 * 60 * 60 * 24

  // State to manage the x-axis range
  const [xaxisRange, setXaxisRange] = useState<{ min: number; max: number }>({
    min: minZoom ?? today.getTime() - 1000 * 60 * 60 * 2, // Default range: 2 hours before current time
    max: maxZoom ?? today.getTime() + 1000 * 60 * 60 * 2, // Default range: 2 hours after current time
  })

  // Format a number with commas for better readability
  const formatNumber = (val: number) => val?.toLocaleString('id-ID')

  // Add currency formatting for specific data (e.g., sales volume)
  const formatWithCurrency = (val: number, title?: string) => {
    if (title?.trim() === 'sales_volume') {
      return `Rp. ${formatNumber(val)}`
    }
    return val ? formatWithDotsAndComma(val) : val?.toString()
  }

  // Process the input chart data to ensure all timestamps are aligned across datasets
  const resDataChart = useMemo(() => {
    if (dataCharts.length > 0) {
      if (dataCharts?.[1]) {
        const allTimestamps = Array.from(
          new Set(dataCharts.flatMap(entry => entry.data.map(([timestamp]) => timestamp)))
        ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

        return dataCharts.map(entry => {
          const dataMap = new Map(entry.data.map(([timestamp, value]) => [timestamp, value]))
          const filledData = allTimestamps.map(timestamp => [
            timestamp,
            dataMap.has(timestamp) ? dataMap.get(timestamp) : null
          ])

          return {
            title: entry.title,
            data: filledData
          }
        })
      }
      return dataCharts
    }
    return []
  }, [dataCharts])

  // Create series for the chart with type based on `withAlertThreshold` prop
  const chartSeries = resDataChart.map((item, index) => ({
    name: item.title,
    data: item.data,
    type: withAlertThreshold && index === 0 ? "area" : "line"
  }))

  // Determine the maximum and minimum values for the data series
  const minValue = chartSeries[0].data.reduce((min, data) => {
    if (data[1] === null) return min
    if (min === null || data[1] < min) return data[1]
    return min
  }, null)
  const maxValue = chartSeries[0].data.reduce((max, data) => {
    if (data[1] === null) return max
    if (max === null || data[1] > max) return data[1]
    return max
  }, null)

  // Thresholds for color transitions in the chart
  const firstThreshold = 0.01
  const secondThreshold = 0.1

  // Generate gradient color stops for line charts
  const getLineColorStops = () => {
    const colorStops: ApexColorStop[] = []
    const addColorStop = (offset: number, color: string) => colorStops.push({ offset, color, opacity: 1 })

    // Add gradient stops based on thresholds
    if (maxValue >= secondThreshold) {
      addColorStop(0, "#ef5350") // Red for exceeding second threshold
      addColorStop(100 - (((secondThreshold - minValue) / (maxValue - minValue)) * 100), "#ef5350")
      
      if (minValue >= firstThreshold) {
        addColorStop(100 - (((secondThreshold - minValue) / (maxValue - minValue)) * 100), "#ffa726");
      }
    } else if (maxValue >= firstThreshold) {
      addColorStop(0, "#ffa726") // Orange for exceeding first threshold
    } else {
      addColorStop(0, "#008ffb") // Blue for normal range
    }

    if (maxValue >= firstThreshold && minValue <= firstThreshold) {
      addColorStop(100 - (((firstThreshold - minValue) / (maxValue - minValue)) * 100), "#ffa726");
    }

    if (minValue >= firstThreshold) {
      addColorStop(100, "#ffa726");
    }

    if (minValue <= firstThreshold) {
      addColorStop(100 - (((firstThreshold - minValue) / (maxValue - minValue)) * 100), "#008ffb");
      addColorStop(100, "#008ffb");
    }

    return colorStops
  }

  const getAreaColorStops = () => {
    const colorStops: ApexColorStop[] = [];
    const addColorStop = (offset: number, color: string) => colorStops.push({ offset, color, opacity: 1 });

    // Option 1
    // if (maxValue >= secondThreshold) {
    //   addColorStop(0, "#ef5350");

    //   if (minValue <= firstThreshold) {
    //     addColorStop(100 - (secondThreshold / maxValue) * 100, "#ffa726");
    //   }
    // } else if (maxValue >= firstThreshold) {
    //   addColorStop(0, "#ffa726");
    // } else {
    //   addColorStop(0, "#008ffb");
    // }

    // if (maxValue >= firstThreshold) {
    //   addColorStop(100 - (firstThreshold / maxValue) * 100, "#ffa726");
    // }

    // addColorStop(100, "#008ffb");

    // Option 2
    // if (maxValue >= secondThreshold) {
    //   addColorStop(0, "#ef5350");
    // } else if (maxValue >= firstThreshold) {
    //   addColorStop(0, "#ffa726");
    // } else {
    //   addColorStop(0, "#008ffb");
    // }

    // if (maxValue >= firstThreshold) {
    //   addColorStop(100 - (((secondThreshold + firstThreshold) / 2) / maxValue) * 100, "#ffa726");
    // }

    // addColorStop(100, "#008ffb");

    // Option 3
    if (maxValue >= secondThreshold) {
      addColorStop(0, "#ef5350");
      addColorStop(100 - (secondThreshold / maxValue) * 100, "#ef5350");

      if (minValue <= firstThreshold) {
        addColorStop(100 - (secondThreshold / maxValue) * 100, "#ffa726");
      }
    } else if (maxValue >= firstThreshold) {
      addColorStop(0, "#ffa726");
    } else {
      addColorStop(0, "#008ffb");
    }

    if (maxValue >= firstThreshold) {
      addColorStop(100 - (firstThreshold / maxValue) * 100, "#ffa726");
    }

    if (minValue <= firstThreshold) {
      addColorStop(100 - (firstThreshold / maxValue) * 100, "#008ffb");
    }

    addColorStop(100, "#008ffb");

    // Set decreasing opacity for each stop based on its position
    const stepSize = 100 / (colorStops.length - 1);
    colorStops.forEach((stop, index) => (stop.opacity = (100 - stepSize * index) / 100));

    return colorStops;
  };

  // Configure chart options
  const chartOptions: ApexOptions = {
    chart: {
      animations: { enabled: false }, // Disable animations for synchronized charts
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
        type: 'x', // Enable horizontal zoom
        autoScaleYaxis: true,
      },
      events: {
        beforeResetZoom() {
          const resResetZoom = {
            min: today.getTime() - 1000 * 60 * 60 * 2,
            max: today.getTime() + 1000 * 60 * 60 * 2,
          }

          return {
            xaxis: resResetZoom,
          }
        },

        beforeZoom(_chart, { xaxis }) {
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
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
    },
    xaxis: {
      min: xaxisRange.min,
      max: xaxisRange.max,
      tooltip: {
        enabled: false,
      },
      type: 'datetime',
      labels: {
        formatter(value, _, __) {
          return format(new Date(value), 'yyyy-MM-dd HH:mm');
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
        formatter: (val) => {
          // If it's a number, apply formatting
          if (!isNaN(val)) {
            return formatWithCurrency(val, chartTitle);
          }
          return val?.toString(); // Return string as is if not a number
        },
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      ...(withAlertThreshold && {
        fill: {
          type: ["gradient", "solid"],
          gradient: {
            type: 'vertical',
            colorStops: getLineColorStops(),
          }
        }
      })
    },
    ...(withAlertThreshold && {
      fill: {
        type: ["gradient", "solid"],
        gradient: {
          type: "vertical",
          colorStops: getAreaColorStops(),
        },
      },
    }),
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
    ...(withAlertThreshold && {
      annotations: {
        yaxis: [
          {
            y: firstThreshold,
            borderColor: '#FF802D',
            borderWidth: 2,
            strokeDashArray: 4,
            label: {
              borderColor: '#FF802D',
              style: {
                color: '#fff',
                background: '#FF802D',
              },
              text: 'Alert Threshold',
              offsetY: 7,
            },
          },
          {
            y: secondThreshold,
            borderColor: '#ff4d4d',
            borderWidth: 2,
            strokeDashArray: 4,
            label: {
              borderColor: '#ff4d4d',
              style: {
                color: '#fff',
                background: '#ff4d4d',
              },
              text: 'Alert Threshold',
              offsetY: 7,
            },
          },
        ],
      },
    }),
    legend: {
      labels: {
        colors: 'white',
      },
    },
  }

  // Synchronize x-axis range when `minZoom` or `maxZoom` changes
  useLayoutEffect(() => {
    if (minZoom !== undefined && maxZoom !== undefined) {
      setXaxisRange({ min: minZoom, max: maxZoom })
    }
  }, [minZoom, maxZoom])

  // Reset x-axis range when the selected date changes
  useEffect(() => {
    const min = today.getTime() - 1000 * 60 * 60 * 2
    const max = today.getTime() + 1000 * 60 * 60 * 2
    setXaxisRange({ min, max })
    setZoom && setZoom({ minZoom: min, maxZoom: max })
  }, [selectedDate])

  // Render the chart or a message if no data is available
  return (
    <div className="flex flex-col gap-4">
      {resDataChart.every((series) => series.data.length === 0) ?
        <div className={`flex items-center justify-center h-[${height}px]`}>
          <Typography color={'white'}>
            DATA UNAVAILABLE FOR THIS SELECTION. PLEASE SELECT OTHER DATA OR TRY AGAIN LATER.
          </Typography>
        </div>
        : <Chart
          options={chartOptions}
          series={chartSeries}
          type="line"
          height={height}
          width={width}
        />
      }
    </div>
  )
}

export default SynchronizedCharts
