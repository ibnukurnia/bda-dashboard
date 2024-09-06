import { get } from '@/common/api'
import { ApiResponse, PaginatedResponse } from '@/common/api/type';

const GetRootCauseAnalysisTableData = async (params: { page: number; limit: number }) => {
  // const response: ApiResponse<PaginatedResponse> = await get(`/api/root-cause-analysis/table?page=${params.page}&limit=${params.limit}`, {isLocal: true })

  // return response
  const response = await fetch(`/api/root-cause-analysis/table?page=${params.page}&limit=${params.limit}`, {
    method: 'GET',
  })
  console.log(response);
  
  const resJson = await response.json()

  return resJson
}

const GetForecastingColumns = async () => {
  const response = await fetch('/api/forecasting-columns', { method: 'GET' })
  const resJson = await response.json()

  return resJson
}

const GetForecastingGraphData = async () => {
  const response = await fetch('/api/forecasting-graph-data', { method: 'GET' })
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

const GetFilterService = async () => {
  const response = await fetch('/api/forecasting/service-name', { method: 'GET' })
  const resJson = await response.json()

  return resJson
}

const GetFilterOptional = async () => {
  const response = await fetch('/api/forecasting/options', { method: 'GET' })
  const resJson = await response.json()

  return resJson
}

export {
  GetRootCauseAnalysisTableData,
  GetForecastingColumns,
  GetForecastingGraphData,
  GetForecastingTableData,
  GetForecastingStatistics,
  GetFilterDataSource,
  GetFilterMetric,
  GetFilterService,
  GetFilterOptional,
}
