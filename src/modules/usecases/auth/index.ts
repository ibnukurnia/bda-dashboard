import { post } from '@/common/api'
import { LoginRequest, LoginResponse } from '@/models/auth'

const LoginUsecase = async (request: LoginRequest) => {
  const response = await post<LoginRequest, LoginResponse>('login', { data: request });
  if (response.valid) {
    localStorage.setItem('token', response.data?.token as string);
    localStorage.setItem('username', response.data?.username as string);
  }
  return response;
};



export { LoginUsecase }
