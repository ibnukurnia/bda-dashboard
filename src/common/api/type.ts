export interface ApiResponse<T> {
  data: T | null
  status: number
  message: string
  valid: boolean
}

export interface PaginatedResponse {
  rows: any
  page: number
  total_rows: number
  total_pages: number
  columns: { title: string, key: string }[]
  highlights?: string[][]
}

export interface ErrorResponse extends Error {
  status: number
  message: string
}
