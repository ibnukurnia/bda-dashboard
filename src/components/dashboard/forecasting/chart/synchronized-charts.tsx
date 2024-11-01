import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
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
  minZoom,
  maxZoom,
  setZoom,
  selectedDate,
}) => {
  const today = new Date(selectedDate)
  const todayZero = new Date(today?.getFullYear(), today?.getMonth(), today?.getDate()).getTime()
  const todayMaxTime = todayZero + 1000 * 60 * 60 * 24

  const [zoomX, setZoomX] = useState({
    min: minZoom ?? today.getTime() - 1000 * 60 * 60 * 2,
    max: maxZoom ?? today.getTime() + 1000 * 60 * 60 * 2,
  })

  const [xaxisRange, setXaxisRange] = useState<{ min: number; max?: number }>({
    min: zoomX.min,
    max: zoomX.max,
  });
  const [yaxisRange, setYaxisRange] = useState<{ min: number; max?: number }>({
    min: 0,
    max: undefined,
  });

  // Format numbers to include commas, e.g., 1000 -> 1,000
  const formatNumber = (val: number) => {
    return val?.toLocaleString('en-US')
  }

  // Function to check service name and apply currency formatting
  const formatWithCurrency = (val: number, title?: string) => {
    if (title?.trim() === 'sales_volume') { // Replace 'x' with the actual service name you want to check for
      return `Rp. ${formatNumber(val)}`
    }
    return formatNumber(val)
  }

  const chartOptions: ApexOptions = {
    chart: {
      animations: {
        enabled: false,
      },
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
            min: today.getTime() - 1000 * 60 * 60 * 2,
            max: today.getTime() + 1000 * 60 * 60 * 2,
          }
          updateAxisRanges(resResetZoom.min, resResetZoom.max);

          return {
            xaxis: resResetZoom,
          }
        },

        beforeZoom(_chart, { xaxis }) {
          const res = {
            min: xaxis.min < todayZero ? todayZero : xaxis.min,
            max: xaxis.max > todayMaxTime ? todayMaxTime : xaxis.max,
          }
          
          updateAxisRanges(res.min, res.max);
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
      min: xaxisRange.min,
      max: xaxisRange.max,
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
      min: yaxisRange.min,
      max: yaxisRange.max,
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
        // Step 1: Get all unique timestamps
        const allTimestamps = Array.from(
          new Set(dataCharts.flatMap(entry => entry.data.map(([timestamp]) => timestamp)))
        ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        // Step 2: Fill missing timestamps for each dataset
        return dataCharts.map(entry => {
          const dataMap = new Map(entry.data.map(([timestamp, value]) => [timestamp, value]));
          const filledData = allTimestamps.map(timestamp => [
            timestamp,
            dataMap.has(timestamp) ? dataMap.get(timestamp) : null
          ]);

          return {
            title: entry.title,
            data: filledData
          };
        });
      }

      return dataCharts
    }

    return []
  }, [dataCharts])
  const chartSeries = resDataChart.map((item) => ({ name: item.title, data: item.data }))

  const updateAxisRanges = useCallback((zoomedMin: number, zoomedMax: number) => {
    
    const selectedData = chartSeries.flatMap(s =>
      s.data.filter(([timestamp]) => new Date(timestamp).getTime() >= zoomedMin && new Date(timestamp).getTime() <= zoomedMax)
    );
    
    if (selectedData.length) {
      const selectedYValues = selectedData.map(([_, value]) => value);
      const maxY = Math.max(...selectedYValues) * 1.1;

      setYaxisRange(prev => ({ ...prev, max: maxY }));
    }
    setXaxisRange(({ min: zoomedMin, max: zoomedMax }))
  }, [chartSeries]);

  useLayoutEffect(() => {
    if (minZoom !== undefined && maxZoom !== undefined) {
      setZoomX({ min: minZoom, max: maxZoom })
    }
  }, [minZoom, maxZoom])

  useEffect(() => {
    const min = today.getTime() - 1000 * 60 * 60 * 2
    const max = today.getTime() + 1000 * 60 * 60 * 2
    setZoomX({ min, max })
    setZoom && setZoom({ minZoom: min, maxZoom: max })
  }, [selectedDate])

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
