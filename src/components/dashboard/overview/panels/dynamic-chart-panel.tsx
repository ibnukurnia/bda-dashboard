import { forwardRef, useImperativeHandle, useState } from 'react'
import GraphWrapper from '../wrapper/graph-wrapper'
import DynamicUpdatingChart from '../chart/dynamic-updating-chart'
import { handleStartEnd } from '@/helper'
import { GetChartsOverview } from '@/modules/usecases/overviews'
import { MetricsResponse } from '@/modules/models/overviews'
import { Collapse } from '@mui/material'
import { ChevronDown, ChevronUp } from 'react-feather'
import useUpdateEffect from '@/hooks/use-update-effect'

interface DynamicChartPanelProps {
  timeRange: string
}

// Define the exposed methods type
export interface DynamicChartPanelHandle {
  refresh: (timeRange: string) => void
}

const DynamicChartPanel = forwardRef<DynamicChartPanelHandle, DynamicChartPanelProps>(({
  timeRange,
}, ref) => {
  const [expanded, setExpanded] = useState(false); // State to toggle the collapsible section

  const [chartData, setChartData] = useState<MetricsResponse[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastTimeRange, setLastTimeRange] = useState(handleStartEnd(timeRange))
  const [paramsTime, setParamsTime] = useState(handleStartEnd(timeRange))
  const [fetchRequired, setFetchRequired] = useState(true)

  // Use useImperativeHandle to expose the custom method
  useImperativeHandle(ref, () => ({
    refresh(timeRange) {
      if (!expanded) return
      setIsLoading(true)
      setFetchRequired(true)
      const customParamsTime = handleStartEnd(timeRange)
      setParamsTime(customParamsTime)
      fetchData(customParamsTime)
    },
  }));

  useUpdateEffect(() => {
    setParamsTime(handleStartEnd(timeRange))
    setFetchRequired(true)
    if (expanded) {
      setIsLoading(true)
      fetchData(handleStartEnd(timeRange))
    }
  }, [timeRange])

  useUpdateEffect(() => {
    if (!expanded || !fetchRequired) return
    setIsLoading(true)
    fetchData()
  }, [expanded])

  // Fetch Chart Data
  function fetchData(customParamsTime?: { startTime: string, endTime: string }) {
    GetChartsOverview({
      start_time: customParamsTime?.startTime ?? paramsTime.startTime,
      end_time: customParamsTime?.endTime ?? paramsTime.endTime
    })
      .then((res) => {
        setChartData(res.data);
        setLastTimeRange({
          startTime: customParamsTime?.startTime ?? paramsTime.startTime,
          endTime: customParamsTime?.endTime ?? paramsTime.endTime,
        })
      })
      .catch(() => {
        setChartData([]);
      })
      .finally(() => {
        setIsLoading(false);
        setFetchRequired(false)
      });
  }

  return (
    <div className='card flex flex-col gap-8'>
      <div
        className="flex gap-[10px] items-center justify-between cursor-pointer"
        onClick={() => setExpanded((prev) => !prev)} // Toggle open/close on click
      >
        <span className="font-bold text-white text-2xl">Graphic</span>
        {expanded ?
          <ChevronUp
            size={24}
            color='white'
          /> :
          <ChevronDown
            size={24}
            color='white'
          />
        }
      </div>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
          <GraphWrapper isLoading={isLoading}>
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
      </Collapse>
    </div>
  )
})

export default DynamicChartPanel
