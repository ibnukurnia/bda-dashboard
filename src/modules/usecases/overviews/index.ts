import { get } from '@/common/api'
import { ApiResponse } from '@/common/api/type'
import { InsightOverviewResponse, ServiceOverviewResponse, TeamOverviewResponse, MetricsOverviewResponse } from '@/modules/models/overviews'

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

export { GetCurrentSituation, GetTeamOverview, GetServiceOverview, GetMetricsOverview }
