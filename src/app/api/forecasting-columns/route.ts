import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

export async function GET(_: NextApiRequest) {
  return NextResponse.json(
    {
      data: [
        { id: 'timestamp_s', header: 'Timestamp', accessorKey: 'timestamp_s' },
        { id: 'service_name', header: 'Service Name', accessorKey: 'service_name' },
        { id: 'tps_apm', header: 'Traffic Per Second', accessorKey: 'tps_apm' },
        { id: 'max_rt', header: 'Max Response Time', accessorKey: 'max_rt' },
        { id: 'p99_rt', header: 'P 99', accessorKey: 'p99_rt' },
        { id: 'count_success_200', header: '200', accessorKey: 'count_success_200' },
        { id: 'count_error_400', header: '400', accessorKey: 'count_error_400' },
        { id: 'count_error_500', header: '500', accessorKey: 'count_error_500' },
      ],
      status_code: 200,
    },
    { status: 200 }
  )
}
