import { get } from '@/common/api'
import { ApiResponse, PaginatedResponse } from '@/common/api/type'
import {
  AnomalyOptionResponse,
  HistoricalAnomalyNetworkResponse,
  HistoricalAnomalySecurityResponse,
  HistoricalAnomalyUtilizationResponse,
  MetricLogAnomalyResponse,
} from '@/modules/models/anomaly-predictions'

const GetHistoricalLogAnomalies = async (
  type: string,
  limit: number,
  page: number,
  filterAnomaly: string[],
  filterServices: string[],
  filterSeverities: number[],
  start_time: string,
  end_time: string
) => {
  let endPoint = `anomaly-predictions?type=${type}&limit=${limit}&page=${page}&start_time=${start_time}&end_time=${end_time}`

  filterAnomaly.forEach((f) => {
    endPoint += `&filters=${f}`
  })

  filterServices.forEach((f) => {
    endPoint += `&service_name=${f}`
  })

  filterSeverities.forEach((f) => {
    endPoint += `&severity=${f}`
  })

  const response: ApiResponse<PaginatedResponse> = await get(endPoint, {
    withAuth: true,
  })

  return response
}

const GetMetricLogAnomalies = async (payload: { type: string, start_time: string, end_time: string, service_name: string, metric_name: string[] }, signal?: AbortSignal) => {
  let endPoint = `anomaly-predictions/metrics-per-service`

  const response: ApiResponse<MetricLogAnomalyResponse[]> = await get(endPoint, {
    withAuth: true,
    queries: payload,
    signal: signal
  },)

  return response
}

const GetHistoricalUtilizationAnomalies = async () => {
  const response: ApiResponse<PaginatedResponse> = await get('anomaly-predictions', {
    withAuth: true,
  })

  return response
}

const GetHistoricalNetworkAnomalies = async () => {
  const response: ApiResponse<PaginatedResponse> = await get('anomaly-predictions', {
    withAuth: true,
  })

  return response
}

const GetHistoricalSecurityAnomalies = async () => {
  const response: ApiResponse<PaginatedResponse> = await get('anomaly-predictions', {
    withAuth: true,
  })

  return response
}

const GetFetchAnomalyOption = async (): Promise<ApiResponse<AnomalyOptionResponse>> => {
  const response: ApiResponse<AnomalyOptionResponse> = await get('anomaly-predictions/filter-column', {
    withAuth: true,
  })

  return response
}

const GetColumnOption = async (table: string): Promise<ApiResponse<AnomalyOptionResponse>> => {
  const response: ApiResponse<AnomalyOptionResponse> = await get(`anomaly-predictions/filter-column-on-table?table=${table}`, {
    withAuth: true,
  })

  return response
}

export {
  GetHistoricalLogAnomalies,
  GetMetricLogAnomalies,
  GetHistoricalNetworkAnomalies,
  GetHistoricalSecurityAnomalies,
  GetHistoricalUtilizationAnomalies,
  GetColumnOption,
}
