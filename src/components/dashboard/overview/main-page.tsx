'use client'

import React, { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'

import './main-page.css'

import { Typography } from '@mui/material'
import { Plus } from 'react-feather'

import Button from '@/components/system/Button/Button'

import DropdownTime from './button/dropdown-time'
import DynamicUpdatingChart from './chart/dynamic-updating-chart'
import OverviewModal from './modal/overview-modal'

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
const defaultTimeRanges: Record<string, number> = {
  'Last 5 minutes': 5,
  'Last 15 minutes': 15,
  'Last 30 minutes': 30,
  'Last 1 hours': 60,
  'Last 6 hours': 360,
  'Last 24 hours': 1440,
  'Last 3 days': 4320,
  'Last 1 week': 10080,
  'Last 1 month': 43800,
}

const TablePanel = ({
  selectedServices,
  handleAddServices,
}: {
  selectedServices: { name: string; data: number[]; count?: number }[]
  handleAddServices: () => void
}) => {
  const [timeRanges, setTimeRanges] = useState<Record<string, number>>(defaultTimeRanges)
  const [selectedRange, setSelectedRange] = useState<string>('Last 15 minutes')
  const [firstThWidth, setFirstThWidth] = useState(0)
  const [scrollXTable, setScrollXTable] = useState(0)
  const containerTableRef = useRef<HTMLDivElement>(null)
  const firstThRef = useRef<HTMLTableHeaderCellElement>(null)

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

  useLayoutEffect(() => {
    const resWidth = firstThRef.current?.offsetWidth
    setFirstThWidth(resWidth ?? 0)
  }, [])

  return (
    <div className="flex-1 px-4 grid gap-8">
      <div className="chart-section">
        {dummyData.map((item, id) => (
          <div className="chart-section-col">
            <DynamicUpdatingChart title={item.title} series={item.data} key={id} />
          </div>
        ))}
      </div>
      <div>
        <div className="flex justify-between items-center mb-4 text-white">
          <span className="font-bold">Showing {selectedServices.length} Services</span>
          <div className="flex gap-3 items-center">
            <span className="font-bold">Updated at 5:21:11 PM</span>
            <DropdownTime
              timeRanges={timeRanges}
              // onRangeChange={handleRangeChange}
              // selectedRange={selectedRange}
              onRangeChange={(e) => null}
              selectedRange={selectedRange}
            />
          </div>
        </div>
        <div className="relative grid">
          {scrollXTable > 0 && (
            <button
              className={`absolute bg-blue-600 text-xs z-10 top-1/2 left-[${firstThWidth}px] text-white px-2 py-1 opacity-50 hover:opacity-100 rounded-md`}
              onClick={() => containerTableRef.current?.scrollTo({ left: 0, behavior: 'smooth' })}
            >
              {'<'}
            </button>
          )}
          {containerTableRef.current?.scrollWidth &&
            containerTableRef.current?.clientWidth &&
            scrollXTable < containerTableRef.current?.scrollWidth - containerTableRef.current?.clientWidth && (
              <button
                className="absolute bg-blue-600 text-xs z-10 top-1/2 right-0 text-white px-2 py-1 opacity-50 hover:opacity-100 rounded-md"
                onClick={() =>
                  containerTableRef.current?.scrollTo({
                    left: containerTableRef.current?.scrollWidth - containerTableRef.current?.clientWidth,
                    behavior: 'smooth',
                  })
                }
              >
                {'>'}
              </button>
            )}
          <div
            ref={containerTableRef}
            onScroll={() => setScrollXTable(containerTableRef.current?.scrollLeft ?? 0)}
            className="overflow-auto scrollbar-table"
          >
            <table className="w-full table-auto text-white">
              <thead>
                <tr>
                  <th className="p-3" ref={firstThRef}>
                    <Button onClick={handleAddServices}>
                      <Plus size={'16px'} />
                      <Typography>Add services</Typography>
                    </Button>
                  </th>
                  {dates.map((date) => (
                    <th key={date} className="p-3">
                      {date}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedServices.length > 0 ? (
                  selectedServices.map((service, index) => (
                    <Fragment key={index}>
                      <tr key={index} className="">
                        <td className="p-3 min-w-64 align-center flex justify-between gap-2">
                          <Typography>{service.name}</Typography>
                          <div className="flex">
                            <span className="bg-blue-500 text-white rounded-lg px-2 h-fit">{service.count}</span>
                          </div>
                        </td>
                        {service.data.map((cell, cellIndex) => {
                          return (
                            <td key={cellIndex} className="p-3 text-center min-w-32 align-top">
                              <div
                                className={`${cell < 50 ? '!bg-green-600' : cell < 100 ? '!bg-yellow-600' : '!bg-red-600'} px-2 py-1 rounded-full`}
                              >
                                <span className="text-white">{cell}</span>
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    </Fragment>
                  ))
                ) : (
                  <tr>
                    <td>No service selected</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

const MainPageOverview = () => {
  const [selectedDataSource, setSelectedDataSource] = useState<any[]>([])
  const [selectedServices, setSelectedServices] = useState<{ name: string; data: number[]; count?: number }[]>([])
  const [modalServices, setModalServices] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const handleApplyFilter = (sDataSource: any[], sService: { name: string; data: number[]; count?: number }[]) => {
    setSelectedDataSource(sDataSource)
    setSelectedServices(sService)
    setModalServices(false)
  }

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

  return (
    <div className="flex flex-row">
      {/* <FilterPanel onSelectServices={setSelectedServices} /> */}
      <TablePanel selectedServices={selectedServices} handleAddServices={() => setModalServices(!modalServices)} />
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
