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

  const response: ApiResponse<PaginatedResponse> = await get(endPoint, {
    withAuth: true,
  })

  return response
}

const GetMetricLogAnomalies = async (
  type: string,
  start_time: string,
  end_time: string,
  service_name: string,
  metric: string[]
) => {
  let endPoint = `anomaly-predictions/metrics-per-service?type=${type}&start_time=${start_time}&end_time=${end_time}&service_name=${service_name}`

  metric.forEach((m) => {
    endPoint += `&metric_name=${m}`
  })

  const response: ApiResponse<MetricLogAnomalyResponse[]> = await get(endPoint, {
    withAuth: true,
  })

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

export {
  GetHistoricalLogAnomalies,
  GetMetricLogAnomalies,
  GetHistoricalNetworkAnomalies,
  GetHistoricalSecurityAnomalies,
  GetHistoricalUtilizationAnomalies,
}
