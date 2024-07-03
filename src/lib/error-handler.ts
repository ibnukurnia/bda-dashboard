import { redirect } from 'next/navigation'
import { ErrorResponse } from '@/common/api/type'

export const handleError = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message
  }

  return (err as ErrorResponse).message
}
