import { useRouter } from 'next/navigation'

import { paths } from '@/paths'

import { ApiResponse, ErrorResponse } from './type'

const API_URL: string = process.env.NEXT_PUBLIC_API_URL as ''

type RequestOption = {
  queries?: Record<string, any>
  withAuth?: boolean
}

const get = async <T>(endpoint: string, option?: RequestOption): Promise<ApiResponse<T>> => {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (option?.queries !== undefined) {
    endpoint += buildQueryParam(option?.queries as Record<string, any>)
  }

  if (option?.withAuth) {
    const token = localStorage.getItem('token')

    // handle by creating intercept
    if (!token) {
      return {
        status: 401,
        message: 'unauthorize',
        valid: false,
        data: null,
      }
    }

    headers.Authorization = `Bearer ${token}`
  }

  const response: Response = await fetch(`${API_URL}${endpoint}`, {
    method: 'GET',
    headers: headers,
  })

  const resJson: ApiResponse<T> = (await response.json()) as ApiResponse<T>

  interceptor(resJson.status)

  if (!resJson.valid) {
    throw {
      status: resJson.status,
      message: resJson.message,
    } as ErrorResponse
  }

  return {
    status: resJson.status,
    message: resJson.message,
    data: resJson.data,
    valid: resJson.valid,
  }
}

const post = async <T extends object, K>(endpoint: string, body: T): Promise<ApiResponse<K>> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  })

  const resJson: ApiResponse<K> = (await response.json()) as ApiResponse<K>

  interceptor(resJson.status)

  if (!resJson.valid) {
    throw {
      status: resJson.status,
      message: resJson.message,
    } as ErrorResponse
  }

  return {
    status: resJson.status,
    message: resJson.message,
    data: resJson.data,
    valid: resJson.valid,
  }
}

const buildQueryParam = (queries: Record<string, any>): string => {
  let param = ''
  const keys = Object.keys(queries)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const value = queries[key]

    i === 0 ? (param += `?${key}=${value}`) : (param += `&${key}=${value}`)
  }

  return param
}

const interceptor = (status: number) => {
  if (status === 401) {
    localStorage.removeItem('token')
    window.location.replace(paths.auth.signIn)
  }
}

export { get, post }
