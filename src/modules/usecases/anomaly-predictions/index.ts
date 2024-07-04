import { get } from '@/common/api'
import { ApiResponse, PaginatedResponse } from '@/common/api/type'
import { HistoricalAnomalyResponse } from '@/modules/models/anomaly-predictions'

const GetHistoricalAmonalies = async () => {
  const response: ApiResponse<PaginatedResponse<HistoricalAnomalyResponse>> = await get('anomaly-predictions', {
    withAuth: true,
  })

  return response
}

export { GetHistoricalAmonalies }
