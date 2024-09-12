import { get } from '@/common/api'
import { ApiResponse } from '@/common/api/type';
import { RootCauseAnalysisTreeResponse } from '@/modules/models/root-cause-analysis';

const GetRootCauseAnalysisTree = async (params: { start_time: string; end_time: string }) => {
  let endPoint = `rca`

  const response: ApiResponse<RootCauseAnalysisTreeResponse[]> = await get(endPoint, {
    withAuth: true,
    queries: params,
  })

  return response
}

const GetRootCauseAnalysisTableData = async (params: { page: number; limit: number }) => {
  const response = await fetch(`/api/root-cause-analysis/table?page=${params.page}&limit=${params.limit}`, {
    method: 'GET',
  })
  
  const resJson = await response.json()

  return resJson
}

export {
  GetRootCauseAnalysisTree,
  GetRootCauseAnalysisTableData,
}
