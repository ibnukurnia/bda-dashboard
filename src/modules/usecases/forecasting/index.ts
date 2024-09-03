import { get } from '@/common/api'
import { ApiResponse } from '@/common/api/type'

const GetForecastingColumns = async () => {
  const response = await fetch('/api/forecasting-columns', { method: 'GET' })
  const resJson = await response.json()

  return resJson
}

const GetForecastingTableData = async (params: { page: number; limit: number }) => {
  const response = await fetch(`/api/forecasting-table-data?page=${params.page}&limit=${params.limit}`, {
    method: 'GET',
  })
  const resJson = await response.json()

  return resJson
}

const GetForecastingStatistics = async () => {
  const response = await fetch('/api/forecasting-statistics', { method: 'GET' })
  const resJson = await response.json()

  return resJson
}

const GetFilterDataSource = async () => {
  const response = await fetch('/api/forecasting/data-source', { method: 'GET' })
  const resJson = await response.json()

  return resJson
}

const GetFilterMetric = async () => {
  const response = await fetch('/api/forecasting/metric', { method: 'GET' })
  const resJson = await response.json()

  return resJson
}

const GetFilterOptional = async () => {
  const response = await fetch('/api/forecasting/options', { method: 'GET' })
  const resJson = await response.json()

  return resJson
}

const GetForecastingData = async (params: { data_source: string; service_name: string }, signal?: AbortSignal) => {
  let endPoint = `forecasting`

  const response: ApiResponse<any> = await get(
    endPoint,
    {
      withAuth: true,
      queries: params,
    },
    signal
  )

  return response
}

const GetFilterServiceList = async (params: { data_source: string }, signal?: AbortSignal) => {
  let endPoint = `forecasting/service-list`

  const response: ApiResponse<any> = await get(
    endPoint,
    {
      withAuth: true,
      queries: params,
    },
    signal
  )

  return response
}

export {
  GetForecastingColumns,
  GetForecastingTableData,
  GetForecastingStatistics,
  GetFilterDataSource,
  GetFilterMetric,
  GetFilterOptional,
  GetForecastingData,
  GetFilterServiceList,
}
