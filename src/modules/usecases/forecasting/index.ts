import { get } from '@/common/api'

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

const GetForecastingTableData = async () => {
  const response = await fetch('/api/forecasting-table-data', { method: 'GET' })
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
  GetForecastingColumns,
  GetForecastingGraphData,
  GetForecastingTableData,
  GetForecastingStatistics,
  GetFilterDataSource,
  GetFilterMetric,
  GetFilterService,
  GetFilterOptional,
}
