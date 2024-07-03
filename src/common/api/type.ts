export interface ApiResponse<T> {
  data: T | null
  status: number
  message: string
  valid: boolean
}

export interface PaginatedResponse<T> {
  rows: T[]
  page: number
  total_rows: number
  total_pages: number
}

export interface ErrorResponse extends Error {
  status: number
  message: string
}
