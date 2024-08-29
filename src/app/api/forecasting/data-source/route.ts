import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

export async function GET(_: NextApiRequest) {
  return NextResponse.json(
    {
      data: ['Data Source 1', 'Data Source 2', 'Data Source 3'],
      status_code: 200,
    },
    { status: 200 }
  )
}
