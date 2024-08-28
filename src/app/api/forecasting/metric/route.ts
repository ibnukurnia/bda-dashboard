import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

export async function GET(_: NextApiRequest) {
  return NextResponse.json(
    {
      data: ['Metric 1', 'Metric 2', 'Metric 3', 'Metric 4', 'Metric 5'],
      status_code: 200,
    },
    { status: 200 }
  )
}
