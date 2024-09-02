import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

export async function GET(_: NextApiRequest) {
  return NextResponse.json(
    {
      data: [
        {
          label: 'Stats 1',
          value: 500,
          unit: 'unit1',
        },
        {
          label: 'Stats 2',
          value: 120,
          unit: 'unit2',
        },
        {
          label: 'Stats 3',
          value: 100,
          unit: 'unit3',
        },
      ],
      status_code: 200,
    },
    { status: 200 }
  )
}
