export interface LoginRequest {
  pernr: string
  password: string
}

export interface LoginResponse {
  token: string
  username: string
  role: string
}
