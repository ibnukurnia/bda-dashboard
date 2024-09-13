'use client'

import { Fragment, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowLeft, ArrowRight, Info } from 'react-feather'

import './main-page.css'

import {
  GetForecastingColumns,
  GetForecastingData,
  GetForecastingStatistics,
  GetForecastingTableData,
} from '@/modules/usecases/forecasting'

import { useLocalStorage } from '@/hooks/use-storage'

import FilterPanel from './button/filter-panel'
import SynchronizedCharts from './chart/synchronized-charts'
import ForecastingTable from './table/forecasting-table'

const MainPageForecasting = () => {
  const [columns, setColumns] = useState<ColumnDef<any, any>[]>([])
  const [graphData, setGraphData] = useState<any[]>([])
  const [data, setData] = useState<any[]>([])
  const [statistics, setStatistics] = useState<{ label: string; value: string; unit: string }[]>([])
  const [pagination, setPagination] = useState({
    pageIndex: 1, // Start from page 1
    pageSize: 10, // Default page size
  })
  const [totalPages, setTotalPages] = useState<number>(1)
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

  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
  })

  const nextPage = () => {
    setPagination((prev) => {
      const newPageIndex = Math.min(prev.pageIndex + 1, totalPages)
      GetForecastingTableData({ limit: pagination.pageSize, page: newPageIndex }).then((tableData) => {
        setData(tableData.data)
        setTotalPages(tableData.pagination.totalPage)
      })
      return { ...prev, pageIndex: newPageIndex }
    })
  }

  const previousPage = () => {
    setPagination((prev) => {
      const newPageIndex = Math.max(prev.pageIndex - 1, 1)
      GetForecastingTableData({ limit: pagination.pageSize, page: newPageIndex }).then((tableData) => {
        setData(tableData.data)
        setTotalPages(tableData.pagination.totalPage)
      })
      return { ...prev, pageIndex: newPageIndex }
    })
  }

  const handleChangePaginationSize = (size: number) => {
    GetForecastingTableData({ limit: size, page: 1 }).then((tableData) => {
      setData(tableData.data)
      setTotalPages(tableData.pagination.totalPage)
    })
    setPagination((prev) => {
      return { ...prev, pageSize: size, pageIndex: 1 }
    })
  }

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
    GetForecastingStatistics().then((statistics) => setStatistics(statistics.data))
    GetForecastingData({
      data_source: selectedSource ?? '',
      service_name: selectedService ?? '',
      date: selectedDate,
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
    if (filterValue?.dataSource && filterValue?.service && filterValue?.date) {
      setChartLoading(true)
      const { dataSource, service, date } = filterValue
      setFilter({
        ...filter,
        sourceData: dataSource,
        serviceName: service,
        selectedDate: date,
      })

      GetForecastingStatistics().then((statistics) => setStatistics(statistics.data))
      GetForecastingData({
        data_source: dataSource,
        service_name: service,
        date,
      })
        .then((res) => {
          setGraphData(res.data)
          setChartLoading(false)
        })
        .catch(() => setChartLoading(false))
    }
  }, [])

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (filter.sourceData && filter.serviceName && filter.selectedDate) {
      intervalId = setInterval(() => {
        GetForecastingData({
          data_source: filter.sourceData ?? '',
          service_name: filter.serviceName ?? '',
          date: filter.selectedDate,
        })
          .then((res) => {
            setGraphData(res.data)
            setChartLoading(false)
          })
          .catch(() => setGraphData([]))
      }, 30000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [filter])

  const chartIntervalUpdate = useMemo(() => {
    return (
      <SynchronizedCharts
        chartTitle={filter.serviceName?.length ? `${filter.serviceName} - ${filter.sourceData}` : ''}
        dataCharts={graphData}
        height={400}
        width="100%"
        loading={chartLoading}
        setZoom={(e) => handleZoom(e)}
        maxZoom={zoomLevel.maxZoom}
        minZoom={zoomLevel.minZoom}
      />
    )
  }, [graphData])

  return (
    <div className="flex flex-col gap-8">
      <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
        <FilterPanel onApplyFilters={handleApplyFilters} activeFilter={filter} />
      </Stack>
      {/* {statistics.length > 0 && (
        <Stack sx={{ display: 'flex', gap: 4, flexDirection: 'row' }}>
          {statistics?.map((statistic, statsid) => (
            <div key={statsid} className="flex flex-col gap-2 p-6 bg-[#0A1635] rounded-2xl border border-[#373737]">
              <div className="inline-flex align-center gap-3">
                <svg width="32" height="24" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5.96 27.9999H26.04C28.0933 27.9999 29.3733 25.7732 28.3467 23.9999L18.3067 6.65324C17.28 4.87991 14.72 4.87991 13.6933 6.65324L3.65333 23.9999C2.62667 25.7732 3.90667 27.9999 5.96 27.9999ZM16 18.6666C15.2667 18.6666 14.6667 18.0666 14.6667 17.3332V14.6666C14.6667 13.9332 15.2667 13.3332 16 13.3332C16.7333 13.3332 17.3333 13.9332 17.3333 14.6666V17.3332C17.3333 18.0666 16.7333 18.6666 16 18.6666ZM17.3333 23.9999H14.6667V21.3332H17.3333V23.9999Z"
                    fill="#F59823"
                  />
                </svg>

                <Typography variant="body1" component="p" color="white" sx={{ margin: 0 }}>
                  {statistic?.label}
                </Typography>
              </div>
              <Typography variant="h4" component="h4" color="white" sx={{ margin: 0, fontSize: '42px' }}>
                {statistic?.value}
                <span style={{ fontSize: '16px', marginLeft: '5px', fontWeight: 400 }}>{statistic?.unit}</span>
              </Typography>
            </div>
          ))}
        </Stack>
      )} */}
      <div className="flex flex-col gap-10 px-14 py-12 card-style">
        {(() => {
          if (!filter.sourceData) {
            return (
              <div className="flex flex-col gap-8">
                <Typography variant="h5" component="h5" color="white" align="center">
                  DATA IS NOT AVAILABLE. PLEASE USE FILTER BUTTON TO FORECAST DATA
                </Typography>
              </div>
            )
          } else {
            return (
              <Fragment>
                <div className="flex flex-col gap-8">
                  <Typography variant="h5" component="h5" color="white">
                    Graphic Anomaly Forecasting
                  </Typography>
                  {chartIntervalUpdate}
                  {/* <SynchronizedCharts
                    chartTitle={filter.serviceName?.length ? `${filter.serviceName} - ${filter.sourceData}` : ''}
                    dataCharts={graphData}
                    height={400}
                    width="100%"
                    loading={chartLoading}
                  /> */}
                </div>
                {/* <div className="flex flex-col gap-8">
                  <Typography variant="h5" component="h5" color="white">
                    Table Anomaly Forecasting
                  </Typography>
                  <ForecastingTable
                    table={table}
                    data={data}
                    changePaginationSize={handleChangePaginationSize}
                    totalPages={totalPages}
                    previousPage={previousPage}
                    nextPage={nextPage}
                    pagination={pagination}
                  />
                </div> */}
              </Fragment>
            )
          }
        })()}
      </div>
    </div>
  )
}

export default MainPageForecasting
