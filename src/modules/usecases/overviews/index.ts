import { get } from '@/common/api'
import { ApiResponse, PaginatedResponse } from '@/common/api/type'
import {
  InsightOverviewResponse,
  MetricsOverviewResponse,
  ServiceOverviewResponse,
  TeamOverviewResponse,
  TopFiveLatestCritical,
} from '@/modules/models/overviews'

const GetCurrentSituation = async (): Promise<ApiResponse<InsightOverviewResponse>> => {
  const response = await get<InsightOverviewResponse>('overview/insights', {
    withAuth: true,
  })

  return response
}

const GetTeamOverview = async () => {
  const response = await get<TeamOverviewResponse>('overview/teams', {
    withAuth: true,
  })

  return response
}

const GetServiceOverview = async () => {
  const response = await get<ServiceOverviewResponse[]>('overview/services', {
    withAuth: true,
  })

  return response
}

const GetMetricsOverview = async () => {
  const response = await get<MetricsOverviewResponse[]>('overview/metrics', {
    withAuth: true,
  })

  return response
}

const GetChartsOverview = async (params?: any) => {
  const response: ApiResponse<any> = await get('overview/metrics', {
    withAuth: true,
    queries: params,
  })

  return response
}

const GetPieChartsOverview = async (params?: { type: string; start_time: string | Date; end_time: string | Date }) => {
  const response: ApiResponse<any> = await get('overview/piechart', {
    withAuth: true,
    queries: params,
  })

  return response
}

const GetTopServicesOverview = async (params?: {
  type: string
  start_time: string | Date
  end_time: string | Date
}) => {
  const response: ApiResponse<any> = await get('overview/top-services', {
    withAuth: true,
    queries: params,
  })

  return response
}

const GetHealthScoreOverview = async (params?: { start_time: string | Date; end_time: string | Date }) => {
  const response: ApiResponse<any> = await get('overview/health-score', {
    withAuth: true,
    queries: params,
  })

  return response
}

const GetLatestCritical = async (params?: {
  start_time: string | Date
  end_time: string | Date
  severity: number | null | undefined
  limit: number
  page: number
}) => {
  const response: ApiResponse<PaginatedResponse> = await get('latest-critical', {
    withAuth: true,
    queries: params,
  })

  return response
}

const GetTopFiveCritical = async (params?: { start_time: string | Date; end_time: string | Date }) => {
  const response: ApiResponse<TopFiveLatestCritical[]> = await get('top-five-critical', {
    withAuth: true,
    queries: params,
  })

  return response
}

export {
  GetCurrentSituation,
  GetTeamOverview,
  GetServiceOverview,
  GetMetricsOverview,
  GetChartsOverview,
  GetHealthScoreOverview,
  GetPieChartsOverview,
  GetTopServicesOverview,
  GetLatestCritical,
  GetTopFiveCritical,
}
