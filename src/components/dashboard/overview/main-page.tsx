'use client'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './main-page.css'
import { format } from 'date-fns'
import { Maximize } from 'react-feather'
import {
  GetChartsOverview,
  GetHealthScoreOverview,
  GetPieChartsOverview,
  GetTopFiveCritical,
  GetTopServicesOverview,
  GetAmountGraphic,
  GetAmountServiceList,
  GetDataSourceLatestAnomaly
} from '@/modules/usecases/overviews'
import { GetMetricLogAnomalies } from '@/modules/usecases/anomaly-predictions'
import { fetchServicesOption } from '@/lib/api'
import { HealthScoreResponse, TopFiveLatestCritical, TopServicesResponse } from '@/modules/models/overviews'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { SEVERITY_LABELS } from '@/constants'
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
import TableTopCritical from './table/table-top-critical'
import AutoRefreshButton from '../anomaly/button/refreshButton'

import TooltipServiceCollection from './collection/tooltip-service-collection'
import BRImoEndToEndPanel from './panels/brimo-end-to-end-panel'
import LatestAnomalyPanel from './panels/latest-anomaly-panel'
import AnomalyAmountPanel from './panels/anomaly-amount-panel'

const ANOMALY_AMOUNT_TYPE = 'brimo'
const ANOMALY_AMOUNT_METRIC_NAME = 'sum_amount'

// Define your data
const sourceData = [
  {
    name: 'Log APM BRIMO',
    count: 1865,
    value: 'apm',
  },
  {
    name: 'Log Transaksi BRIMO',
    count: 1862,
    value: 'brimo',
  },
  {
    name: 'OCP',
    count: 1567,
    value: 'k8s_prometheus',
  },
  {
    name: 'DB',
    count: 1567,
    value: 'k8s_db',
  },
  {
    name: 'PANW',
    count: 684,
    value: 'panw',
  },
  {
    name: 'WAF',
    count: 684,
    value: 'waf',
  },
  {
    name: 'FORTI',
    count: 684,
    value: 'forti',

  },
  {
    name: 'IVAT',
    count: 684,
    value: 'ivat',

  },
  {
    name: 'PRTG',
    count: 684,
    value: 'prtg',
  },
  {
    name: 'ZABBIX',
    count: 684,
    value: 'zabbix',
  },
]

const toMiliseconds = 1000 * 60

const defaultTimeRanges: Record<string, number> = {
  'Last 5 minutes': 5,
  'Last 10 minutes': 10,
  'Last 15 minutes': 15,
  'Last 30 minutes': 30,
  'Last 1 hours': 60,
  'Last 3 hours': 180,
}

const MainPageOverview = () => {
  const [amountServiceList, setAmountServiceList] = useState<string[]>([]);
  const [selectedDataSource, setSelectedDataSource] = useState<string>('')
  const [modalServices, setModalServices] = useState(false)
  const [tableMaxHeight, setTableMaxHeight] = useState(192)
  const [pieChartData, setPieChartData] = useState([])
  const [topServicesData, setTopServicesData] = useState<TopServicesResponse | null>(null)
  const [healthScoreData, setHealthScoreData] = useState<HealthScoreResponse[]>([])
  const [topFiveCriticalData, setTopFiveCriticalData] = useState<TopFiveLatestCritical[]>([])
  const [dataSourceLatestAnomalyData, setDataSourceLatestAnomalyData] = useState<string[]>([])
  const panelRef = useRef<HTMLDivElement>(null)
  const [timeRanges, setTimeRanges] = useState<Record<string, number>>(defaultTimeRanges)
  const [selectedRange, setSelectedRange] = useState<string>('Last 15 minutes')
  const [chartData, setChartData] = useState<any[]>([])
  const [isLoadingGraphic, setIsLoadingGraphic] = useState(true)
  const [isLoadingPieChart, setIsLoadingPieChart] = useState(true)
  const [isLoadingTopServices, setIsLoadingTopServices] = useState(true)
  const [isLoadingHealthScore, setIsLoadingHealthScore] = useState(true)
  const [isLoadingTopFiveCritical, setIsLoadingTopFiveCritical] = useState(true)
  const [isLoadingDataSourceLatestAnomaly, setIsLoadingDataSourceLatestAnomaly] = useState(false)
  const [isErrorHealthScore, setIsErrorHealthScore] = useState(false)
  const [isErrorTopFiveCritical, setIsErrorTopFiveCritical] = useState(false)
  const [isErrorDataSourceLatestAnomaly, setIsErrorDataSourceLatestAnomaly] = useState(false)
  const [isCustomRangeSelected, setIsCustomRangeSelected] = useState<boolean>(false);

  const healthinessRef = useRef<HTMLDivElement>(null)
  const thSeverity = ['Severity', 'Count']
  const configDataKey = ['service_name', 'very_high', 'high', 'medium']
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [timeDifference, setTimeDifference] = useState<string>('Refreshed just now');
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const handle = useFullScreenHandle();

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

  // Get start and end times from selected range for passing to DynamicUpdatingChart
  const { startTime, endTime } = handleStartEnd(selectedRange)

  const handleChangeTimeRange = (time: string) => {
    const { startTime, endTime } = handleStartEnd(time);
    // Create Date objects for start and end times (use local time instead of UTC)
    const startDateObj = new Date(startTime);
    const endDateObj = new Date(endTime);

    startDateObj.setSeconds(0, 0);
    endDateObj.setSeconds(0, 0);

    // Format startTime and endTime using the helper function (no need for UTC conversions)
    const formatTimeToString = (date: Date) => {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00`;
    };

    const formattedStartTime = formatTimeToString(startDateObj);
    const formattedEndTime = formatTimeToString(endDateObj);

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
        setPieChartData(res.data.data);
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
        setTopServicesData(null);
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
  };

  const handleChangeFilterDS = (value: string) => {
    const { startTime, endTime } = handleStartEnd(selectedRange)
    const params = { type: value, start_time: startTime, end_time: endTime }
    const paramsHealth = { start_time: startTime, end_time: endTime }

    // console.log("Data source selected:", value);  // Debug here
    setSelectedDataSource(value)

    setIsLoadingPieChart(true)
    setIsLoadingTopServices(true)
    setIsLoadingHealthScore(true)
    setIsLoadingTopFiveCritical(true)

    GetPieChartsOverview(params)
      .then((res) => {
        setPieChartData(res.data.data)
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
        setTopServicesData(null)
        setIsLoadingTopServices(false)
      })
    // Fetch Health Score Data
    GetHealthScoreOverview(paramsHealth)
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

  const handleRefreshNow = async () => {
    await refreshData();
  };

  const refreshData = async () => {
    const { startTime, endTime } = handleStartEnd(selectedRange);
    setIsLoadingHealthScore(true);
    setIsLoadingPieChart(true);
    setIsLoadingTopServices(true);
    setIsLoadingTopFiveCritical(true);
    setIsLoadingDataSourceLatestAnomaly(true);
    setIsLoadingGraphic(true); // Add loading state for the chart

    const paramsTime = { start_time: startTime, end_time: endTime };
    const params = {
      type: selectedDataSource,
      ...paramsTime,
    };

    try {
      const [
        pieChartRes,
        topServicesRes,
        healthScoreRes,
        topFiveCriticalRes,
        amountServiceListRes,
        dataSourceLatestAnomalyRes,
        chartRes // Add chart response to the array
      ] = await Promise.all([
        GetPieChartsOverview(params),
        GetTopServicesOverview(params),
        GetHealthScoreOverview(paramsTime),
        GetTopFiveCritical(paramsTime),
        GetAmountServiceList(),
        GetDataSourceLatestAnomaly(),
        fetchServicesOption({
          ...paramsTime,
          type: ANOMALY_AMOUNT_TYPE,
        }),
        GetChartsOverview(paramsTime), // Fetch chart data
      ]);

      // Handle results after all calls complete
      setPieChartData(pieChartRes.data.data);
      setTopServicesData(topServicesRes.data);
      if (healthScoreRes.data == null) throw Error("Empty response data");
      setHealthScoreData(healthScoreRes.data);
      setTopFiveCriticalData(topFiveCriticalRes.data ?? []);
      setAmountServiceList(amountServiceListRes.data);
      setDataSourceLatestAnomalyData(dataSourceLatestAnomalyRes.data ?? []);

      // Reset error states
      setIsErrorHealthScore(false);
      setIsErrorTopFiveCritical(false);
      setIsErrorDataSourceLatestAnomaly(false);

    } catch (error) {
      console.error('Error occurred:', error);

      // Handle errors for each call as needed
      setPieChartData([]);
      setTopServicesData(null);
      setHealthScoreData([]);
      setTopFiveCriticalData([]);
      setAmountServiceList(['']);
      setDataSourceLatestAnomalyData([]);
      setChartData([]); // Handle error for chart data

      // Set error states
      setIsErrorHealthScore(true);
      setIsErrorTopFiveCritical(true);
      setIsErrorDataSourceLatestAnomaly(true);

    } finally {
      // Always reset loading states after completion
      setIsLoadingHealthScore(false);
      setIsLoadingPieChart(false);
      setIsLoadingTopServices(false);
      setIsLoadingTopFiveCritical(false);
      setIsLoadingDataSourceLatestAnomaly(false);
      setIsLoadingGraphic(false); // Reset loading state for the chart
    }
  };

  // Handle auto-refresh toggling and interval selection
  const handleAutoRefreshChange = (autoRefresh: boolean, interval: number) => {
    setAutoRefresh(autoRefresh);
    setRefreshInterval(autoRefresh ? interval : null); // Set the interval if auto-refresh is on

  };

  // useEffect to handle auto-refresh based on user settings
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (autoRefresh && refreshInterval) {
      // Set up the interval for auto-refresh
      intervalId = setInterval(() => {
        refreshData(); // Use the same function for auto-refresh
      }, refreshInterval);
    }

    // Clean up the interval when auto-refresh is disabled or the component is unmounted
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefresh, refreshInterval, selectedRange, selectedDataSource, amountServiceList]);

  useEffect(() => {
    const { startTime, endTime } = handleStartEnd(selectedRange);


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
        setPieChartData(res.data.data)
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
        setTopServicesData(null)
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

    GetChartsOverview(paramsTime)
      .then((res) => {
        setChartData(res.data);
        setIsLoadingGraphic(false);
      })
      .catch(() => {
        setChartData([]);
        setIsLoadingGraphic(false);
      });
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
          <AutoRefreshButton onRefresh={handleRefreshNow} onAutoRefreshChange={handleAutoRefreshChange} />
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
            <BRImoEndToEndPanel
              data={healthScoreData}
              isLoading={isLoadingHealthScore}
              isError={isErrorHealthScore}
            />
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
                          labels={pieChartData.map((sditem: any) => SEVERITY_LABELS[sditem.severity])}
                        />
                      </DonutChartWrapper>
                      <TableSeverityWrapper
                        isLoading={isLoadingPieChart}
                      >
                        <TableSeverity
                          tableHeader={thSeverity}
                          data={pieChartData}
                          clickable={selectedDataSource?.length > 0}
                          queryParams={{
                            time_range: autoRefresh ? selectedRange : `${startTime} - ${endTime}`,
                            data_source: selectedDataSource
                          }}
                        />
                      </TableSeverityWrapper>
                    </div>
                    <TableServicesWrapper
                      isLoading={isLoadingTopServices}
                    >
                      <TableServices
                        data={topServicesData?.data}
                        tableHeader={topServicesData?.header ?? []}
                        dataKeys={configDataKey}
                        maxHeight={tableMaxHeight}
                        selectedDataSource={selectedDataSource}
                        queryParams={{
                          ...(autoRefresh
                            ? { time_range: selectedRange }  // Use time_range if autoRefresh is true
                            : { time_range: `${startTime} - ${endTime}` }  // Use start_time and end_time if autoRefresh is false
                          ),
                        }}
                      />
                      <TooltipServiceCollection
                        data={topServicesData?.data}
                      />
                    </TableServicesWrapper>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-8 card">
                  <span className="font-bold text-white text-2xl">Highlighted Anomalies</span>
                  <TableTopCritical
                    data={topFiveCriticalData}
                    isLoading={isLoadingTopFiveCritical}
                    queryParams={{
                      time_range: autoRefresh ? selectedRange : `${startTime} - ${endTime}`,
                    }}
                  />
                </div>
              </div>
            </div>

            <LatestAnomalyPanel
              timeRange={selectedRange}
              isFullscreen={handle.active}
            />

            <GraphWrapper isLoading={isLoadingGraphic}>
              <div className='flex flex-col gap-6 z-0'>
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
              </div>
            </GraphWrapper>

            <AnomalyAmountPanel
              timeRange={selectedRange}
              isFullscreen={handle.active}
            />
          </div>
        </div>
      </FullScreen>
    </div>

  )
}

export default MainPageOverview
