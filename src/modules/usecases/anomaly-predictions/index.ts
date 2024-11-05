import { downloadFile, get } from '@/common/api'
import { ApiResponse, PaginatedResponse } from '@/common/api/type'
import {
  AnomalyOptionResponse,
  ClusterOptionResponse,
  MetricLogAnomalyResponse,
  ServiceOptionByClusterResponse,
} from '@/modules/models/anomaly-predictions'

const GetHistoricalLogAnomalies = async (payload: {
  type: string
  limit: number
  page: number
  start_time: string
  end_time: string
  filters: string[]
  cluster: string[]
  service_name: string[]
  severity: number[]
  operation: string // Ensure this is correctly passed
  network: string[]
  node: string[]
  interface: string[]
  category: string[]
  domain: string[]
}) => {
  const response: ApiResponse<PaginatedResponse> = await get('anomaly-predictions', {
    withAuth: true,
    queries: payload,
  })

  return response
}

const DownloadCsvHistoricalLogAnomalies = async (payload: {
  type: string
  start_time: string
  end_time: string
  filters: string[]
  cluster: string[]
  service_name: string[]
  severity: number[]
  operation: string // Ensure this is correctly passed
  network: string[]
  node: string[]
  interface: string[]
  category: string[]
  domain: string[]
}) => {
  const response: void = await downloadFile('anomaly-predictions/csv', 'text/csv', 'ops-vision_anomaly-history.csv', {
    withAuth: true,
    queries: payload,
  })

  return response
}

const GetMetricLogAnomalies = async (
  payload: {
    type: string
    start_time: string
    end_time: string
    metric_name: string[]
    cluster: string[]
    service_name: string | null
    network: string | null
    interface: string | null
    node: string | null
    category: string | null
    domain: string | null
  },
  signal?: AbortSignal
) => {
  let endPoint = `anomaly-predictions/metrics-per-service`

  const response: ApiResponse<MetricLogAnomalyResponse[]> = await get(endPoint, {
    withAuth: true,
    queries: payload,
    signal: signal,
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

const GetColumnOption = async (table: string): Promise<ApiResponse<AnomalyOptionResponse>> => {
  const response: ApiResponse<AnomalyOptionResponse> = await get(
    `anomaly-predictions/filter-column-on-table?table=${table}`,
    {
      withAuth: true,
    }
  )

  return response
}

const GetClusterOption = async (
  payload: {
    type: string
    start_time: string
    end_time: string
  },
  signal?: AbortSignal
) => {
  let endPoint = `list-cluster`

  const response: ApiResponse<ClusterOptionResponse[]> = await get(endPoint, {
    withAuth: true,
    queries: payload,
    signal: signal,
  })

  return response
}

const GetServicesOptionByCluster = async (
  payload: { type: string; start_time: string; end_time: string; cluster: string },
  signal?: AbortSignal
) => {
  let endPoint = `log-services-on-cluster`

  const response: ApiResponse<ServiceOptionByClusterResponse[]> = await get(endPoint, {
    withAuth: true,
    queries: payload,
    signal: signal,
  })

  return response
}

export {
  GetHistoricalLogAnomalies,
  DownloadCsvHistoricalLogAnomalies,
  GetMetricLogAnomalies,
  GetHistoricalNetworkAnomalies,
  GetHistoricalSecurityAnomalies,
  GetHistoricalUtilizationAnomalies,
  GetColumnOption,
  GetClusterOption,
  GetServicesOptionByCluster,
}
