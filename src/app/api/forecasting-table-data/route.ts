import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const page = params.get('page') ? Number(params.get('page')) : 0
  const limit = params.get('limit') ? Number(params.get('limit')) : 0
  const data = [
    {
      timestamp_s: '2024-08-22 15:34:47',
      service_name: 'chumacera',
      tps_apm: 1,
      max_rt: 88.768,
      p99_rt: 88.77,
      count_success_200: 1,
      count_error_400: 0,
      count_error_500: 0,
    },
    {
      timestamp_s: '2024-08-22 15:34:47',
      service_name: 'hotspring',
      tps_apm: 24,
      max_rt: 8.942,
      p99_rt: 8.93,
      count_success_200: 24,
      count_error_400: 0,
      count_error_500: 0,
    },
    {
      timestamp_s: '2024-08-22 15:34:47',
      service_name: 'impala',
      tps_apm: 33,
      max_rt: 137.975,
      p99_rt: 127.72,
      count_success_200: 33,
      count_error_400: 0,
      count_error_500: 0,
    },
    {
      timestamp_s: '2024-08-22 15:34:47',
      service_name: 'primorsk',
      tps_apm: 1,
      max_rt: 4.657,
      p99_rt: 4.66,
      count_success_200: 1,
      count_error_400: 0,
      count_error_500: 0,
    },
    {
      timestamp_s: '2024-08-22 15:34:47',
      service_name: 'livik',
      tps_apm: 835,
      max_rt: 8.382,
      p99_rt: 4.83,
      count_success_200: 835,
      count_error_400: 0,
      count_error_500: 0,
    },
    {
      timestamp_s: '2024-08-22 15:34:47',
      service_name: 'eredar',
      tps_apm: 4,
      max_rt: 8.172,
      p99_rt: 8.12,
      count_success_200: 4,
      count_error_400: 0,
      count_error_500: 0,
    },
    {
      timestamp_s: '2024-08-22 15:34:47',
      service_name: 'dazzle',
      tps_apm: 1,
      max_rt: 21.276,
      p99_rt: 21.28,
      count_success_200: 1,
      count_error_400: 0,
      count_error_500: 0,
    },
    {
      timestamp_s: '2024-08-22 15:34:47',
      service_name: 'vikendi-replica',
      tps_apm: 68,
      max_rt: 10.109,
      p99_rt: 9.77,
      count_success_200: 68,
      count_error_400: 0,
      count_error_500: 0,
    },
    {
      timestamp_s: '2024-08-22 15:34:47',
      service_name: 'torreahumada',
      tps_apm: 3,
      max_rt: 33.318,
      p99_rt: 33.04,
      count_success_200: 3,
      count_error_400: 0,
      count_error_500: 0,
    },
    {
      timestamp_s: '2024-08-22 15:34:47',
      service_name: 'pudge',
      tps_apm: 3,
      max_rt: 3.762,
      p99_rt: 3.75,
      count_success_200: 3,
      count_error_400: 0,
      count_error_500: 0,
    },
  ]

  const returnedData = (offset: number, limit: number) => {
    const sliceStart = limit * (offset - 1)
    const sliceEnd = limit * offset

    return data.slice(sliceStart, sliceEnd)
  }

  return NextResponse.json(
    {
      data: returnedData(page, limit),
      pagination: {
        currentPage: page,
        totalPage: Math.ceil(data.length / limit),
      },
      status_code: 200,
    },
    { status: 200 }
  )
}
