import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

export async function GET(_: NextApiRequest) {
  return NextResponse.json(
    {
      data: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'],
      status_code: 200,
    },
    { status: 200 }
  )
}
