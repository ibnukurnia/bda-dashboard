import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

export async function GET(_: NextApiRequest) {
  return NextResponse.json(
    {
      data: [
        {
          title: '500',
          series: [
            {
              name: 'livik',
              data: [
                ['2024-08-23 13:41:10', 1],
                ['2024-08-23 13:41:11', 2],
                ['2024-08-23 13:41:12', 1],
                ['2024-08-23 13:41:13', 0],
                ['2024-08-23 13:41:14', 1],
                ['2024-08-23 13:41:15', 1],
                ['2024-08-23 13:41:16', 0],
                ['2024-08-23 13:41:17', 1],
                ['2024-08-23 13:41:18', 0],
                ['2024-08-23 13:41:19', 0],
              ],
              group: 'apexcharts-axis-0',
              unit: 'traffic per second',
            },
            {
              name: 'pochinkisaldo',
              data: [
                ['2024-08-23 13:41:10', 1],
                ['2024-08-23 13:41:11', 0],
                ['2024-08-23 13:41:12', 0],
                ['2024-08-23 13:41:13', 2],
                ['2024-08-23 13:41:14', 2],
                ['2024-08-23 13:41:15', 1],
                ['2024-08-23 13:41:16', 0],
                ['2024-08-23 13:41:17', 1],
                ['2024-08-23 13:41:18', 1],
                ['2024-08-23 13:41:19', 1],
              ],
              group: 'apexcharts-axis-0',
              unit: 'traffic per second',
            },

            {
              name: 'rozhok',
              data: [
                ['2024-08-23 13:41:10', 2],
                ['2024-08-23 13:41:11', 1],
                ['2024-08-23 13:41:12', 1],
                ['2024-08-23 13:41:13', 2],
                ['2024-08-23 13:41:14', 0],
                ['2024-08-23 13:41:15', 0],
                ['2024-08-23 13:41:16', 3],
                ['2024-08-23 13:41:17', 4],
                ['2024-08-23 13:41:18', 2],
                ['2024-08-23 13:41:19', 1],
              ],
              group: 'apexcharts-axis-0',
              unit: 'response(s)',
            },
            // { name: 'basharax-brimo', data: [], group: 'apexcharts-axis-0' },
            // { name: 'vikendi', data: [], group: 'apexcharts-axis-0' },
          ],
          categories: null,
          yaxisLabel: 'Response 500 per second',
        },
        {
          title: 'Trafic Per Second',
          series: [
            {
              name: 'livik',
              data: [
                ['2024-08-23 13:41:10', 4962],
                ['2024-08-23 13:41:11', 5122],
                ['2024-08-23 13:41:12', 7133],
                ['2024-08-23 13:41:13', 8001],
                ['2024-08-23 13:41:14', 5450],
                ['2024-08-23 13:41:15', 4962],
                ['2024-08-23 13:41:16', 5122],
                ['2024-08-23 13:41:17', 7133],
                ['2024-08-23 13:41:18', 8001],
                ['2024-08-23 13:41:19', 4450],
              ],
              group: 'apexcharts-axis-0',
            },
            {
              name: 'pochinkisaldo',
              data: [
                ['2024-08-23 13:41:10', 2233],
                ['2024-08-23 13:41:11', 1122],
                ['2024-08-23 13:41:12', 3322],
                ['2024-08-23 13:41:13', 5542],
                ['2024-08-23 13:41:14', 6879],
                ['2024-08-23 13:41:15', 4962],
                ['2024-08-23 13:41:16', 6898],
                ['2024-08-23 13:41:17', 7133],
                ['2024-08-23 13:41:18', 7766],
                ['2024-08-23 13:41:19', 4330],
              ],
              group: 'apexcharts-axis-0',
            },
            {
              name: 'rozhok',
              data: [
                ['2024-08-23 13:41:10', 4962],
                ['2024-08-23 13:41:11', 5122],
                ['2024-08-23 13:41:12', 7133],
                ['2024-08-23 13:41:13', 9001],
                ['2024-08-23 13:41:14', 5450],
                ['2024-08-23 13:41:15', 4962],
                ['2024-08-23 13:41:16', 5122],
                ['2024-08-23 13:41:17', 6133],
                ['2024-08-23 13:41:18', 7001],
                ['2024-08-23 13:41:19', 5450],
              ],
              group: 'apexcharts-axis-0',
            },
            // { name: 'basharax-brimo', data: [], group: 'apexcharts-axis-0' },
            // { name: 'vikendi', data: [], group: 'apexcharts-axis-0' },
          ],
          categories: null,
          yaxisLabel: 'Traffic per second',
        },
        {
          title: 'Max Response Time',
          series: [
            {
              name: 'livik',
              data: [
                ['2024-08-23 13:41:10', 212],
                ['2024-08-23 13:41:11', 333],
                ['2024-08-23 13:41:12', 299],
                ['2024-08-23 13:41:13', 221],
                ['2024-08-23 13:41:14', 432],
                ['2024-08-23 13:41:15', 333],
                ['2024-08-23 13:41:16', 411],
                ['2024-08-23 13:41:17', 212],
                ['2024-08-23 13:41:18', 588],
                ['2024-08-23 13:41:19', 422],
              ],
              group: 'apexcharts-axis-0',
            },
            {
              name: 'pochinkisaldo',
              data: [
                ['2024-08-23 13:41:10', 120],
                ['2024-08-23 13:41:11', 129],
                ['2024-08-23 13:41:12', 234],
                ['2024-08-23 13:41:13', 221],
                ['2024-08-23 13:41:14', 354],
                ['2024-08-23 13:41:15', 333],
                ['2024-08-23 13:41:16', 223],
                ['2024-08-23 13:41:17', 212],
                ['2024-08-23 13:41:18', 411],
                ['2024-08-23 13:41:19', 422],
              ],
              group: 'apexcharts-axis-0',
            },
            {
              name: 'rozhok',
              data: [
                ['2024-08-23 13:41:10', 233],
                ['2024-08-23 13:41:11', 221],
                ['2024-08-23 13:41:12', 222],
                ['2024-08-23 13:41:13', 239],
                ['2024-08-23 13:41:14', 334],
                ['2024-08-23 13:41:15', 333],
                ['2024-08-23 13:41:16', 411],
                ['2024-08-23 13:41:17', 212],
                ['2024-08-23 13:41:18', 331],
                ['2024-08-23 13:41:19', 422],
              ],
              group: 'apexcharts-axis-0',
            },
            // { name: 'basharax-brimo', data: [], group: 'apexcharts-axis-0' },
            // { name: 'vikendi', data: [], group: 'apexcharts-axis-0' },
          ],
          categories: null,
          yaxisLabel: 'Max response time (miliseconds)',
        },
        {
          title: 'P 99',
          series: [
            { name: 'livik', data: [], group: 'apexcharts-axis-0' },
            { name: 'pochinkisaldo', data: [], group: 'apexcharts-axis-0' },
            { name: 'rozhok', data: [], group: 'apexcharts-axis-0' },
            { name: 'basharax-brimo', data: [], group: 'apexcharts-axis-0' },
            { name: 'vikendi', data: [], group: 'apexcharts-axis-0' },
          ],
          categories: null,
        },
        {
          title: '200',
          series: [
            {
              name: 'livik',
              data: [
                ['2024-08-23 13:41:10', 4862],
                ['2024-08-23 13:41:11', 5022],
                ['2024-08-23 13:41:12', 7133],
                ['2024-08-23 13:41:13', 8001],
                ['2024-08-23 13:41:14', 5350],
                ['2024-08-23 13:41:15', 4942],
                ['2024-08-23 13:41:16', 5102],
                ['2024-08-23 13:41:17', 7123],
                ['2024-08-23 13:41:18', 8000],
                ['2024-08-23 13:41:19', 4250],
              ],
              group: 'apexcharts-axis-0',
            },
            {
              name: 'pochinkisaldo',
              data: [
                ['2024-08-23 13:41:10', 2233],
                ['2024-08-23 13:41:11', 1122],
                ['2024-08-23 13:41:12', 3322],
                ['2024-08-23 13:41:13', 5542],
                ['2024-08-23 13:41:14', 6879],
                ['2024-08-23 13:41:15', 4962],
                ['2024-08-23 13:41:16', 6898],
                ['2024-08-23 13:41:17', 7133],
                ['2024-08-23 13:41:18', 7766],
                ['2024-08-23 13:41:19', 4330],
              ],
              group: 'apexcharts-axis-0',
            },
            {
              name: 'rozhok',
              data: [
                ['2024-08-23 13:41:10', 4962],
                ['2024-08-23 13:41:11', 5122],
                ['2024-08-23 13:41:12', 7133],
                ['2024-08-23 13:41:13', 9001],
                ['2024-08-23 13:41:14', 5450],
                ['2024-08-23 13:41:15', 4962],
                ['2024-08-23 13:41:16', 5122],
                ['2024-08-23 13:41:17', 6133],
                ['2024-08-23 13:41:18', 7001],
                ['2024-08-23 13:41:19', 5450],
              ],
              group: 'apexcharts-axis-0',
            },
            // { name: 'basharax-brimo', data: [], group: 'apexcharts-axis-0' },
            // { name: 'vikendi', data: [], group: 'apexcharts-axis-0' },
          ],
          categories: null,
          yaxisLabel: 'Response 200 per second',
        },
        {
          title: '400',
          series: [
            {
              name: 'livik',
              data: [
                ['2024-08-23 13:41:10', 2],
                ['2024-08-23 13:41:11', 3],
                ['2024-08-23 13:41:12', 2],
                ['2024-08-23 13:41:13', 2],
                ['2024-08-23 13:41:14', 4],
                ['2024-08-23 13:41:15', 3],
                ['2024-08-23 13:41:16', 4],
                ['2024-08-23 13:41:17', 2],
                ['2024-08-23 13:41:18', 1],
                ['2024-08-23 13:41:19', 0],
              ],
              group: 'apexcharts-axis-0',
            },
            {
              name: 'pochinkisaldo',
              data: [
                ['2024-08-23 13:41:10', 1],
                ['2024-08-23 13:41:11', 2],
                ['2024-08-23 13:41:12', 2],
                ['2024-08-23 13:41:13', 2],
                ['2024-08-23 13:41:14', 0],
                ['2024-08-23 13:41:15', 2],
                ['2024-08-23 13:41:16', 3],
                ['2024-08-23 13:41:17', 2],
                ['2024-08-23 13:41:18', 4],
                ['2024-08-23 13:41:19', 0],
              ],
              group: 'apexcharts-axis-0',
            },
            {
              name: 'rozhok',
              data: [
                ['2024-08-23 13:41:10', 1],
                ['2024-08-23 13:41:11', 1],
                ['2024-08-23 13:41:12', 2],
                ['2024-08-23 13:41:13', 2],
                ['2024-08-23 13:41:14', 2],
                ['2024-08-23 13:41:15', 3],
                ['2024-08-23 13:41:16', 3],
                ['2024-08-23 13:41:17', 4],
                ['2024-08-23 13:41:18', 2],
                ['2024-08-23 13:41:19', 3],
              ],
              group: 'apexcharts-axis-0',
            },
            // { name: 'basharax-brimo', data: [], group: 'apexcharts-axis-0' },
            // { name: 'vikendi', data: [], group: 'apexcharts-axis-0' },
          ],
          categories: null,
          yaxisLabel: 'Response 400 per second',
        },
      ],
      status_code: 200,
    },
    { status: 200 }
  )
}
