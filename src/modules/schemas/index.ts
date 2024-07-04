import { LoginRequest } from '@/models/auth'
import { z as zod, ZodTypeAny } from 'zod'

export const LoginSchema: zod.ZodObject<
  {
    pernr: zod.ZodString
    password: zod.ZodString
  },
  'strip',
  ZodTypeAny,
  LoginRequest
> = zod.object({
  pernr: zod.string().min(1, { message: 'Pern is required' }),
  password: zod.string().min(1, { message: 'Password is required' }),
})

export type LoginValues = zod.infer<typeof LoginSchema>
