'use client'

import './main-page.css'
import { useLayoutEffect, useMemo, useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { Maximize } from 'react-feather'
import { useLocalStorage } from '@/hooks/use-storage'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import {
  GetForecastingData,
} from '@/modules/usecases/forecasting'
import FilterPanel from './button/filter-panel'
import SynchronizedCharts from './chart/synchronized-charts'
import Button from '@/components/system/Button/Button'
import useInterval from '@/hooks/use-interval'
import { format, isToday } from 'date-fns'
import Skeleton from '@/components/system/Skeleton/Skeleton'

const MainPageForecasting = () => {
  const [graphData, setGraphData] = useState<any[]>([])
  const [filter, setFilter] = useState({
    sourceData: null as string | null,
    serviceName: null as string | null,
    selectedDate: '' as string,
  })
  const [filterValue, setFilterValue] = useLocalStorage('filter', undefined)
  const [chartLoading, setChartLoading] = useState(false)
  const [zoomLevel, setZoomLevel] = useState({
    maxZoom: undefined as number | undefined,
    minZoom: undefined as number | undefined,
  })

  const handle = useFullScreenHandle()

  const handleApplyFilters = async (filters: {
    selectedSource: string | null
    selectedService: string | null
    selectedDate: string
  }) => {
    const { selectedSource, selectedService, selectedDate } = filters

    setChartLoading(true)
    setFilter({
      ...filter,
      sourceData: selectedSource,
      serviceName: selectedService,
      selectedDate,
    })
    GetForecastingData({
      data_source: selectedSource ?? '',
      service_name: selectedService ?? '',
      date: selectedDate,
      method: 'XGBoost', // Hardcoded method value
    })
      .then((res) => {
        setGraphData(res.data)
        setChartLoading(false)
      })
      .catch(() => setChartLoading(false))

    setFilterValue({ dataSource: selectedSource, service: selectedService, date: selectedDate })
  }

  const handleZoom = (value?: { maxZoom?: number; minZoom?: number }) => {
    setZoomLevel({ ...zoomLevel, ...value })
  }

  useLayoutEffect(() => {
    setChartLoading(true)
    const { dataSource = "tpm", service = "All", date = format(new Date(), "yyyy-MM-dd") } = filterValue || {}
    setFilter({
      ...filter,
      sourceData: dataSource,
      serviceName: service,
      selectedDate: date,
    })

    GetForecastingData({
      data_source: dataSource,
      service_name: service,
      date,
      method: 'XGBoost', // Hardcoded method value
    })
      .then((res) => {
        setGraphData(res.data)
      })
      .finally(() => setChartLoading(false))
  }, [])

  useInterval(
    fetchData,
    3000,
    filter.sourceData != null &&
    filter.serviceName != null &&
    filter.selectedDate != null &&
    isToday(filter.selectedDate)
  )

  async function fetchData() {
    GetForecastingData({
      data_source: filter.sourceData ?? '',
      service_name: filter.serviceName ?? '',
      date: filter.selectedDate,
      method: 'XGBoost', // Hardcoded method value
    })
      .then((res) => {
        setGraphData(res.data)
        setChartLoading(false)
      })
      .catch(() => setGraphData([]))
  }

  const chartIntervalUpdate = useMemo(() => {
    return (
      <SynchronizedCharts
        chartTitle={`${filter.serviceName?.length ? filter.serviceName + ' - ' : ''} ${filter.sourceData}`}
        dataCharts={graphData.map((el) => ({
          ...el,
          title: el?.title?.toLowerCase()?.includes('existing') ? 'Actual' : el?.title,
        }))}
        height={400}
        width="100%"
        setZoom={(e) => handleZoom(e)}
        maxZoom={zoomLevel.maxZoom}
        minZoom={zoomLevel.minZoom}
        selectedDate={filter.selectedDate}
      />
    )
  }, [graphData])

  return (
    <div className="flex flex-col gap-8">
      <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
        <FilterPanel onApplyFilters={handleApplyFilters} activeFilter={filter} />
        <div className="ml-auto flex">
          <Button onClick={handle.enter}>
            <Maximize className='w-6 h-6' />
          </Button>
        </div>
      </Stack>
      <FullScreen className={`${handle.active ? "p-6" : ""} bg-[#05061E] overflow-auto`} handle={handle}>
        <div className="flex flex-col gap-10 px-14 py-12 card-style">
          {(() => {
            if (!filter.sourceData) {
              return (
                <div className="flex flex-col gap-8">
                  <Typography variant="h5" component="h5" color="white" align="center">
                    PLEASE USE FILTER BUTTON TO FORECAST DATA
                  </Typography>
                </div>
              )
            } else {
              return (
                <div className="flex flex-col gap-8">
                  <Typography variant="h5" component="h5" color="white">
                    Graphic Anomaly Forecasting
                  </Typography>
                  <div className="flex flex-col gap-2">
                    <Typography variant="h6" component="h6" color="white" fontWeight={600}>
                      {`${filter.serviceName?.length ? filter.serviceName + ' - ' : ''} ${filter.sourceData}`}
                    </Typography>
                    {chartLoading ?
                      <Skeleton width={'100%'} height={400} /> : chartIntervalUpdate
                    }
                  </div>
                </div>
              )
            }
          })()}
        </div>
      </FullScreen>
    </div>
  )
}

export default MainPageForecasting

