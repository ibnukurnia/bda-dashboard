'use client'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './main-page.css'
import { format } from 'date-fns'
import { Maximize } from 'react-feather'
import {
  GetChartsOverview,
  GetHealthScoreOverview,
} from '@/modules/usecases/overviews'
import { HealthScoreResponse } from '@/modules/models/overviews'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import Button from '@/components/system/Button/Button'
import DropdownTime from './button/dropdown-time'
import DynamicUpdatingChart from './chart/dynamic-updating-chart'
import GraphWrapper from './wrapper/graph-wrapper'
import AutoRefreshButton from '../anomaly/button/refreshButton'

import BRImoEndToEndPanel from './panels/brimo-end-to-end-panel'
import LatestAnomalyPanel, { LatestAnomalyPanelHandle } from './panels/latest-anomaly-panel'
import AnomalyAmountPanel, { AnomalyAmountPanelHandle } from './panels/anomaly-amount-panel'
import TopCriticalPanel, { TopCriticalPanelHandle } from './panels/top-critical-panel'
import AnomalyOverviewPanel, { AnomalyOverviewPanelHandle } from './panels/anomaly-overview-panel'

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
  const [modalServices, setModalServices] = useState(false)
  const [tableServiceMaxHeight, setTableServiceMaxHeight] = useState(192)
  const [healthScoreData, setHealthScoreData] = useState<HealthScoreResponse[]>([])
  const panelRef = useRef<HTMLDivElement>(null)
  const [timeRanges, setTimeRanges] = useState<Record<string, number>>(defaultTimeRanges)
  const [selectedRange, setSelectedRange] = useState<string>('Last 15 minutes')
  const [chartData, setChartData] = useState<any[]>([])
  const [isLoadingGraphic, setIsLoadingGraphic] = useState(true)
  const [isLoadingHealthScore, setIsLoadingHealthScore] = useState(true)
  const [isErrorHealthScore, setIsErrorHealthScore] = useState(false)
  const [isCustomRangeSelected, setIsCustomRangeSelected] = useState<boolean>(false);

  const anomalyOverviewRef = useRef<AnomalyOverviewPanelHandle>(null)
  const topCriticalRef = useRef<TopCriticalPanelHandle>(null)
  const latestAnomalyRef = useRef<LatestAnomalyPanelHandle>(null)
  const anomalyAmountRef = useRef<AnomalyAmountPanelHandle>(null)

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

    setSelectedRange(time);
    setIsLoadingHealthScore(true);
    setIsLoadingGraphic(true)

    const paramsTime = { start_time: startTime, end_time: endTime };

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
  };

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
    anomalyOverviewRef.current?.refresh(selectedRange)
    topCriticalRef.current?.refresh(selectedRange)
    latestAnomalyRef.current?.refresh(selectedRange)
    anomalyAmountRef.current?.refresh(selectedRange)
    setIsLoadingHealthScore(true);
    setIsLoadingGraphic(true); // Add loading state for the chart

    const paramsTime = { start_time: startTime, end_time: endTime };

    try {
      const [
        healthScoreRes,
        chartRes // Add chart response to the array
      ] = await Promise.all([
        GetHealthScoreOverview(paramsTime),
        GetChartsOverview(paramsTime), // Fetch chart data
      ]);

      // Handle results after all calls complete
      if (healthScoreRes.data == null) throw Error("Empty response data");
      setHealthScoreData(healthScoreRes.data);

      // Reset error states
      setIsErrorHealthScore(false);

    } catch (error) {
      console.error('Error occurred:', error);

      // Handle errors for each call as needed
      setHealthScoreData([]);
      setChartData([]); // Handle error for chart data

      // Set error states
      setIsErrorHealthScore(true);

    } finally {
      // Always reset loading states after completion
      setIsLoadingHealthScore(false);
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
  }, [autoRefresh, refreshInterval, selectedRange]);

  useEffect(() => {
    const { startTime, endTime } = handleStartEnd(selectedRange);


    setIsLoadingHealthScore(true)

    const paramsTime = { start_time: startTime, end_time: endTime }

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

    GetChartsOverview(paramsTime)
      .then((res) => {
        setChartData(res.data);
        setIsLoadingGraphic(false);
      })
      .catch(() => {
        setChartData([]);
        setIsLoadingGraphic(false);
      });
      
    window.addEventListener('resize', handleTableServiceHeight);
    return () => {
      window.removeEventListener('resize', handleTableServiceHeight);
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

  useLayoutEffect(() => {
    handleTableServiceHeight()
  }, [topCriticalRef])

  function handleTableServiceHeight() {
    const containerElement = topCriticalRef?.current?.getContainerElement?.();
    if (containerElement) {
      const calculatedTableHeight = containerElement.offsetHeight - 310
      if (calculatedTableHeight > 192 && window.innerWidth >= 1440) {
        setTableServiceMaxHeight(containerElement.offsetHeight - 310)
      } else if (window.innerWidth < 1440) {
        setTableServiceMaxHeight(260 - 16)
      } else {
        setTableServiceMaxHeight(192)
      }
    }
  }

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
            <div className="grid 2xl:grid-cols-2 grid-cols-1 gap-8">
              <AnomalyOverviewPanel
                ref={anomalyOverviewRef}
                timeRange={autoRefresh ? selectedRange : `${startTime} - ${endTime}`}
                isFullscreen={handle.active}
                tableServiceMaxHeight={tableServiceMaxHeight}
              />
              <TopCriticalPanel
                ref={topCriticalRef}
                timeRange={autoRefresh ? selectedRange : `${startTime} - ${endTime}`}
              />
            </div>

            <LatestAnomalyPanel
              ref={latestAnomalyRef}
              timeRange={autoRefresh ? selectedRange : `${startTime} - ${endTime}`}
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
              ref={anomalyAmountRef}
              timeRange={autoRefresh ? selectedRange : `${startTime} - ${endTime}`}
              isFullscreen={handle.active}
            />
          </div>
        </div>
      </FullScreen>
    </div>

  )
}

export default MainPageOverview
