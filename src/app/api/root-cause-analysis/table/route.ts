import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const page = params.get('page') ? Number(params.get('page')) : 0
  const limit = params.get('limit') ? Number(params.get('limit')) : 0
  const columns = [
    {
        title: "Date",
        key: "timestamp_m"
    },
    {
        title: "Service Name",
        key: "service_name"
    },
    {
        title: "Transaction Per Second",
        key: "tps_apm"
    },
    {
        title: "Max Response Time",
        key: "max_rt"
    },
    {
        title: "P99",
        key: "p99_rt"
    },
    {
        title: "Status 200",
        key: "count_success_200"
    },
    {
        title: "Status 400",
        key: "count_error_400"
    },
    {
        title: "Status 500",
        key: "count_error_500"
    },
    {
        title: "Error Rate",
        key: "error_rate"
    }
  ]
  const data = [
    {
        count_error_400: 25,
        count_error_500: 0,
        count_success_200: 110478,
        error_rate: 0.0002,
        max_rt: 61.88,
        p99_rt: 5.96,
        service_name: "vikendi",
        timestamp_m: "2024-09-05 01:14:00",
        tps_apm: 110503
    },
    {
        count_error_400: 2,
        count_error_500: 0,
        count_success_200: 2471,
        error_rate: 0.0008,
        max_rt: 8.4,
        p99_rt: 3.19,
        service_name: "livik-trx-log",
        timestamp_m: "2024-09-05 01:14:00",
        tps_apm: 2473
    },
    {
        count_error_400: 0,
        count_error_500: 1,
        count_success_200: 144,
        error_rate: 0.0069,
        max_rt: 1528.43,
        p99_rt: 1380.56,
        service_name: "torreahumada",
        timestamp_m: "2024-09-05 01:14:00",
        tps_apm: 145
    },
    {
        count_error_400: 2,
        count_error_500: 0,
        count_success_200: 81337,
        error_rate: 0,
        max_rt: 1008.38,
        p99_rt: 6.54,
        service_name: "livik",
        timestamp_m: "2024-09-05 01:14:00",
        tps_apm: 81339
    },
    {
        count_error_400: 11,
        count_error_500: 0,
        count_success_200: 47353,
        error_rate: 0.0002,
        max_rt: 589.95,
        p99_rt: 5.95,
        service_name: "vikendi",
        timestamp_m: "2024-09-05 01:12:00",
        tps_apm: 47364
    },
    {
        count_error_400: 0,
        count_error_500: 1,
        count_success_200: 105,
        error_rate: 0.0094,
        max_rt: 1426.8,
        p99_rt: 819.44,
        service_name: "torreahumada",
        timestamp_m: "2024-09-05 01:12:00",
        tps_apm: 106
    },
    {
        count_error_400: 1,
        count_error_500: 0,
        count_success_200: 34820,
        error_rate: 0,
        max_rt: 1042.36,
        p99_rt: 6.37,
        service_name: "livik",
        timestamp_m: "2024-09-05 01:12:00",
        tps_apm: 34821
    },
    {
        count_error_400: 9,
        count_error_500: 0,
        count_success_200: 102194,
        error_rate: 0.0001,
        max_rt: 515.54,
        p99_rt: 5.81,
        service_name: "vikendi",
        timestamp_m: "2024-09-05 01:09:00",
        tps_apm: 102203
    },
    {
        count_error_400: 0,
        count_error_500: 0,
        count_success_200: 25,
        error_rate: 0,
        max_rt: 5159.94,
        p99_rt: 3953.28,
        service_name: "erangel-investasi",
        timestamp_m: "2024-09-05 01:09:00",
        tps_apm: 25
    },
    {
        count_error_400: 0,
        count_error_500: 3,
        count_success_200: 313,
        error_rate: 0.0095,
        max_rt: 2944.48,
        p99_rt: 1790.61,
        service_name: "torreahumada",
        timestamp_m: "2024-09-05 01:09:00",
        tps_apm: 316
    },
    {
        count_error_400: 0,
        count_error_500: 1,
        count_success_200: 332,
        error_rate: 0.003,
        max_rt: 1368.87,
        p99_rt: 1121.21,
        service_name: "ferrypier",
        timestamp_m: "2024-09-05 01:28:00",
        tps_apm: 333
    },
    {
        count_error_400: 0,
        count_error_500: 5,
        count_success_200: 147,
        error_rate: 0.0329,
        max_rt: 2138.4,
        p99_rt: 1883.65,
        service_name: "torreahumada",
        timestamp_m: "2024-09-05 01:28:00",
        tps_apm: 152
    },
    {
        count_error_400: 2,
        count_error_500: 0,
        count_success_200: 36632,
        error_rate: 0.0001,
        max_rt: 29.94,
        p99_rt: 6.32,
        service_name: "livik",
        timestamp_m: "2024-09-05 01:28:00",
        tps_apm: 36634
    },
    {
        count_error_400: 5,
        count_error_500: 0,
        count_success_200: 43281,
        error_rate: 0.0001,
        max_rt: 627.33,
        p99_rt: 6.04,
        service_name: "vikendi",
        timestamp_m: "2024-09-05 01:28:00",
        tps_apm: 43286
    },
    {
        count_error_400: 0,
        count_error_500: 0,
        count_success_200: 34,
        error_rate: 0,
        max_rt: 7355.38,
        p99_rt: 5208.8,
        service_name: "higos",
        timestamp_m: "2024-09-05 01:28:00",
        tps_apm: 34
    },
    {
        count_error_400: 0,
        count_error_500: 1,
        count_success_200: 332,
        error_rate: 0.003,
        max_rt: 1368.87,
        p99_rt: 1121.21,
        service_name: "ferrypier",
        timestamp_m: "2024-09-05 01:28:00",
        tps_apm: 333
    },
    {
        count_error_400: 0,
        count_error_500: 5,
        count_success_200: 147,
        error_rate: 0.0329,
        max_rt: 2138.4,
        p99_rt: 1883.65,
        service_name: "torreahumada",
        timestamp_m: "2024-09-05 01:28:00",
        tps_apm: 152
    },
    {
        count_error_400: 2,
        count_error_500: 0,
        count_success_200: 36632,
        error_rate: 0.0001,
        max_rt: 29.94,
        p99_rt: 6.57,
        service_name: "livik",
        timestamp_m: "2024-09-05 01:28:00",
        tps_apm: 36634
    },
    {
        count_error_400: 10,
        count_error_500: 0,
        count_success_200: 55097,
        error_rate: 0.0002,
        max_rt: 55.16,
        p99_rt: 5.12,
        service_name: "vikendi",
        timestamp_m: "2024-09-05 01:27:00",
        tps_apm: 55107
    },
    {
        count_error_400: 0,
        count_error_500: 0,
        count_success_200: 422,
        error_rate: 0,
        max_rt: 5149.99,
        p99_rt: 4319.91,
        service_name: "montenuevo",
        timestamp_m: "2024-09-05 01:27:00",
        tps_apm: 422
    }
  ]

  const returnedData = (offset: number, limit: number) => {
    const sliceStart = limit * (offset - 1)
    const sliceEnd = limit * offset

    return data.slice(sliceStart, sliceEnd)
  }

  return NextResponse.json(
    {
      columns: columns,
      rows: returnedData(page, limit),
      page: page,
      totalPage: Math.ceil(data.length / limit),
      status_code: 200,
    },
    { status: 200 }
  )
}
