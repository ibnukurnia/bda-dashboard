'use client'

import { Fragment, useEffect, useState } from 'react'
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
  GetForecastingGraphData,
  GetForecastingStatistics,
  GetForecastingTableData,
} from '@/modules/usecases/forecasting'

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
    metric: null as string | null,
    serviceName: null as string | null,
    optional: null as string | null,
  })

  // const statistics = [
  //   {
  //     label: 'Stats 1',
  //     value: 500,
  //     unit: 'unit1',
  //   },
  //   {
  //     label: 'Stats 2',
  //     value: 120,
  //     unit: 'unit2',
  //   },
  //   {
  //     label: 'Stats 3',
  //     value: 100,
  //     unit: 'unit3',
  //   },
  // ]

  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true, // Disable table's internal pagination
    // state: {
    //   pagination,
    // },
  })

  const nextPage = () => {
    // const logType = selectedLog === 'Log APM' ? 'apm' : selectedLog === 'Log Brimo' ? 'brimo' : ''
    // if (selectedOptions.length !== 0) {
    //   // If there are selected filters, hit the API with the filters
    //   setPagination((prev) => {
    //     const newPageIndex = Math.min(prev.pageIndex + 1, totalPages)
    //     GetHistoricalLogAnomalies(
    //       logType,
    //       prev.pageSize,
    //       newPageIndex,
    //       selectedAnomalyOptions,
    //       selectedServicesOptions,
    //       15
    //     ) // Fetch data with filters for the new page
    //       .then((result) => {
    //         // Process the result and update the state
    //         if (result.data) {
    //           // Update columns and data
    //           const newColumns = result.data.columns.map((column: any) => ({
    //             id: column.key,
    //             header: column.title,
    //             accessorKey: column.key,
    //           }))
    //           setColumns(newColumns)

    //           const newData = result.data.rows.map((row: any) => {
    //             const mappedRow: any = {}
    //             result.data?.columns.forEach((col: any) => {
    //               mappedRow[col.key] = row[col.key]
    //             })
    //             return mappedRow
    //           })
    //           setData(newData)
    //         } else {
    //           console.warn('API response data is null or undefined')
    //         }
    //       })
    //       .catch((error) => {
    //         console.error('Error fetching data with filters:', error)
    //       })
    //     return { ...prev, pageIndex: newPageIndex }
    //   })
    // } else {
    //   // If no filters are selected, proceed with normal pagination
    // }
    setPagination((prev) => {
      const newPageIndex = Math.min(prev.pageIndex + 1, totalPages)
      // fetchDataByPagination(newPageIndex, prev.pageSize, [], 15) // Fetch data for the new page
      return { ...prev, pageIndex: newPageIndex }
    })
  }

  const previousPage = () => {
    setPagination((prev) => {
      const newPageIndex = Math.max(prev.pageIndex - 1, 1)
      // fetchDataByPagination(newPageIndex, prev.pageSize, [], 15) // Fetch data for the previous page
      return { ...prev, pageIndex: newPageIndex }
    })
  }

  const handleApplyFilters = async (filters: {
    selectedSource: string | null
    selectedMetric: string | null
    selectedService: string | null
    selectedOption: string | null
  }) => {
    const { selectedSource, selectedMetric, selectedService, selectedOption } = filters

    setFilter({
      ...filter,
      sourceData: selectedSource,
      metric: selectedMetric,
      serviceName: selectedService,
      optional: selectedOption,
    })
    GetForecastingColumns().then((result) => setColumns(result.data))
    GetForecastingGraphData().then((graphData) => setGraphData(graphData.data))
    GetForecastingTableData().then((tableData) => setData(tableData.data))
    GetForecastingStatistics().then((statistics) => setStatistics(statistics.data))
  }

  // useEffect(() => {
  //   GetForecastingColumns().then((result) => setColumns(result.data))
  //   GetForecastingGraphData().then((graphData) => setGraphData(graphData.data))
  //   GetForecastingTableData().then((tableData) => setData(tableData.data))
  // }, [])

  return (
    <div className="flex flex-col gap-8">
      <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
        <FilterPanel onApplyFilters={handleApplyFilters} activeFilter={filter} />
        {/* <div className="flex flex-row gap-1.5 items-center">
          <Info size={'16px'} color="white" />
          <Typography color={'white'}>Please use this filter button to forecast</Typography>
        </div> */}
      </Stack>
      {statistics.length > 0 && (
        <Stack sx={{ display: 'flex', gap: 6, flexDirection: 'row', px: 3 }}>
          {statistics?.map((statistic, statsid) => (
            <Stack key={statsid} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
            </Stack>
          ))}
        </Stack>
      )}
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
                  <SynchronizedCharts dataCharts={graphData} height={300} width="100%" />
                </div>
                <div className="flex flex-col gap-8">
                  <Typography variant="h5" component="h5" color="white">
                    Table Anomaly Forecasting
                  </Typography>
                  <ForecastingTable
                    table={table}
                    data={data}
                    setPagination={setPagination}
                    totalPages={totalPages}
                    previousPage={previousPage}
                    nextPage={nextPage}
                    pagination={pagination}
                  />
                </div>
              </Fragment>
            )
          }
        })()}
      </div>
    </div>
  )
}

export default MainPageForecasting
