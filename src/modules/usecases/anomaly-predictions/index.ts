import { get } from '@/common/api'
import { ApiResponse, PaginatedResponse } from '@/common/api/type'
import { CheckboxOptionResponse, HistoricalAnomalyLogApmResponse, HistoricalAnomalyLogBrimoResponse, HistoricalAnomalyNetworkResponse, HistoricalAnomalySecurityResponse, HistoricalAnomalyUtilizationResponse } from "@/modules/models/anomaly-predictions"

const GetHistoricalLogAnomalies = async (type: string, limit: number, page: number) => {
  const response: ApiResponse<PaginatedResponse> = await get(`anomaly-predictions?type=${type}&limit=${limit}&page${page}`, {
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

const GetFetchCheckboxes = async (): Promise<ApiResponse<CheckboxOptionResponse>> => {
  const response: ApiResponse<CheckboxOptionResponse> = await get('anomaly-predictions/filter-column', {
    withAuth: true,
  });

  return response;
};


export { GetHistoricalLogAnomalies, GetHistoricalNetworkAnomalies, GetHistoricalSecurityAnomalies, GetHistoricalUtilizationAnomalies, GetFetchCheckboxes }
