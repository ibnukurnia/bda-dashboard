'use client'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

import './main-page.css'

import { useRouter } from 'next/navigation'
import {
  GetChartsOverview,
  GetHealthScoreOverview,
  GetPieChartsOverview,
  GetTopFiveCritical,
  GetTopServicesOverview,
} from '@/modules/usecases/overviews'
import { format } from 'date-fns'
import { Maximize } from 'react-feather'

import Button from '@/components/system/Button/Button'

import DropdownDS from './button/dropdown-ds'
import DropdownTime from './button/dropdown-time'
import DonutChart from './chart/donut-chart'
import DynamicUpdatingChart from './chart/dynamic-updating-chart'
import TableServices from './table/table-services'
import TableSeverity from './table/table-severity'
import TableServicesWrapper from './wrapper/table-services-wrapper'
import GraphWrapper from './wrapper/graph-wrapper'
import DonutChartWrapper from './wrapper/donut-wrapper'
import TableSeverityWrapper from './wrapper/table-severity-wrapper'
import TableCriticalAnomaly from './table/table-critical-anomaly'
import DropdownSeverity from './button/dropdown-severity'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { SEVERITY_LABELS } from '@/constants'
import HealthinessTree from './panels/healthiness-tree'
import HealthinessTreeWrapper from './wrapper/healthiness-tree-wrapper'
import { HealthScoreResponse, TopFiveLatestCritical } from '@/modules/models/overviews'
import TableTopCritical from './table/table-top-critical'
import AnomalyAmountChart from './chart/anomaly-amount-chart'
import { GetMetricLogAnomalies } from '@/modules/usecases/anomaly-predictions'
import { fetchServicesOption } from '@/lib/api'
import DropdownAnomalyAmountService from './button/dropdown-anomaly-amount-service'
import AnomalyAmountWrapper from './wrapper/anomaly-amount-wrapper'
import { Skeleton } from '@mui/material'

const ANOMALY_AMOUNT_TYPE = 'brimo'
const ANOMALY_AMOUNT_METRIC_NAME = 'is_anomaly_amount'

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

const dataDropdownSeverity = [
  {
    id: 1,
    label: "Very High",
    value: 1,
  },
  {
    id: 2,
    label: "High",
    value: 2,
  },
  {
    id: 3,
    label: "Medium",
    value: 3,
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
  const [selectedSeverity, setSelectedSeverity] = useState<{ value: any; id: number; label: string } | null | undefined>(dataDropdownSeverity[0])
  const [selectedServices, setSelectedServices] = useState<{ name: string; data: number[]; count?: number }[]>([])
  const [selectedAnomalyAmountService, setSelectedAnomalyAmountService] = useState<string>('')
  const [modalServices, setModalServices] = useState(false)
  const [modalSeverity, setModalSeverity] = useState(false)
  const [tableMaxHeight, setTableMaxHeight] = useState(192)
  const [pieChartData, setPieChartData] = useState([])
  const [topServicesData, setTopServicesData] = useState({ header: [], data: [] })
  const [healthScoreData, setHealthScoreData] = useState<HealthScoreResponse[]>([])
  const [topFiveCriticalData, setTopFiveCriticalData] = useState<TopFiveLatestCritical[]>([])
  const [anomalyAmountServicesData, setAnomalyAmountServicesData] = useState<string[]>([])
  const [anomalyAmountData, setAnomalyAmountData] = useState<any>({
    data: [],
    anomalies: [],
    title: "Anomaly Amount"
  })
  const panelRef = useRef<HTMLDivElement>(null)
  const [timeRanges, setTimeRanges] = useState<Record<string, number>>(defaultTimeRanges)
  const [selectedRange, setSelectedRange] = useState<string>('Last 15 minutes')
  const [chartData, setChartData] = useState<any[]>([])
  const [isLoadingGraphic, setIsLoadingGraphic] = useState(true)
  const [isLoadingPieChart, setIsLoadingPieChart] = useState(true)
  const [isLoadingTopServices, setIsLoadingTopServices] = useState(true)
  const [isLoadingHealthScore, setIsLoadingHealthScore] = useState(true)
  const [isLoadingTopFiveCritical, setIsLoadingTopFiveCritical] = useState(true)
  const [isLoadingAnomalyAmountServices, setIsLoadingAnomalyAmountServices] = useState(true)
  const [isLoadingAnomalyAmount, setIsLoadingAnomalyAmount] = useState(true)
  const [isErrorHealthScore, setIsErrorHealthScore] = useState(false)
  const [isErrorTopFiveCritical, setIsErrorTopFiveCritical] = useState(false)
  const [isErrorAnomalyAmountServices, setIsErrorAnomalyAmountServices] = useState(false)
  const [isErrorAnomalyAmount, setIsErrorAnomalyAmount] = useState(false)
  const [isCustomRangeSelected, setIsCustomRangeSelected] = useState<boolean>(false);
  const selectedDataSourceRef = useRef(selectedDataSource);

  const healthinessRef = useRef<HTMLDivElement>(null)
  const thSeverity = ['Severity', 'Count']
  const configDataKey = ['service_name', 'very_high', 'high', 'medium']
  const router = useRouter()
  const handle = useFullScreenHandle();

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
    setIsLoadingTopFiveCritical(true)

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
        if (res.data == null) throw Error("Empty response data")
        setHealthScoreData(res.data);
        setIsErrorHealthScore(false);
      })
      .catch(() => {
        setIsErrorHealthScore(true);
      })
      .finally(() => {
        setIsLoadingHealthScore(false);
      })

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

    GetTopFiveCritical(params)
      .then((res) => {
        setTopFiveCriticalData(res.data ?? [])
        setIsErrorTopFiveCritical(false);
      })
      .catch(() => {
        setIsErrorTopFiveCritical(true);
      })
      .finally(() => {
        setIsLoadingTopFiveCritical(false);
      })

    GetMetricLogAnomalies({
      ...paramsTime,
      metric_name: [ANOMALY_AMOUNT_METRIC_NAME],
      service_name: selectedAnomalyAmountService,
      type: ANOMALY_AMOUNT_TYPE,
    })
      .then((res) => {
        setAnomalyAmountData((prev: any) => res.data?.[0] ?? prev)
        setIsErrorAnomalyAmount(false);
      })
      .catch(() => {
        setIsErrorAnomalyAmount(true);
      })
      .finally(() => {
        setIsLoadingAnomalyAmount(false);
      })
  };

  const handleChangeFilterDS = (value: string) => {
    const { startTime, endTime } = handleStartEnd(selectedRange)
    const params = { type: value, start_time: startTime, end_time: endTime }

    console.log("Data source selected:", value);  // Debug here
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

  const handleChangeFilterSeverity = (value?: { value: any; id: number; label: string } | null) => {
    setSelectedSeverity(value)
  }

  const handleChangeFilterAnomalyAmountService = (value: string) => {
    setSelectedAnomalyAmountService(value)
  }

  const handleLogicTitle = (title: string) => {
    if (title.toLowerCase().includes('apm')) {
      return 'error rate apm & brimo'
    } else if (title.toLowerCase().includes('prometheus')) {
      return 'ocp'
    } else if (title.toLowerCase().includes('k8s_db')) {
      return 'database'
    } else if (title.toLowerCase().includes('ivat')) {
      return 'network'
    } else if (title.toLowerCase().includes('panw')) {
      return 'security'
    } else {
      return title
    }
  }

  // const handleClickSeverity = (severity: string) => {
  //   console.log("Selected Data Source:", selectedDataSource); // Directly use the state variable

  //   const { startTime, endTime } = handleStartEnd(selectedRange);
  //   const logicSelectedRange = selectedRange.split(' - ').length > 1 ? 'Custom' : selectedRange;

  //   if (selectedDataSource?.length > 0) {
  //     router.push(
  //       '/dashboard/anomaly-detection?data_source=' +
  //       selectedDataSource +  // Use selectedDataSource directly here
  //       '&severity=' +
  //       severity +
  //       '&time_range=' +
  //       logicSelectedRange +
  //       '&start=' +
  //       startTime +
  //       '&end=' +
  //       endTime
  //     );
  //   } else {
  //     console.log("failed to get data source");
  //   }
  // };


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
        .catch(() => setChartData([]))
        .finally(() => setIsLoadingGraphic(false))
    };

    // Fetch initial chart data when the component mounts
    fetchMetrics();

    let intervalChartId: NodeJS.Timeout | null = null;

    // Only set the interval if a custom range is NOT selected
    if (!isCustomRangeSelected) {
      intervalChartId = setInterval(() => {
        fetchMetrics(); // Recalculate startTime and endTime every time the interval fires
      }, 5000);
    }

    return () => {
      if (intervalChartId) {
        clearInterval(intervalChartId); // Clean up the interval on component unmount
      }
    };
  }, [selectedRange, selectedDataSource, isCustomRangeSelected]);


  useEffect(() => {
    const { startTime, endTime } = handleStartEnd(selectedRange)

    setIsLoadingHealthScore(true)
    setIsLoadingPieChart(true)
    setIsLoadingTopServices(true)
    setIsLoadingTopFiveCritical(true)

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
        if (res.data == null) throw Error("Empty response data")
        setHealthScoreData(res.data)
        setIsErrorHealthScore(false);
      })
      .catch(() => {
        setIsErrorHealthScore(true)
      })
      .finally(() => {
        setIsLoadingHealthScore(false);
      })

    GetTopFiveCritical(paramsTime)
      .then((res) => {
        setTopFiveCriticalData(res.data ?? [])
        setIsErrorTopFiveCritical(false);
      })
      .catch(() => {
        setIsErrorTopFiveCritical(true);
      })
      .finally(() => {
        setIsLoadingTopFiveCritical(false);
      })

    fetchServicesOption({
      ...paramsTime,
      type: ANOMALY_AMOUNT_TYPE,
    })
      .then((res) => {
        setAnomalyAmountServicesData(res.data?.services ?? [])
        setIsErrorAnomalyAmountServices(false);
      })
      .catch(() => {
        setIsErrorAnomalyAmountServices(true);
      })
      .finally(() => {
        setIsLoadingAnomalyAmountServices(false);
      })
  }, [])

  useEffect(() => {
    setSelectedAnomalyAmountService(anomalyAmountServicesData[0])
  }, [anomalyAmountServicesData])

  useEffect(() => {
    if (!anomalyAmountServicesData) return

    setIsLoadingAnomalyAmount(true)

    const { startTime, endTime } = handleStartEnd(selectedRange)
    const paramsTime = { start_time: startTime, end_time: endTime }

    GetMetricLogAnomalies({
      ...paramsTime,
      metric_name: [ANOMALY_AMOUNT_METRIC_NAME],
      service_name: anomalyAmountServicesData[0],
      type: ANOMALY_AMOUNT_TYPE,
    })
      .then((res) => {
        setAnomalyAmountData((prev: any) => res.data?.[0] ?? prev)
        setIsErrorAnomalyAmount(false)
      })
      .catch(() => {
        setIsErrorAnomalyAmount(true)
      })
      .finally(() => {
        setIsLoadingAnomalyAmount(false)
      })
  }, [selectedAnomalyAmountService])


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

  useEffect(() => {
    selectedDataSourceRef.current = selectedDataSource;
  }, [selectedDataSource]);

  // Get start and end times from selected range for passing to DynamicUpdatingChart
  const { startTime, endTime } = handleStartEnd(selectedRange)

  return (

    <div className='flex flex-col gap-6'>
      <div className="flex gap-3 items-center justify-between">
        <div className="flex gap-4 items-center">
          {/* <span className="text-2xl text-white font-bold">Filter</span> */}
          <DropdownTime
            timeRanges={timeRanges}
            onRangeChange={(e) => handleChangeTimeRange(e)}
            selectedRange={selectedRange}
            onCustomRangeSelected={setIsCustomRangeSelected} // Pass down handler for custom range detection
          />
          {/* <Button>Auto Refresh</Button> */}
        </div>
        <div className="flex">
          <Button
            onClick={handle.enter}
          >
            <Maximize className='w-6 h-6' />
          </Button>
        </div>
      </div>
      <FullScreen className={`${handle.active ? "p-6 bg-[#05061E] overflow-auto" : ""} `} handle={handle}>
        <div className="flex flex-row">
          <div className="flex-1 grid gap-8">
            <div className="flex flex-col gap-8 card relative">
              <span className="font-bold text-white text-2xl">BRImo End to End</span>
              <HealthinessTreeWrapper
                isLoading={isLoadingHealthScore}
                isError={isErrorHealthScore}
              >
                <HealthinessTree
                  data={healthScoreData}
                />
              </HealthinessTreeWrapper>
              {/* <HealthinessGaugesWrapper
                isLoading={isLoadingHealthScore}
                isError={isErrorHealthScore}
                healthinessRef={healthinessRef}
              >
                <div className="flex flex-wrap gap-8" ref={healthinessRef}>
                  {healthScoreData.length > 0 &&
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
              </HealthinessGaugesWrapper> */}
            </div>

            {/* <div className="flex gap-8"> */}
            <div className="grid 2xl:grid-cols-2 grid-cols-1 gap-8">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-8 card">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-2xl">Anomaly Overview</span>
                    {!handle.active && <DropdownDS
                      data={[
                        { id: 'semua-data-source', value: '', label: 'All Data Source' },
                        ...sourceData.map((item) => ({ id: item.name, value: item.value, label: item.name })),
                      ]}
                      onSelectData={(e) => handleChangeFilterDS(e)}
                      selectedData={selectedDataSource}
                    />}
                  </div>
                  <div className="grid grid-cols-2 2xl:flex 2xl:flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <DonutChartWrapper
                        isLoading={isLoadingPieChart}
                      >
                        <DonutChart
                          series={pieChartData.map((item: any) => item.count)}
                          labels={pieChartData.map((sditem: any) => sditem.severity)}
                        />
                      </DonutChartWrapper>
                      <TableSeverityWrapper
                        isLoading={isLoadingPieChart}
                      >
                        <TableSeverity
                          tableHeader={thSeverity}
                          data={pieChartData}
                          clickable={true}
                          queryParams={{ time_range: selectedRange, data_source: selectedDataSource }}  // Pass query params
                        />

                      </TableSeverityWrapper>
                    </div>
                    <TableServicesWrapper
                      isLoading={isLoadingTopServices}
                    >
                      <TableServices
                        data={topServicesData.data}
                        tableHeader={[topServicesData.header[0], ...Object.values(SEVERITY_LABELS)]}
                        dataKeys={configDataKey}
                        maxHeight={tableMaxHeight}
                        queryParams={{
                          start_time: startTime,
                          end_time: endTime
                        }}
                      />
                    </TableServicesWrapper>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-8 card">
                  <span className="font-bold text-white text-2xl">Top 5 Critical</span>
                  <TableTopCritical
                    data={topFiveCriticalData}
                    isLoading={isLoadingTopFiveCritical}
                  />
                </div>
              </div>
            </div>
            <div className='card flex flex-col gap-6'>
              <div className='flex justify-between'>
                <span className="font-bold text-white text-2xl content-center">Latest Anomaly</span>
                {!handle.active && <DropdownSeverity
                  data={dataDropdownSeverity}
                  onSelectData={(e) => handleChangeFilterSeverity(e)}
                  selectedData={selectedSeverity}
                />}
              </div>
              <TableCriticalAnomaly
                timeRange={selectedRange}
                severity={selectedSeverity}
              />
            </div>

            <GraphWrapper isLoading={isLoadingGraphic} >
              <span className="font-bold text-white text-2xl">Graphic</span>
              <div className="chart-section">
                {chartData.map((item, id) => (
                  <div className={`chart-section-col chart-section-col-${id + 1}`} key={id}>
                    <DynamicUpdatingChart
                      title={handleLogicTitle(item.title)}
                      series={item.data}
                      spike={item.last_spike}
                      id={id}
                      startTime={startTime} // Pass the calculated startTime
                      endTime={endTime} // Pass the calculated endTime
                    />
                  </div>
                ))}
              </div>
            </GraphWrapper>
            <div className='card flex flex-col gap-6'>
              <div className='flex justify-between'>
                <span className="font-bold text-white text-2xl content-center">Anomaly Amount</span>
                {!handle.active && (
                  isLoadingAnomalyAmountServices ?
                    <Skeleton
                      animation="wave"
                      sx={{ bgcolor: 'grey.800' }}
                      variant="rounded"
                      width={200}
                      height={48}
                    /> :
                    <DropdownAnomalyAmountService
                      data={anomalyAmountServicesData}
                      onSelectData={(e) => handleChangeFilterAnomalyAmountService(e)}
                      selectedData={selectedAnomalyAmountService}
                    />
                )}
              </div>
              <AnomalyAmountWrapper
                isLoading={isLoadingAnomalyAmount}
              >
                <AnomalyAmountChart
                  series={anomalyAmountData.data}
                  anomalies={anomalyAmountData?.anomalies as any[]}
                  startTime={startTime} // Pass the calculated startTime
                  endTime={endTime} // Pass the calculated endTime
                />
              </AnomalyAmountWrapper>
            </div>
          </div>

        </div>
      </FullScreen>
    </div>

  )
}

export default MainPageOverview
