import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams

  if (params.get('data_source') === 'brimo') {
    return NextResponse.json(
      {
        data: ['mylta-brimo'],
        status_code: 200,
      },
      { status: 200 }
    )
  } else {
    return NextResponse.json(
      {
        data: ['mylta-service', 'rozhok-service', 'chumachera-service'],
        status_code: 200,
      },
      { status: 200 }
    )
  }
}
