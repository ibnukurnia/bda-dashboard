'use client'

// Import necessary libraries and components
import { useEffect, useState } from 'react'
import './main-page.css'
import RCATree from './tree/rca-tree'
import { Typography } from '@mui/material'
import AutoRefreshButton from './button/refreshButton'
import { format } from 'date-fns'
import { getTimeDifference } from './helper'
import { GetRootCauseAnalysisTree } from '@/modules/usecases/root-cause-analysis'
import { NLP } from '@/modules/models/root-cause-analysis'
import useInterval from '@/hooks/use-interval'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import Button from '@/components/system/Button/Button'
import { Maximize } from 'react-feather'
import DropdownTime from './button/dropdown-time'
import { useRouter, useSearchParams } from 'next/navigation'
import { DEFAULT_TIME_RANGE, PREDEFINED_TIME_RANGES } from '@/constants'
import RCATreeWrapper from './wrapper/rca-tree-wrapper'
import { TreeNodeType } from './tree/types'
import CollapsibleNLP from './collapsible/collapsible-nlp'

const MainPageRootCauseAnalysis = () => {
  // States for managing various data and UI behavior
  const [mappedData, setMappedData] = useState<TreeNodeType[]>([]) // Tree data
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | undefined>(undefined) // Last refresh timestamp
  const [lastUpdateString, setLastUpdateString] = useState("") // Human-readable time difference
  const [lastFetchTimeRange, setLastFetchTimeRange] = useState<{ startTime: string | null; endTime: string | null }>({
    startTime: null,
    endTime: null,
  }) // Last fetched time range
  const [autoRefresh, setAutoRefresh] = useState<{ enabled: boolean; interval: number | null }>({
    enabled: false,
    interval: null,
  }) // Auto-refresh state
  const [isLoading, setIsLoading] = useState(true) // Loading state
  const [isError, setIsError] = useState(false) // Error state
  const [nlpData, setNlpData] = useState<{ data_source: string; service: string; nlps: NLP[] } | null>(null) // NLP data for incidents

  const router = useRouter()
  const handle = useFullScreenHandle() // Fullscreen handle
  const searchParams = useSearchParams()

  // Step 1: Get start_time and end_time from URL or use DEFAULT_TIME_RANGE
  const timeRange = searchParams.get("time_range") ?? DEFAULT_TIME_RANGE

  // Fetch data whenever timeRange changes
  useEffect(() => {
    fetchData()
  }, [timeRange])

  // Periodically refresh data if auto-refresh is enabled
  useInterval(fetchData, autoRefresh.interval, autoRefresh.enabled)

  // Update the last update string every second
  useInterval(
    () => setLastUpdateString(getTimeDifference(lastRefreshTime)),
    1000,
    lastRefreshTime != null
  )

  // Fetch the root cause analysis tree data
  async function fetchData() {
    setIsLoading(true) // Start loading state
    const { startTime, endTime } = getTimeRange() // Get the time range
    setLastFetchTimeRange({ startTime, endTime }) // Save fetched time range

    // Fetch data from the API
    GetRootCauseAnalysisTree({ start_time: startTime, end_time: endTime })
      .then(result => {
        if (!result.data) throw Error("Empty response data")
        // Map API response to the tree data format
        setMappedData(
          result.data
            .map(s => ({
              name: s.source,
              namespace: s.type,
              anomalyCount: s.routes.reduce((count, r) => count + r.total, 0),
              children: s.routes.map(r => ({
                name: r.name,
                namespace: r.anomaly,
                anomalyCount: r.total,
                children_fieldname: s.type === "redis" ? "Database" : "Service",
                children: r.impacted_services
                  .map(is => ({
                    name: is.service_alias,
                    cluster: is.cluster,
                    namespace: is.service,
                    fungsi: is.function,
                    anomalyCount: is.total,
                    tooltips: is.tooltips,
                    nlps: is.nlp,
                    detail_params: is.detail_params,
                    children: is.impacted.map(i => ({ name: i })),
                  }))
                  .sort((a, b) => b.anomalyCount - a.anomalyCount),
              }))
                .sort((a, b) => b.anomalyCount - a.anomalyCount),
            }))
            .sort((a, b) => b.anomalyCount - a.anomalyCount)
        )
        setLastRefreshTime(new Date()) // Update refresh timestamp
        setIsError(false) // Clear error state
      })
      .catch(() => {
        setIsError(true) // Handle errors
      })
      .finally(() => {
        setIsLoading(false) // End loading state
      })
  }

  // Helper function to calculate startTime and endTime
  const getTimeRange = () => {
    let startTime: string
    let endTime: string

    if (timeRange.includes(' - ')) {
      // Handle custom range
      const [start, end] = timeRange.split(' - ')
      startTime = start
      endTime = end
    } else {
      // Handle predefined ranges
      const selectedTimeRange = PREDEFINED_TIME_RANGES[timeRange]
      const endDateObj = new Date()
      endDateObj.setSeconds(0, 0) // Round down seconds
      const startDateObj = new Date(endDateObj.getTime() - selectedTimeRange * 60000)
      startTime = format(startDateObj, 'yyyy-MM-dd HH:mm:ss')
      endTime = format(endDateObj, 'yyyy-MM-dd HH:mm:ss')
    }

    return { startTime, endTime }
  }

  // Handle time range changes
  const handleRangeChange = async (rangeKey: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('time_range', rangeKey)
    router.push(`/dashboard/root-cause-analysis?${params.toString()}`)
  }

  // Handle auto-refresh toggling and interval selection
  const handleAutoRefreshChange = (autoRefresh: boolean, interval: number) => {
    setAutoRefresh({ enabled: autoRefresh, interval })
  }

  // Component rendering
  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-row gap-2 self-end items-center'>
        <div className="flex flex-row gap-2 self-end items-center">
          <Typography variant="body2" component="p" color="white">
            {lastUpdateString} {/* Display last update time */}
          </Typography>
          <DropdownTime
            timeRanges={PREDEFINED_TIME_RANGES}
            onRangeChange={handleRangeChange}
            selectedRange={timeRange}
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
            <RCATreeWrapper isError={isError}>
              <RCATree
                data={mappedData}
                fullScreenHandle={handle}
                isLoading={isLoading}
                timeRange={autoRefresh.enabled ? timeRange : `${lastFetchTimeRange.startTime} - ${lastFetchTimeRange.endTime}`}
                handleSelectNLP={(value) => setNlpData(value)}
              />
            </RCATreeWrapper>
          </div>
        </div>
        {nlpData && (
          <div className="rounded-lg p-6 w-full flex flex-col gap-[15px] card-style">
            <Typography fontWeight={700} fontSize={'18px'} color={'white'}>
              Related Incident
            </Typography>
            {nlpData.nlps.map((data, idx) => (
              <CollapsibleNLP
                key={data.name}
                title={`${nlpData.data_source} - ${nlpData.service}`}
                data={data}
                badge={idx === 0 ? "most_related" : "additional"}
                isOpen={idx === 0}
              />
            ))}
          </div>
        )}
      </FullScreen>
    </div>
  )
}

export default MainPageRootCauseAnalysis
