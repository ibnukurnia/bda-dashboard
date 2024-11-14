import { paths } from '@/paths'

import { ApiResponse, ErrorResponse } from './type'

const API_URL: string = process.env.NEXT_PUBLIC_API_URL ?? 'https://ops-vision.bri.co.id/api/'

type RequestOption = {
  queries?: Record<string, any>
  withAuth?: boolean
  signal?: AbortSignal
  isLocal?: boolean
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

  const response: Response = await fetch(`${!option?.isLocal ? API_URL : ''}${endpoint}`, {
    signal: option?.signal,
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

const downloadFile = async (endpoint: string, mimeType: string, filename: string, option?: RequestOption): Promise<void> => {
  const headers: Record<string, string> = {
    Accept: mimeType,
  };

  if (option?.queries !== undefined) {
    endpoint += buildQueryParam(option?.queries as Record<string, any>);
  }

  if (option?.withAuth) {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Unauthorized: No token found');
    }

    headers.Authorization = `Bearer ${token}`;
  }

  const response: Response = await fetch(`${!option?.isLocal ? API_URL : ''}${endpoint}`, {
    method: 'GET',
    headers: headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to download CSV: ${response.statusText}`);
  }

  // Create a blob from the response data
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename; // You can set the filename here
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

const buildQueryParam = (queries: Record<string, any>): string => {
  let param = ''
  const keys = Object.keys(queries)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const value = queries[key]

    if (value == null) continue
    if (value instanceof Array) {
      value.forEach((m, j) => {
        i === 0 && j === 0 ? (param += `?${key}=${m}`) : (param += `&${key}=${m}`)
      })
    } else {
      i === 0 ? (param += `?${key}=${value}`) : (param += `&${key}=${value}`)
    }
  }

  return param
}

const interceptor = (status: number) => {
  if (status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('filter')
    window.location.replace(paths.auth.signIn)
  }
}

export { get, post, downloadFile }
