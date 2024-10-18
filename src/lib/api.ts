import { get } from '@/common/api'
import { ApiResponse, PaginatedResponse } from '@/common/api/type'
import { AnomalyOptionResponse, ServicesOptionResponse } from '@/modules/models/anomaly-predictions'

// lib/api.ts
export interface TimeRangeOption {
  label: string
  value: number
}

export interface CheckboxOption {
  id: string // Corresponds to the "name" field in the API response
  label: string // Corresponds to the "comment" field in the API response
  type: string // Corresponds to the "type" field in the API response
}

export const fetchTimeRanges = async (): Promise<TimeRangeOption[]> => {
  try {
    const response = await fetch('/api/time-ranges')
    if (!response.ok) {
      throw new Error('Failed to fetch time ranges')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching time ranges:', error)
    throw error
  }
}

export const fetchAnomalyOption = async (table: string = 'apm'): Promise<ApiResponse<AnomalyOptionResponse>> => {
  const response: ApiResponse<AnomalyOptionResponse> = await get(`anomaly-predictions/filter-column?table=${table}`, {
    withAuth: true,
  })

  return response
}

export const fetchServicesOption = async (payload: {
  type: string
  start_time: string
  end_time: string
}): Promise<ApiResponse<ServicesOptionResponse>> => {
  const response: ApiResponse<ServicesOptionResponse> = await get(`log-services`, {
    withAuth: true,
    queries: payload,
  })

  return response
}

export const fetchSolarWindsNetworkOption = async (payload: {
  start_time: string
  end_time: string
}): Promise<ApiResponse<string[]>> => {
  const response: ApiResponse<string[]> = await get(`list-identifier/solarwinds/network`, {
    withAuth: true,
    queries: payload,
  })

  return response
}

export const fetchSolarWindsNodeOption = async (payload: {
  start_time: string
  end_time: string
}): Promise<ApiResponse<string[]>> => {
  const response: ApiResponse<string[]> = await get(`list-identifier/solarwinds/node_name`, {
    withAuth: true,
    queries: payload,
  })

  return response
}

export const fetchSolarWindsInterfaceOption = async (payload: {
  start_time: string
  end_time: string
}): Promise<ApiResponse<string[]>> => {
  const response: ApiResponse<string[]> = await get(`list-identifier/solarwinds/interface_name`, {
    withAuth: true,
    queries: payload,
  })

  return response
}

export const fetchDnsDomainOption = async (payload: {
  start_time: string
  end_time: string
}): Promise<ApiResponse<string[]>> => {
  const response: ApiResponse<string[]> = await get(`list-identifier/dns_rt/domain`, {
    withAuth: true,
    queries: payload,
  })

  return response
}
export const fetchDnsCategoryOption = async (payload: {
  start_time: string
  end_time: string
}): Promise<ApiResponse<string[]>> => {
  const response: ApiResponse<string[]> = await get(`list-identifier/dns_rt/category`, {
    withAuth: true,
    queries: payload,
  })

  return response
}

export const fetchPrtgTrafficDeviceOption = async (payload: {
  start_time: string
  end_time: string
}): Promise<ApiResponse<string[]>> => {
  const response: ApiResponse<string[]> = await get(`list-identifier/prtg_traffic/device`, {
    withAuth: true,
    queries: payload,
  })

  return response
}
export const fetchPrtgTrafficSensorOption = async (payload: {
  start_time: string
  end_time: string
}): Promise<ApiResponse<string[]>> => {
  const response: ApiResponse<string[]> = await get(`list-identifier/prtg_traffic/sensor`, {
    withAuth: true,
    queries: payload,
  })

  return response
}
