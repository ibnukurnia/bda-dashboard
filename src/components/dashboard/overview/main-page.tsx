'use client'

import React, { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'

import './main-page.css'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import {
  GetChartsOverview,
  GetHealthScoreOverview,
  GetPieChartsOverview,
  GetTopServicesOverview,
} from '@/modules/usecases/overviews'
import { Skeleton, Typography } from '@mui/material'
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
    name: 'Log APM BRIMO',
    count: 1865,
    value: 'apm',
    services: [
      { name: 'Windows', count: 1625, data: [28, 70, 49, 80, 132, 129, 134, 80, 132, 129, 134] },
      { name: 'Linux', count: 1240, data: [28, 50, 124, 80, 132, 78, 134, 80, 132, 78, 134] },
    ],
  },
  {
    name: 'Log Transaksi BRIMO',
    count: 1862,
    value: 'brimo',
    services: [
      { name: 'Windows', count: 1102, data: [28, 133, 124, 127, 132, 129, 134] }, // Same service name as APM
      { name: 'XY', count: 1580, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'OCP',
    count: 1567,
    value: 'k8s_prometheus',
    services: [
      { name: 'Winqowdkoqk', count: 980, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Z/OS System', count: 587, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'DB',
    count: 1567,
    value: 'k8s_db',
    services: [
      { name: 'Winqowdkoqk', count: 980, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Z/OS System', count: 587, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'PANW',
    count: 684,
    value: 'panw',
    services: [
      { name: 'Server', count: 450, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Processor', count: 234, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'WAF',
    count: 684,
    value: 'waf',
    services: [
      { name: 'Server', count: 450, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Processor', count: 234, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'FORTI',
    count: 684,
    value: 'forti',
    services: [
      { name: 'Server', count: 450, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Processor', count: 234, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'IVAT',
    count: 684,
    value: 'ivat',
    services: [
      { name: 'Server', count: 450, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Processor', count: 234, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'PRTG',
    count: 684,
    value: 'prtg',
    services: [
      { name: 'Server', count: 450, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Processor', count: 234, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'ZABBIX',
    count: 684,
    value: 'zabbix',
    services: [
      { name: 'Server', count: 450, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Processor', count: 234, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
]

const toMiliseconds = 1000 * 60

const defaultTimeRanges: Record<string, number> = {
  'Last 10 minutes': 10,
  'Last 15 minutes': 15,
  'Last 30 minutes': 30,
  'Last 1 hours': 60,
  'Last 3 hours': 180,
  // 'Last 6 hours': 360,
  // 'Last 24 hours': 1440,
}

const MainPageOverview = () => {
  // const [selectedDataSource, setSelectedDataSource] = useState<any[]>([])
  const [selectedDataSource, setSelectedDataSource] = useState<string>('')
  const [selectedServices, setSelectedServices] = useState<{ name: string; data: number[]; count?: number }[]>([])
  const [modalServices, setModalServices] = useState(false)
  const [modalSeverity, setModalSeverity] = useState(false)
  const [tableMaxHeight, setTableMaxHeight] = useState(192)
  const [pieChartData, setPieChartData] = useState([])
  const [topServicesData, setTopServicesData] = useState({ header: [], data: [] })
  const [healthScoreData, setHealthScoreData] = useState([])
  const panelRef = useRef<HTMLDivElement>(null)
  const [timeRanges, setTimeRanges] = useState<Record<string, number>>(defaultTimeRanges)
  const [selectedRange, setSelectedRange] = useState<string>('Last 15 minutes')
  const [chartData, setChartData] = useState<any[]>([])
  const [isLoadingGraphic, setIsLoadingGraphic] = useState(false)
  const [isLoadingPieChart, setIsLoadingPieChart] = useState(false)
  const [isLoadingTopServices, setIsLoadingTopServices] = useState(false)
  const [isLoadingHealthScore, setIsLoadingHealthScore] = useState(false)

  const mainRef = useRef<HTMLDivElement>(null)
  const healthinessRef = useRef<HTMLDivElement>(null)
  const thSeverity = ['Severity', 'Count']
  const configDataKey = ['service_name', 'count_anomaly']
  const router = useRouter()

  const handleApplyFilter = (sDataSource: any[]) => {
    // const handleApplyFilter = (sDataSource: any[], sService: { name: string; data: number[]; count?: number }[]) => {
    // setSelectedDataSource(sDataSource)
    // setSelectedServices(sService)
    setModalServices(false)
  }

  const handleStartEnd = (time: string) => {
    const timeSplit = time.split(' - ')

    let startTime: string | Date
    let endTime: string | Date

    if (timeSplit.length > 1) {
      startTime = timeSplit?.[0]
      endTime = timeSplit?.[1]
    } else {
      startTime = format(new Date(new Date().getTime() - toMiliseconds * timeRanges[time]), 'yyyy-MM-dd HH:mm:ss')
      endTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    }

    return { startTime, endTime }
  }

  const handleChangeTimeRange = (time: string) => {
    const { startTime, endTime } = handleStartEnd(time);

    setSelectedRange(time);
    setIsLoadingHealthScore(true);
    setIsLoadingPieChart(true);
    setIsLoadingTopServices(true);
    setIsLoadingGraphic(true)

    const paramsTime = { start_time: startTime, end_time: endTime };
    const params = { type: selectedDataSource, ...paramsTime };

    // Fetch Pie Chart Data
    GetPieChartsOverview(params)
      .then((res) => {
        setPieChartData(res.data.data.sort((a: any, b: any) => a.severity.localeCompare(b.severity)));
        setIsLoadingPieChart(false);
      })
      .catch(() => {
        setPieChartData([]);
        setIsLoadingPieChart(false);
      });

    // Fetch Top Services Data
    GetTopServicesOverview(params)
      .then((res) => {
        setTopServicesData(res.data);
        setIsLoadingTopServices(false);
      })
      .catch(() => {
        setTopServicesData({ header: [], data: [] });
        setIsLoadingTopServices(false);
      });

    // Fetch Health Score Data
    GetHealthScoreOverview(paramsTime)
      .then((res) => {
        setHealthScoreData(res.data);
        setIsLoadingHealthScore(false);
      })
      .catch(() => {
        setHealthScoreData([]);
        setIsLoadingHealthScore(false);
      });

    // Fetch Chart Data (Updated part) (if custom need to re-render the chart)
    GetChartsOverview(paramsTime)
      .then((res) => {
        setChartData(res.data);
        setIsLoadingGraphic(false);
      })
      .catch(() => {
        setChartData([]);
        setIsLoadingGraphic(false);
      });
  };

  const handleChangeFilterDS = (value: string) => {
    const { startTime, endTime } = handleStartEnd(selectedRange)
    const params = { type: value, start_time: startTime, end_time: endTime }

    setSelectedDataSource(value)

    setIsLoadingPieChart(true)
    setIsLoadingTopServices(true)

    GetPieChartsOverview(params)
      .then((res) => {
        setPieChartData(res.data.data.sort((a: any, b: any) => a.severity.localeCompare(b.severity)))
        setIsLoadingPieChart(false)
      })
      .catch(() => {
        setPieChartData([])
        setIsLoadingPieChart(false)
      })
    GetTopServicesOverview(params)
      .then((res) => {
        setTopServicesData(res.data)
        setIsLoadingTopServices(false)
      })
      .catch(() => {
        setTopServicesData({ header: [], data: [] })
        setIsLoadingTopServices(false)
      })
  }

  const handleLogicTitle = (title: string) => {
    if (title.toLowerCase().includes('apm')) {
      return 'error rate apm & brimo'
    } else if (title.toLowerCase().includes('prometheus')) {
      return 'ocp'
    } else if (title.toLowerCase().includes('k8s_db')) {
      return 'db'
    } else if (title.toLowerCase().includes('ivat')) {
      return 'network'
    } else if (title.toLowerCase().includes('panw')) {
      return 'security'
    } else {
      return title
    }
  }

  const handleClickSeverity = (severity: string) => {
    const { startTime, endTime } = handleStartEnd(selectedRange)
    const logicSelectedRange = selectedRange.split(' - ').length > 1 ? 'Custom' : selectedRange

    if (selectedDataSource?.length > 0) {
      router.push(
        '/dashboard/anomaly-detection?data_source=' +
        selectedDataSource +
        '&severity=' +
        severity +
        '&time_range=' +
        logicSelectedRange +
        '&start=' +
        startTime +
        '&end=' +
        endTime
      )
    }
  }

  useEffect(() => {
    const fetchMetrics = () => {
      const { startTime, endTime } = handleStartEnd(selectedRange); // Recalculate time range on every fetch

      const paramsTime = { start_time: startTime, end_time: endTime };
      const params = { type: selectedDataSource, ...paramsTime };

      // Fetch chart data
      GetChartsOverview(params)
        .then((res) => {
          setChartData(res.data);
        })
        .catch(() => setChartData([]));
    };

    // Fetch initial chart data when the component mounts
    fetchMetrics();

    // Set interval to refresh chart data every 5 seconds
    const intervalChartId = setInterval(() => {
      fetchMetrics(); // Recalculate startTime and endTime every time the interval fires
    }, 5000);

    return () => {
      clearInterval(intervalChartId); // Clean up the interval on component unmount
    };
  }, [selectedRange, selectedDataSource]);


  useEffect(() => {
    const { startTime, endTime } = handleStartEnd(selectedRange)

    setIsLoadingHealthScore(true)
    setIsLoadingPieChart(true)
    setIsLoadingTopServices(true)

    const paramsTime = { start_time: startTime, end_time: endTime }
    const params = {
      type: selectedDataSource,
      ...paramsTime,
    }

    GetPieChartsOverview(params)
      .then((res) => {
        setPieChartData(res.data.data.sort((a: any, b: any) => a.severity.localeCompare(b.severity)))
        setIsLoadingPieChart(false)
      })
      .catch(() => {
        setPieChartData([])
        setIsLoadingPieChart(false)
      })
    GetTopServicesOverview(params)
      .then((res) => {
        setTopServicesData(res.data)
        setIsLoadingTopServices(false)
      })
      .catch(() => {
        setTopServicesData({ header: [], data: [] })
        setIsLoadingTopServices(false)
      })
    GetHealthScoreOverview(paramsTime)
      .then((res) => {
        setHealthScoreData(res.data)
        setIsLoadingHealthScore(false)
      })
      .catch(() => {
        setHealthScoreData([])
        setIsLoadingHealthScore(false)
      })
  }, [])

  // useEffect(() => {
  //   const intervalOverview = setInterval(() => {
  //     if (
  //       !isLoadingHealthScore &&
  //       !isLoadingPieChart &&
  //       !isLoadingTopServices
  //     ) {
  //       const timeSplit = selectedRange.split(' - ');

  //       let startTime: string | Date;
  //       let endTime: string | Date;

  //       if (timeSplit.length > 1) {
  //         // If it's a custom range
  //         startTime = timeSplit?.[0];
  //         endTime = timeSplit?.[1];
  //       } else {
  //         // If it's a predefined range like "Last 15 minutes"
  //         startTime = format(
  //           new Date(new Date().getTime() - toMiliseconds * timeRanges[selectedRange]),
  //           'yyyy-MM-dd HH:mm:ss'
  //         );
  //         endTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  //       }

  //       const paramsTime = { start_time: startTime, end_time: endTime };
  //       const params = {
  //         type: selectedDataSource,
  //         ...paramsTime,
  //       };

  //       // Fetch Pie Charts Overview
  //       GetPieChartsOverview(params)
  //         .then((res) => setPieChartData(res.data.data.sort((a: any, b: any) => a.severity.localeCompare(b.severity))))
  //         .catch(() => setPieChartData([]));

  //       // Fetch Top Services Overview
  //       GetTopServicesOverview(params)
  //         .then((res) => setTopServicesData(res.data))
  //         .catch(() => setTopServicesData({ header: [], data: [] }));

  //       // Fetch Health Score Overview
  //       GetHealthScoreOverview(paramsTime)
  //         .then((res) => setHealthScoreData(res.data))
  //         .catch(() => setHealthScoreData([]));
  //     }
  //   }, 5000);

  //   return () => {
  //     clearInterval(intervalOverview);
  //   };
  // }, [selectedDataSource, timeRanges, isLoadingPieChart, isLoadingHealthScore, isLoadingTopServices, selectedRange]);


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

    <div className='flex flex-col gap-3 '>
      <div className="flex gap-3 items-center justify-between">
        <div className="flex gap-4 items-center">
          {/* <span className="text-2xl text-white font-bold">Filter</span> */}
          <DropdownTime
            timeRanges={timeRanges}
            onRangeChange={(e) => handleChangeTimeRange(e)}
            selectedRange={selectedRange}
          />
          {/* <Button>Auto Refresh</Button> */}
          {/* <FullscreenComponent elementRef={mainRef} /> */}
        </div>
      </div>
      <div className="flex flex-row" ref={mainRef}>
        <div className="flex-1 grid gap-8">
          <div className="chart-section">
            {/* {dummyData.map((item, id) => { */}
            {chartData.map((item, id) => {
              return (
                <div className={`chart-section-col chart-section-col-${id + 1}`} key={id}>
                  <DynamicUpdatingChart title={handleLogicTitle(item.title)} series={item.data} id={id} />
                </div>
              )
            })}
          </div>

          {/* <div className="flex gap-8"> */}
          <div className="grid 2xl:grid-cols-2 grid-cols-1 gap-8">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-8 card">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-2xl">Services Overview</span>
                  <div>
                    <DropdownDS
                      data={[
                        { id: 'semua-data-source', value: '', label: 'All Data Source' },
                        ...sourceData.map((item) => ({ id: item.name, value: item.value, label: item.name })),
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
                      onClickSeverity={(severity) => handleClickSeverity(severity)}
                      clickable={selectedDataSource?.length > 0}
                    />
                  </div>
                  <TableServices
                    data={topServicesData.data}
                    tableHeader={topServicesData.header}
                    dataKeys={configDataKey}
                    maxHeight={tableMaxHeight}
                  />
                </div>
              </div>

            </div>
            <div className="flex flex-col gap-8 card relative">
              <span className="font-bold text-white text-2xl">Healthiness</span>
              {!healthScoreData.length && (
                <span className="text-center text-white absolute top-1/2 w-full left-0">
                  Terjadi kesalahan. Silakan refresh halaman ini atau coba beberapa saat lagi
                </span>
              )}
              <div className="flex flex-wrap gap-8" ref={healthinessRef}>
                {

                  healthScoreData.length &&
                  healthScoreData.map((hd: any, hdid: number) => {
                    const label = (dataSource: string) => {
                      if (dataSource?.toLowerCase() === 'apm') {
                        return 'log apm brimo'
                      } else if (dataSource?.toLowerCase() === 'brimo') {
                        return 'log transaksi brimo'
                      } else if (dataSource?.toLowerCase() === 'k8s_db') {
                        return 'db'
                      } else if (dataSource?.toLowerCase() === 'k8s_prometheus') {
                        return 'ocp'
                      } else {
                        return dataSource
                      }
                    }
                    return <Gauge value={hd.score} label={label(hd.data_source)} key={hdid} />
                  })
                }
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  )
}

export default MainPageOverview
