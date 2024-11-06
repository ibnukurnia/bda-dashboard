'use client'

import React, { useEffect, useRef, useState } from 'react'
import './main-page.css'
import { Maximize } from 'react-feather'
import {
  GetChartsOverview,
} from '@/modules/usecases/overviews'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import Button from '@/components/system/Button/Button'
import DropdownTime from './button/dropdown-time'
import DynamicUpdatingChart from './chart/dynamic-updating-chart'
import GraphWrapper from './wrapper/graph-wrapper'
import AutoRefreshButton from '../anomaly/button/refreshButton'

import BRImoEndToEndPanel, { BRImoEndToEndPanelHandle } from './panels/brimo-end-to-end-panel'
import LatestAnomalyPanel, { LatestAnomalyPanelHandle } from './panels/latest-anomaly-panel'
import AnomalyAmountPanel, { AnomalyAmountPanelHandle } from './panels/anomaly-amount-panel'
import TopCriticalPanel, { TopCriticalPanelHandle } from './panels/top-critical-panel'
import AnomalyOverviewPanel, { AnomalyOverviewPanelHandle } from './panels/anomaly-overview-panel'
import { handleStartEnd } from '@/helper'
import useUpdateEffect from '@/hooks/use-update-effect'
import { MetricsResponse } from '@/modules/models/overviews'

const defaultTimeRanges: Record<string, number> = {
  'Last 5 minutes': 5,
  'Last 10 minutes': 10,
  'Last 15 minutes': 15,
  'Last 30 minutes': 30,
  'Last 1 hours': 60,
  'Last 3 hours': 180,
}

const MainPageOverview = () => {
  const [timeRanges, setTimeRanges] = useState<Record<string, number>>(defaultTimeRanges)
  const [selectedRange, setSelectedRange] = useState<string>('Last 15 minutes')
  const [lastTimeRange, setLastTimeRange] = useState(handleStartEnd(selectedRange))
  const [chartData, setChartData] = useState<MetricsResponse[] | null>([])
  const [isLoadingGraphic, setIsLoadingGraphic] = useState(true)
  const [isCustomRangeSelected, setIsCustomRangeSelected] = useState<boolean>(false);

  const brimoEndToEndRef = useRef<BRImoEndToEndPanelHandle>(null)
  const anomalyOverviewRef = useRef<AnomalyOverviewPanelHandle>(null)
  const topCriticalRef = useRef<TopCriticalPanelHandle>(null)
  const latestAnomalyRef = useRef<LatestAnomalyPanelHandle>(null)
  const anomalyAmountRef = useRef<AnomalyAmountPanelHandle>(null)

  // const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  // const [timeDifference, setTimeDifference] = useState<string>('Refreshed just now');
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const handle = useFullScreenHandle();

  const handleChangeTimeRange = (time: string) => {
    const { startTime, endTime } = handleStartEnd(time);
    // Create Date objects for start and end times (use local time instead of UTC)
    const startDateObj = new Date(startTime);
    const endDateObj = new Date(endTime);

    startDateObj.setSeconds(0, 0);
    endDateObj.setSeconds(0, 0);

    setSelectedRange(time);
    setIsLoadingGraphic(true)

    const paramsTime = { start_time: startTime, end_time: endTime };

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

  const handleRefreshNow = async () => {
    await refreshData();
  };

  const refreshData = async () => {
    const { startTime, endTime } = handleStartEnd(selectedRange);
    brimoEndToEndRef.current?.refresh(selectedRange)
    anomalyOverviewRef.current?.refresh(selectedRange)
    topCriticalRef.current?.refresh(selectedRange)
    latestAnomalyRef.current?.refresh(selectedRange)
    anomalyAmountRef.current?.refresh()
    setIsLoadingGraphic(true); // Add loading state for the chart

    const paramsTime = { start_time: startTime, end_time: endTime };

    try {
      const [
        chartRes // Add chart response to the array
      ] = await Promise.all([
        GetChartsOverview(paramsTime), // Fetch chart data
      ]);

    } catch (error) {
      console.error('Error occurred:', error);

      // Handle errors for each call as needed
      setChartData([]); // Handle error for chart data

    } finally {
      // Always reset loading states after completion
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
    const paramsTime = { start_time: startTime, end_time: endTime }

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

  useUpdateEffect(() => {
    const { startTime, endTime } = handleStartEnd(selectedRange)
    setLastTimeRange({ startTime: startTime, endTime: endTime })
  }, [selectedRange])

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
            <Maximize className='w-6 h-5' />
          </Button>
        </div>
      </div>
      <FullScreen className={`${handle.active ? "p-6 bg-[#05061E] overflow-auto" : ""} `} handle={handle}>
        <div className="flex flex-row">
          <div className="flex-1 grid gap-8">
            <BRImoEndToEndPanel
              ref={brimoEndToEndRef}
              timeRange={autoRefresh ? selectedRange : `${lastTimeRange.startTime} - ${lastTimeRange.endTime}`}
            />
            <div className="grid 2xl:grid-cols-2 grid-cols-1 gap-8">
              <AnomalyOverviewPanel
                ref={anomalyOverviewRef}
                timeRange={autoRefresh ? selectedRange : `${lastTimeRange.startTime} - ${lastTimeRange.endTime}`}
                isFullscreen={handle.active}
              />
              <TopCriticalPanel
                ref={topCriticalRef}
                timeRange={autoRefresh ? selectedRange : `${lastTimeRange.startTime} - ${lastTimeRange.endTime}`}
              />
            </div>

            {<LatestAnomalyPanel
              ref={latestAnomalyRef}
              timeRange={autoRefresh ? selectedRange : `${lastTimeRange.startTime} - ${lastTimeRange.endTime}`}
              isFullscreen={handle.active}
            />}

            <div className='flex flex-col gap-8 z-0'>
              <span className="font-bold text-white text-2xl">Graphic</span>
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
                <GraphWrapper isLoading={isLoadingGraphic}>
                  {chartData?.map((item, id) => (
                    <DynamicUpdatingChart
                      key={item.title}
                      title={item.title}
                      subtitle={item.sub}
                      series={item.data}
                      spike={item.last_spike}
                      id={id}
                      startTime={lastTimeRange.startTime}
                      endTime={lastTimeRange.endTime}
                    />
                  ))}
                </GraphWrapper>
              </div>
            </div>

            <AnomalyAmountPanel
              ref={anomalyAmountRef}
              isFullscreen={handle.active}
            />
          </div>
        </div>
      </FullScreen>
    </div>

  )
}

export default MainPageOverview
