import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

export async function GET(_: NextApiRequest) {
  return NextResponse.json(
    {
      data: ['Service 1', 'Service 2', 'Service 3', 'Service 4', 'Service 5','Service 6'],
      status_code: 200,
    },
    { status: 200 }
  )
}
