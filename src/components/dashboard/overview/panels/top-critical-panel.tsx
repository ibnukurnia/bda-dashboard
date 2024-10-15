import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import TableTopCritical from '../table/table-top-critical'
import { TopFiveLatestCritical } from '@/modules/models/overviews'
import { GetTopFiveCritical } from '@/modules/usecases/overviews'
import { format } from 'date-fns'

const toMiliseconds = 1000 * 60

const defaultTimeRanges: Record<string, number> = {
  'Last 5 minutes': 5,
  'Last 10 minutes': 10,
  'Last 15 minutes': 15,
  'Last 30 minutes': 30,
  'Last 1 hours': 60,
  'Last 3 hours': 180,
}

interface TopCriticalPanelProps {
  timeRange: string
}

export interface TopCriticalPanelHandle {
  getContainerElement: () => HTMLDivElement | null
  refresh: (timeRange: string) => void
}

const TopCriticalPanel = forwardRef<TopCriticalPanelHandle, TopCriticalPanelProps>(({
  timeRange,
}, ref) => {
  const [topFiveCriticalData, setTopFiveCriticalData] = useState<TopFiveLatestCritical[]>([])
  const [isLoadingTopFiveCritical, setIsLoadingTopFiveCritical] = useState(true)  // Create a ref for the button DOM element
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    getContainerElement() {
      return containerRef.current;
    },
    refresh(timeRange) {
      setIsLoadingTopFiveCritical(true)
      fetchData(timeRange)
    },
  }));

  useEffect(() => {
    setIsLoadingTopFiveCritical(true)
    fetchData()
  }, [timeRange])
  
  function fetchData(customTimeRange?: string) {
    const { startTime, endTime } = handleStartEnd(customTimeRange ?? timeRange);

    GetTopFiveCritical({ start_time: startTime, end_time: endTime })
      .then((res) => {
        setTopFiveCriticalData(res.data ?? [])
      })
      .finally(() => {
        setIsLoadingTopFiveCritical(false);
      })
  }

  const handleStartEnd = (time: string) => {
    const timeSplit = time.split(' - ')

    let startTime: string | Date
    let endTime: string | Date

    if (timeSplit.length > 1) {
      startTime = timeSplit?.[0]
      endTime = timeSplit?.[1]
    } else {
      startTime = format(new Date(new Date().getTime() - toMiliseconds * defaultTimeRanges[time]), 'yyyy-MM-dd HH:mm:ss')
      endTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    }

    return { startTime, endTime }
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <div ref={containerRef} className="flex flex-col gap-8 card">
        <span className="font-bold text-white text-2xl">Highlighted Anomalies</span>
        <TableTopCritical
          data={topFiveCriticalData}
          isLoading={isLoadingTopFiveCritical}
          queryParams={{
            time_range: timeRange
          }}
        />
      </div>
    </div>
  )
})

export default TopCriticalPanel
