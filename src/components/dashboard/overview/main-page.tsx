'use client'

import React, { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'

import './main-page.css'

import { GetChartsOverview } from '@/modules/usecases/overviews'
import { Typography } from '@mui/material'
import { format } from 'date-fns'
import { Check, Minus, Plus } from 'react-feather'

import Button from '@/components/system/Button/Button'

import DropdownTime from './button/dropdown-time'
import DonutChart from './chart/donut-chart'
import DynamicUpdatingChart from './chart/dynamic-updating-chart'
import OverviewModal from './modal/overview-modal'
import TablePanel from './panels/table-panel'
import TableServices from './table/table-services'
import TableSeverity from './table/table-severity'

// Define your data
const sourceData = [
  {
    name: 'APM',
    count: 1865,
    services: [
      { name: 'Windows', count: 1625, data: [28, 70, 49, 80, 132, 129, 134, 80, 132, 129, 134] },
      { name: 'Linux', count: 1240, data: [28, 50, 124, 80, 132, 78, 134, 80, 132, 78, 134] },
    ],
  },
  {
    name: 'BRIMO',
    count: 1862,
    services: [
      { name: 'Windows', count: 1102, data: [28, 133, 124, 127, 132, 129, 134] }, // Same service name as APM
      { name: 'XY', count: 1580, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'PROMETHEUS API',
    count: 1567,
    services: [
      { name: 'Winqowdkoqk', count: 980, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Z/OS System', count: 587, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'PROMETHEUS DB',
    count: 1567,
    services: [
      { name: 'Winqowdkoqk', count: 980, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Z/OS System', count: 587, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'PANW',
    count: 684,
    services: [
      { name: 'Server', count: 450, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Processor', count: 234, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'WAF',
    count: 684,
    services: [
      { name: 'Server', count: 450, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Processor', count: 234, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'FORTI',
    count: 684,
    services: [
      { name: 'Server', count: 450, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Processor', count: 234, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'IVAT',
    count: 684,
    services: [
      { name: 'Server', count: 450, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Processor', count: 234, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'IRIS',
    count: 684,
    services: [
      { name: 'Server', count: 450, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Processor', count: 234, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'PRTG',
    count: 684,
    services: [
      { name: 'Server', count: 450, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Processor', count: 234, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'ZABBIX',
    count: 684,
    services: [
      { name: 'Server', count: 450, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Processor', count: 234, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
]

const dates = [
  'Jan 21',
  'Jan 22',
  'Jan 23',
  'Jan 24',
  'Jan 25',
  'Jan 26',
  'Jan 27',
  'Jan 28',
  'Jan 29',
  'Jan 30',
  'Jan 31',
]

const toMiliseconds = 1000 * 60

const defaultTimeRanges: Record<string, number> = {
  'Last 5 minutes': 5 * toMiliseconds,
  'Last 15 minutes': 15 * toMiliseconds,
  'Last 30 minutes': 30 * toMiliseconds,
  'Last 1 hours': 60 * toMiliseconds,
  'Last 6 hours': 360 * toMiliseconds,
  'Last 24 hours': 1440 * toMiliseconds,
}

const MainPageOverview = () => {
  const [selectedDataSource, setSelectedDataSource] = useState<any[]>([])
  const [selectedServices, setSelectedServices] = useState<{ name: string; data: number[]; count?: number }[]>([])
  const [modalServices, setModalServices] = useState(false)
  const [modalSeverity, setModalSeverity] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const [timeRanges, setTimeRanges] = useState<Record<string, number>>(defaultTimeRanges)
  const [selectedRange, setSelectedRange] = useState<string>('Last 15 minutes')
  const [chartData, setChartData] = useState<any[]>([])
  const mainRef = useRef<HTMLDivElement>(null)

  const dummyData = [
    {
      title: 'Aplikasi BRIMO',
      data: [
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
      ],
    },
    {
      title: 'Database',
      data: [
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
      ],
    },
    {
      title: 'OpenShift Platform',
      data: [
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
      ],
    },
    {
      title: 'Network',
      data: [
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
      ],
    },
    {
      title: 'Security',
      data: [
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
      ],
    },
  ]

  const handleApplyFilter = (sDataSource: any[], sService: { name: string; data: number[]; count?: number }[]) => {
    setSelectedDataSource(sDataSource)
    setSelectedServices(sService)
    setModalServices(false)
  }

  useEffect(() => {
    GetChartsOverview()
      .then((res) => {
        setChartData(res.data)
      })
      .catch(() => setChartData([]))

    const intervalChartId = setInterval(() => {
      GetChartsOverview()
        .then((res) => {
          setChartData(res.data)
        })
        .catch(() => setChartData([]))
    }, 10000)

    return () => {
      clearInterval(intervalChartId)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setModalServices(false) // Close the panel when clicking outside of it
      }
    }

    if (modalServices) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [modalServices])

  const thSeverity = ['Severity', 'Count']
  const severityData = [
    { severity: 'Critical', count: 0, color: 'bg-red-600' },
    { severity: 'Major', count: 3, color: 'bg-orange-600' },
    { severity: 'Minor', count: 2, color: 'bg-yellow-400' },
    { severity: 'OK', count: 1, color: 'bg-green-600' },
  ]

  const thServices = ['Top Services', 'Health Score', 'Event Trend']
  const configDataKey = ['name', 'health_score', 'event_trend']
  const servicesData = [
    {
      name: 'APM',
      health_score: 30,
      event_trend: '5%',
      event_trend_up: true,
    },
    {
      name: 'BRIMO',
      health_score: 70,
      event_trend: '10%',
      event_trend_up: true,
    },
    {
      name: 'PROMETHEUS DB',
      health_score: 65,
      event_trend: '12%',
      event_trend_up: true,
    },
  ]

  return (
    <div className="flex flex-row" ref={mainRef}>
      <div className="flex-1 grid gap-8">
        <div className="chart-section">
          {/* {dummyData.map((item, id) => { */}
          {chartData.map((item, id) => {
            return (
              <div className={`chart-section-col chart-section-col-${id + 1}`} key={id}>
                <DynamicUpdatingChart title={item.title} series={item.data} id={id} />
              </div>
            )
          })}
        </div>
        <div className="flex gap-3 items-center justify-between card">
          <div className="flex gap-4 items-center">
            <span className="text-2xl text-white font-bold">Filter</span>
            <DropdownTime
              timeRanges={timeRanges}
              // onRangeChange={handleRangeChange}
              // selectedRange={selectedRange}
              onRangeChange={(e) => {
                setSelectedRange(e)
                // console.log(new Date(new Date().setSeconds(0, 0)).getTime() + timeRanges[e], 'ini')
                console.log(format(new Date(new Date().setSeconds(0, 0)).getTime(), 'yyyy-MM-dd HH:mm:ss'), 'ini end')
                console.log(
                  format(new Date(new Date().setSeconds(0, 0)).getTime() - timeRanges[e], 'yyyy-MM-dd HH:mm:ss'),
                  'ini start'
                )
              }}
              selectedRange={selectedRange}
            />
          </div>
          <span className="font-bold text-white">Updated at 5:21:11 PM</span>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {/* <div className="grid grid-cols-2 gap-4"> */}
          <div className="flex flex-col gap-4 card">
            <span className="font-bold text-white text-2xl">Services Overview</span>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <DonutChart
                  series={severityData.map((item) => item.count)}
                  labels={severityData.map((sditem) => sditem.severity)}
                />
                <TableSeverity
                  tableHeader={thSeverity}
                  data={severityData}
                  onClickSeverity={(e) => setModalSeverity(true)}
                />
              </div>
              <TableServices data={servicesData} tableHeader={thServices} dataKeys={configDataKey} />
            </div>
          </div>
          {/* <div className="flex flex-col gap-4">
            <span className="font-bold text-white">Severity Detail</span>
            <TablePanel
              selectedServices={selectedServices}
              handleAddServices={() => setModalServices(!modalServices)}
            />
          </div> */}
        </div>
        <div className="flex flex-col gap-4 card">
          <span className="font-bold text-white text-2xl">Showing {selectedServices.length} Services</span>
          <TablePanel selectedServices={selectedServices} handleAddServices={() => setModalServices(!modalServices)} />
        </div>
      </div>
      {modalServices && (
        <OverviewModal
          open={modalServices}
          listDataSource={sourceData}
          handleOpenModal={setModalServices}
          handleApplyFilter={handleApplyFilter}
          prevSelectedDataSource={selectedDataSource}
          prevSelectedServices={selectedServices}
        />
      )}
    </div>
  )
}

export default MainPageOverview
