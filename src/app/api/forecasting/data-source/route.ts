import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

export async function GET(_: NextApiRequest) {
  return NextResponse.json(
    {
      data: ['brimo', 'apm'],
      status_code: 200,
    },
    { status: 200 }
  )
}
