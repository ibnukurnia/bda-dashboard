'use client'

import { Fragment, useEffect, useState } from 'react'

import './main-page.css'

import RCATree from './tree/rca-tree'
import TableModal from './modal/table-modal'
import { Typography } from '@mui/material'
// import DropdownRange from '../dropdownRange'
import AutoRefreshButton from './button/refreshButton'
import { format } from 'date-fns'
import { getTimeDifference } from './helper'
import { GetRootCauseAnalysisTree } from '@/modules/usecases/root-cause-analysis'
import { NLP, RootCauseAnalysisTreeResponse } from '@/modules/models/root-cause-analysis'
import useInterval from '@/hooks/use-interval'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import Button from '@/components/system/Button/Button'
import { Maximize } from 'react-feather'
import DropdownTime from './button/dropdown-time'
import { useRouter, useSearchParams } from 'next/navigation'
import { DEFAULT_TIME_RANGE, PREDEFINED_TIME_RANGES } from '@/constants'
import RCATreeWrapper from './wrapper/rca-tree-wrapper'
import TooltipCollection from './collection/tooltip-collection'
import TableNLP from './table/table'

const MainPageRootCauseAnalysis = () => {
  const [dataTree, setDataTree] = useState<RootCauseAnalysisTreeResponse[] | null>(null)
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | undefined>(undefined);
  const [lastUpdateString, setLastUpdateString] = useState("")
  const [autoRefresh, setAutoRefresh] = useState<{
    enabled: boolean;
    interval: number | null;
  }>({
    enabled: false,
    interval: null,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [nlpData, setNlpData] = useState<NLP | null>(null)

  const router = useRouter()
  const handle = useFullScreenHandle();
  const searchParams = useSearchParams()

  // Step 1: Get start_time and end_time from URL or use DEFAULT_TIME_RANGE
  const timeRange = searchParams.get("time_range") ?? DEFAULT_TIME_RANGE;

  useEffect(() => {
    fetchData()
  }, [searchParams]);

  useInterval(fetchData, autoRefresh.interval, autoRefresh.enabled)

  useInterval(() =>
    setLastUpdateString(getTimeDifference(lastRefreshTime)),
    1000, lastRefreshTime != null)

  async function fetchData() {
    const { startTime, endTime } = getTimeRange()
    GetRootCauseAnalysisTree({ start_time: startTime, end_time: endTime })
      .then(result => {
        setDataTree(result.data)
        setLastRefreshTime(new Date())
        setIsError(false)
      })
      .catch(() => {
        setIsError(true)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  // Helper function to calculate startTime and endTime
  const getTimeRange = () => {
    let startTime: string
    let endTime: string

    if (timeRange.includes(' - ')) {
      // Handle custom range
      const [start, end] = timeRange.split(' - ');
      startTime = start;
      endTime = end;
    } else {
      // Handle predefined ranges
      const selectedTimeRange = PREDEFINED_TIME_RANGES[timeRange]; // Get the selected time range in minutes

      // Calculate endDate as the current time, rounding down the seconds to 00
      const endDateObj = new Date();
      endDateObj.setSeconds(0, 0); // Set seconds and milliseconds to 00

      // Calculate startDate by subtracting the selected time range (in minutes) from the endDate
      const startDateObj = new Date(endDateObj.getTime() - selectedTimeRange * 60000); // 60000 ms = 1 minute

      // Convert startDate and endDate to strings
      startTime = format(startDateObj, 'yyyy-MM-dd HH:mm:ss');
      endTime = format(endDateObj, 'yyyy-MM-dd HH:mm:ss');
    }

    return { startTime, endTime };
  };

  const handleRangeChange = async (rangeKey: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('time_range', rangeKey);
    router.push(`/dashboard/root-cause-analysis?${params.toString()}`);
  };

  // Handle auto-refresh toggling and interval selection
  const handleAutoRefreshChange = (autoRefresh: boolean, interval: number) => {
    setAutoRefresh({
      enabled: autoRefresh,
      interval: interval,
    });
  };

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-row gap-2 self-end items-center'>
        <div className="flex flex-row gap-2 self-end items-center">
          <Typography variant="body2" component="p" color="white">
            {lastUpdateString}
          </Typography>
          <DropdownTime
            timeRanges={PREDEFINED_TIME_RANGES}
            onRangeChange={handleRangeChange}
            selectedRange={timeRange} // Pass timeRange as a prop
          />
        </div>
        <AutoRefreshButton onRefresh={fetchData} onAutoRefreshChange={handleAutoRefreshChange} />
        <Button onClick={handle.enter}>
          <Maximize className='w-6 h-5' />
        </Button>
      </div>
      <FullScreen className={`${handle.active ? "p-6 bg-[#05061E] overflow-auto" : ""} flex flex-col gap-8`} handle={handle}>
        <div className={`flex flex-col gap-10 px-2 py-8 overflow-hidden card-style`}>
          <div className="w-full flex flex-col gap-8">
            <RCATreeWrapper
              isError={isError}
            >
              <RCATree
                data={dataTree}
                fullScreenHandle={handle}
                isLoading={isLoading}
                timeRange={timeRange}
                handleSelectNLP={(value) => setNlpData(value)}
              />
              <TooltipCollection
                data={dataTree}
              />
            </RCATreeWrapper>
          </div>
        </div>
        {nlpData && (
          <TableNLP
            data={nlpData}
          />
        )}
      </FullScreen>
    </div>
  )
}

export default MainPageRootCauseAnalysis
