'use client'

import { useEffect, useState } from 'react'

import './main-page.css'

import RCATree from './tree/rca-tree'
import TableModal from './modal/table-modal'
import { Typography } from '@mui/material'
import DropdownRange from '../dropdownRange'
import AutoRefreshButton from './button/refreshButton'
import { format } from 'date-fns'
import { getTimeDifference } from './helper'
import { GetRootCauseAnalysisTree } from '@/modules/usecases/root-cause-analysis'
import { RootCauseAnalysisTreeResponse } from '@/modules/models/root-cause-analysis'
import useInterval from '@/hooks/use-interval'

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

const MainPageRootCauseAnalysis = () => {
  const [selectedRange, setSelectedRange] = useState<string>('Last 24 hours')
  const [dataTree, setDataTree] = useState<RootCauseAnalysisTreeResponse[] | null>(null)
  const [filter, setFilter] = useState<{
    startTime: string;
    endTime: string;
  }>({
    startTime: format(new Date().setDate(new Date().getDate() - 1), 'yyyy-MM-dd HH:mm:ss'), // 1 Day Ago
    endTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'), // Now
  })
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | undefined>(undefined);
  const [lastUpdateString, setLastUpdateString] = useState("")
  const [autoRefresh, setAutoRefresh] = useState<{
    enabled: boolean;
    interval: number | null;
  }>({
    enabled: false,
    interval: null,
  })
  const [initialLoading, setInitialLoading] = useState(true)
  const [modalServices, setModalServices] = useState(false)

  useEffect(() => {
    fetchData()
  }, [filter])
  
  // Setup auto-refresh if enabled
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (autoRefresh.enabled && autoRefresh.interval) {
        intervalId = setInterval(() => {
          fetchData()
        }, autoRefresh.interval);
    }

    return () => {
        if (intervalId) {
            clearInterval(intervalId);
        }
    };
  }, [autoRefresh]);

  useInterval(fetchData, autoRefresh.interval, autoRefresh.enabled)

  useInterval(() =>
    setLastUpdateString(getTimeDifference(lastRefreshTime)),
  1000, lastRefreshTime != null)

  async function fetchData() {
    GetRootCauseAnalysisTree({ start_time: filter.startTime, end_time: filter.endTime})
    .then(result => {
      setDataTree(result.data)
      setLastRefreshTime(new Date())
    })
    .finally(() => {
      setInitialLoading(false)
    })
  }

  const handleRangeChange = async (rangeKey: string) => {
    let startDate: string;
    let endDate: string;

    if (rangeKey.includes(' - ')) {
        // Handle custom range
        const [start, end] = rangeKey.split(' - ');
        startDate = start;
        endDate = end;
    } else {
        // Handle predefined ranges
        const selectedTimeRange = defaultTimeRanges[rangeKey]; // Get the selected time range in minutes

        // Calculate endDate as the current time, rounding down the seconds to 00
        const endDateObj = new Date();
        endDateObj.setSeconds(0, 0); // Set seconds and milliseconds to 00

        // Calculate startDate by subtracting the selected time range (in minutes) from the endDate
        const startDateObj = new Date(endDateObj.getTime() - selectedTimeRange * 60000); // 60000 ms = 1 minute

        // Convert startDate and endDate to strings
        startDate = format(startDateObj, 'yyyy-MM-dd HH:mm:ss');
        endDate = format(endDateObj, 'yyyy-MM-dd HH:mm:ss');
    }

    // Update the state for startDate and endDate
    setFilter({
      startTime: startDate,
      endTime: endDate,
    })

    // Update the selected range state
    setSelectedRange(rangeKey);
  };

  // Handle auto-refresh toggling and interval selection
  const handleAutoRefreshChange = (autoRefresh: boolean, interval: number) => {
    setAutoRefresh({
      enabled: autoRefresh,
      interval: interval,
    });
  };

  const handleDetail = () => {
    setModalServices(true)
  }

  return (
    <>
      <div className='flex flex-col gap-8'>
        <div className='flex flex-row gap-2 self-end items-center'>
            <div className="flex flex-row gap-2 self-end items-center">
                <Typography variant="body2" component="p" color="white">
                    {lastUpdateString}
                </Typography>
                <DropdownRange
                    timeRanges={defaultTimeRanges}
                    onRangeChange={handleRangeChange}
                    selectedRange={selectedRange} // Pass selectedRange as a prop
                />
            </div>
            <AutoRefreshButton onRefresh={fetchData} onAutoRefreshChange={handleAutoRefreshChange} />
        </div>
        <div className="flex flex-col gap-10 px-2 py-8 card-style">
          <div className="w-full flex flex-col gap-8">
            <div className="px-6">
              <Typography
                variant="h5"
                color={'white'}
              >
                {/* {"Root Cause Log"} */}
              </Typography>
            </div>
            {initialLoading ?
              <div className="flex justify-center items-center">
                  <div className="spinner"></div>
              </div>
              : <RCATree
              data={dataTree}
              handleDetail={handleDetail}
              />
            }
          </div>
        </div>
        {/* <div className="flex flex-col gap-10 px-2 py-8 card-style">
          <div className="w-full flex flex-col gap-8">
            <div className="px-6">
              <Typography
                variant="h5"
                color={'white'}
              >
                {"Root Cause Network"}
              </Typography>
            </div>
            <RCATree
              data={dataTree}
              handleDetail={handleDetail}
            />
          </div>
        </div> */}
      </div>
      {modalServices && (
        <TableModal
          open={modalServices}
          handleOpenModal={setModalServices}
        />
      )}
    </>
  )
}

export default MainPageRootCauseAnalysis
