import { get } from '@/common/api'
import { PorductResponse } from '@/modules/models/global/product'

export const GetProducts = async () => {
  return await get<PorductResponse[]>('products', {
    withAuth: true,
  })
}
