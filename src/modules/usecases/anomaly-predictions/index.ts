import { get } from '@/common/api'
import { ApiResponse, PaginatedResponse } from '@/common/api/type'
import { AnomalyOptionResponse, HistoricalAnomalyNetworkResponse, HistoricalAnomalySecurityResponse, HistoricalAnomalyUtilizationResponse } from "@/modules/models/anomaly-predictions"

const GetHistoricalLogAnomalies = async (type: string, limit: number, page: number, filterAnomaly: string[], filterServices: string[], date_range: number) => {
  let endPoint = `anomaly-predictions?type=${type}&limit=${limit}&page=${page}&date_range=${date_range}`

  filterAnomaly.forEach(f => {
    endPoint += `&filters=${f}`
  });

  filterServices.forEach(f => {
    endPoint += `&service_name=${f}`
  });

  const response: ApiResponse<PaginatedResponse> = await get(endPoint, {
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
  });

  return response;
};


export { GetHistoricalLogAnomalies, GetHistoricalNetworkAnomalies, GetHistoricalSecurityAnomalies, GetHistoricalUtilizationAnomalies, GetFetchAnomalyOption }
