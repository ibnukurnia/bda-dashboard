'use client'

import React, { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'

import './main-page.css'

import {
  GetChartsOverview,
  GetHealthScoreOverview,
  GetPieChartsOverview,
  GetTopServicesOverview,
} from '@/modules/usecases/overviews'
import { Typography } from '@mui/material'
import { format } from 'date-fns'
import { Check, Minus, Plus } from 'react-feather'

import Button from '@/components/system/Button/Button'

import FullscreenComponent from '../FullScreenComponent'
import DropdownDS from './button/dropdown-ds'
import DropdownTime from './button/dropdown-time'
import DonutChart from './chart/donut-chart'
import DynamicUpdatingChart from './chart/dynamic-updating-chart'
import OverviewModal from './modal/overview-modal'
import Gauge from './panels/gauge'
import TablePanel from './panels/table-panel'
import TableServices from './table/table-services'
import TableSeverity from './table/table-severity'

// Define your data
const sourceData = [
  {
    name: 'apm',
    count: 1865,
    services: [
      { name: 'Windows', count: 1625, data: [28, 70, 49, 80, 132, 129, 134, 80, 132, 129, 134] },
      { name: 'Linux', count: 1240, data: [28, 50, 124, 80, 132, 78, 134, 80, 132, 78, 134] },
    ],
  },
  {
    name: 'brimo',
    count: 1862,
    services: [
      { name: 'Windows', count: 1102, data: [28, 133, 124, 127, 132, 129, 134] }, // Same service name as APM
      { name: 'XY', count: 1580, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'k8s_prometheus',
    count: 1567,
    services: [
      { name: 'Winqowdkoqk', count: 980, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Z/OS System', count: 587, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'k8s_db',
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
  'Last 5 minutes': 5,
  'Last 15 minutes': 15,
  'Last 30 minutes': 30,
  'Last 1 hours': 60,
  'Last 6 hours': 360,
  'Last 24 hours': 1440,
}

const MainPageOverview = () => {
  // const [selectedDataSource, setSelectedDataSource] = useState<any[]>([])
  const [selectedDataSource, setSelectedDataSource] = useState<string>('')
  const [selectedServices, setSelectedServices] = useState<{ name: string; data: number[]; count?: number }[]>([])
  const [modalServices, setModalServices] = useState(false)
  const [modalSeverity, setModalSeverity] = useState(false)
  const [tableMaxHeight, setTableMaxHeight] = useState(192)
  const [pieChartData, setPieChartData] = useState([])
  const [topServicesData, setTopServicesData] = useState({ total: [], data: [] })
  const [healthScoreData, setHealthScoreData] = useState([])
  const panelRef = useRef<HTMLDivElement>(null)
  const [timeRanges, setTimeRanges] = useState<Record<string, number>>(defaultTimeRanges)
  const [selectedRange, setSelectedRange] = useState<string>('Last 15 minutes')
  const [chartData, setChartData] = useState<any[]>([])
  // const []
  const mainRef = useRef<HTMLDivElement>(null)
  const healthinessRef = useRef<HTMLDivElement>(null)

  const handleApplyFilter = (sDataSource: any[]) => {
    // const handleApplyFilter = (sDataSource: any[], sService: { name: string; data: number[]; count?: number }[]) => {
    // setSelectedDataSource(sDataSource)
    // setSelectedServices(sService)
    setModalServices(false)
  }

  const handleChangeTimeRange = (time: string) => {
    const selectedTR = timeRanges[time]
    setSelectedRange(time)
    GetPieChartsOverview({ type: selectedDataSource, time_range: selectedTR })
      .then((res) => {
        console.log(
          res.data.data.sort((a: any, b: any) => a.severity.localeCompare(b.severity)),
          'ini sorted'
        )
        setPieChartData(res.data.data.sort((a: any, b: any) => a.severity.localeCompare(b.severity)))
      })
      .catch(() => setPieChartData([]))
    GetTopServicesOverview({ type: selectedDataSource, time_range: selectedTR })
      .then((res) => setTopServicesData(res.data))
      .catch(() => setTopServicesData({ total: [], data: [] }))
    GetHealthScoreOverview({ time_range: selectedTR })
      .then((res) => setHealthScoreData(res.data))
      .catch(() => setHealthScoreData([]))
  }

  const handleChangeFilterDS = (value: string) => {
    setSelectedDataSource(value)
    GetPieChartsOverview({ type: value, time_range: timeRanges[selectedRange] })
      .then((res) => setPieChartData(res.data.data.sort((a: any, b: any) => a.severity.localeCompare(b.severity))))
      .catch(() => setPieChartData([]))
    GetTopServicesOverview({ type: value, time_range: timeRanges[selectedRange] })
      .then((res) => setTopServicesData(res.data))
      .catch(() => setTopServicesData({ total: [], data: [] }))
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
    GetPieChartsOverview({ type: selectedDataSource, time_range: timeRanges[selectedRange] })
      .then((res) => setPieChartData(res.data.data.sort((a: any, b: any) => a.severity.localeCompare(b.severity))))
      .catch(() => setPieChartData([]))
    GetTopServicesOverview({ type: selectedDataSource, time_range: timeRanges[selectedRange] })
      .then((res) => setTopServicesData(res.data))
      .catch(() => setTopServicesData({ total: [], data: [] }))
    GetHealthScoreOverview({ time_range: timeRanges[selectedRange] })
      .then((res) => setHealthScoreData(res.data))
      .catch(() => setHealthScoreData([]))
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
  const configDataKey = ['service_name', 'count_anomaly']

  useLayoutEffect(() => {
    if (healthinessRef.current) {
      const calculatedTableHeight = healthinessRef.current.offsetHeight - 310
      if (calculatedTableHeight > 192 && window.innerWidth >= 1440) {
        setTableMaxHeight(healthinessRef.current.offsetHeight - 310)
      } else if (window.innerWidth < 1440) {
        setTableMaxHeight(260 - 16)
      } else {
        setTableMaxHeight(192)
      }
    }
  }, [healthinessRef.current?.offsetHeight])

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
            {/* <span className="text-2xl text-white font-bold">Filter</span> */}
            <DropdownTime
              timeRanges={timeRanges}
              onRangeChange={(e) => handleChangeTimeRange(e)}
              selectedRange={selectedRange}
            />
            {/* <FullscreenComponent elementRef={mainRef} /> */}
          </div>
          <span className="font-bold text-white">Updated at 5:21:11 PM</span>
        </div>
        {/* <div className="flex gap-8"> */}
        <div className="grid 2xl:grid-cols-2 grid-cols-1 gap-8">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-8 card">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-2xl">Services Overview</span>
                <div>
                  {/* <Button onClick={() => setModalServices(true)}>
                    <Typography>Filter</Typography>
                  </Button> */}
                  <DropdownDS
                    data={[
                      { id: 'semua-data-source', value: '', label: 'All Data Source' },
                      ...sourceData.map((item) => ({ id: item.name, value: item.name, label: item.name })),
                    ]}
                    onSelectData={(e) => handleChangeFilterDS(e)}
                    selectedData={selectedDataSource}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 2xl:flex 2xl:flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <DonutChart
                    series={pieChartData.map((item: any) => item.count)}
                    labels={pieChartData.map((sditem: any) => sditem.severity)}
                  />
                  <TableSeverity
                    tableHeader={thSeverity}
                    data={pieChartData}
                    onClickSeverity={() => setModalSeverity(true)}
                  />
                </div>
                {/* <hr /> */}
                <TableServices
                  // data={servicesData}
                  data={topServicesData.data}
                  tableHeader={topServicesData.total}
                  dataKeys={configDataKey}
                  maxHeight={tableMaxHeight}
                />
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
          <div className="flex flex-col gap-8 card">
            <span className="font-bold text-white text-2xl">Healthiness</span>
            <div className="flex flex-wrap gap-8" ref={healthinessRef}>
              {[...healthScoreData, { score: 99, data_source: 'Network' }, { score: 99, data_source: 'Security' }].map(
                (hd: any, hdid: number) => {
                  const label =
                    hd.data_source?.toLowerCase() === 'apm'
                      ? 'Log APM BRIMO'
                      : hd.data_source?.toLowerCase() === 'brimo'
                        ? 'Log Transaksi BRIMO'
                        : hd.data_source?.toLowerCase() === 'k8s_db'
                          ? 'DB'
                          : hd.data_source?.toLowerCase() === 'k8s_prometheus'
                            ? 'OCP'
                            : hd.data_source
                  return <Gauge value={hd.score} label={label} key={hdid} />
                }
              )}
            </div>
          </div>
        </div>
      </div>
      {/* {modalServices && (
        <OverviewModal
          open={modalServices}
          listDataSource={sourceData}
          handleOpenModal={setModalServices}
          handleApplyFilter={handleApplyFilter}
          prevSelectedDataSource={selectedDataSource}
          // prevSelectedServices={selectedServices}
        />
      )} */}
    </div>
  )
}

export default MainPageOverview
