'use client'

import React, { useEffect, useRef, useState } from 'react'
import './main-page.css'
import Button from '@/components/system/Button/Button'
import DropdownTime from './button/dropdown-time'
import AutoRefreshButton from '../anomaly/button/refreshButton'
import BRImoEndToEndPanel, { BRImoEndToEndPanelHandle } from './panels/brimo-end-to-end-panel'
import LatestAnomalyPanel, { LatestAnomalyPanelHandle } from './panels/latest-anomaly-panel'
import AnomalyAmountPanel, { AnomalyAmountPanelHandle } from './panels/anomaly-amount-panel'
import TopCriticalPanel, { TopCriticalPanelHandle } from './panels/top-critical-panel'
import AnomalyOverviewPanel, { AnomalyOverviewPanelHandle } from './panels/anomaly-overview-panel'
import DynamicChartPanel, { DynamicChartPanelHandle } from './panels/dynamic-chart-panel'
import useUpdateEffect from '@/hooks/use-update-effect'
import { Maximize } from 'react-feather'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { handleStartEnd } from '@/helper'

const defaultTimeRanges: Record<string, number> = {
  'Last 5 minutes': 5,
  'Last 10 minutes': 10,
  'Last 15 minutes': 15,
  'Last 30 minutes': 30,
  'Last 1 hours': 60,
  'Last 3 hours': 180,
}

const MainPageOverview = () => {
  const [selectedRange, setSelectedRange] = useState<string>('Last 15 minutes')
  const [lastTimeRange, setLastTimeRange] = useState(handleStartEnd(selectedRange))

  const brimoEndToEndRef = useRef<BRImoEndToEndPanelHandle>(null)
  const anomalyOverviewRef = useRef<AnomalyOverviewPanelHandle>(null)
  const topCriticalRef = useRef<TopCriticalPanelHandle>(null)
  const latestAnomalyRef = useRef<LatestAnomalyPanelHandle>(null)
  const dynamicChartRef = useRef<DynamicChartPanelHandle>(null)
  const anomalyAmountRef = useRef<AnomalyAmountPanelHandle>(null)

  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const handle = useFullScreenHandle();

  const handleChangeTimeRange = (time: string) => {
    setSelectedRange(time);
  };

  const handleRefreshNow = async () => {
    await refreshData();
  };

  const refreshData = async () => {
    brimoEndToEndRef.current?.refresh(selectedRange)
    anomalyOverviewRef.current?.refresh(selectedRange)
    topCriticalRef.current?.refresh(selectedRange)
    latestAnomalyRef.current?.refresh(selectedRange)
    dynamicChartRef.current?.refresh(selectedRange)
    anomalyAmountRef.current?.refresh()
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
            timeRanges={defaultTimeRanges}
            onRangeChange={(e) => handleChangeTimeRange(e)}
            selectedRange={selectedRange}
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

            <DynamicChartPanel
              ref={dynamicChartRef}
              timeRange={autoRefresh ? selectedRange : `${lastTimeRange.startTime} - ${lastTimeRange.endTime}`}
            />

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
