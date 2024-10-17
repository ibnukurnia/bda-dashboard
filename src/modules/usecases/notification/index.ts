import { get } from '@/common/api'
import { ApiResponse, PaginatedResponse } from '@/common/api/type'


const GetNotificationList = async (params?: any) => {
    const response: ApiResponse<PaginatedResponse> = await get('notification/history', {
        withAuth: true,
        queries: params,
    })

    return response
}


export {
    GetNotificationList
}
