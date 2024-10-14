import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import DropdownAnomalyAmountService from '../button/dropdown-anomaly-amount-service'
import AnomalyAmountWrapper from '../wrapper/anomaly-amount-wrapper'
import AnomalyAmountChart from '../chart/anomaly-amount-chart'
import { format } from 'date-fns'
import { GetAmountGraphic } from '@/modules/usecases/overviews'
import { AnomalyAmountResponse } from '@/modules/models/overviews'

const toMiliseconds = 1000 * 60

const defaultTimeRanges: Record<string, number> = {
  'Last 5 minutes': 5,
  'Last 10 minutes': 10,
  'Last 15 minutes': 15,
  'Last 30 minutes': 30,
  'Last 1 hours': 60,
  'Last 3 hours': 180,
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

interface AnomalyAmountPanelProps {
  timeRange: string
  isFullscreen: boolean
}

// Define the exposed methods type
export interface AnomalyAmountPanelHandle {
  refresh: (timeRange: string) => void
}

const AnomalyAmountPanel = forwardRef<AnomalyAmountPanelHandle, AnomalyAmountPanelProps>(({
  timeRange,
  isFullscreen,
}, ref) => {
  const [selectedAnomalyAmountService, setSelectedAnomalyAmountService] = useState<string[]>([])
  const [anomalyAmountData, setAnomalyAmountData] = useState<AnomalyAmountResponse[] | null>([])

  const [isLoadingAnomalyAmount, setIsLoadingAnomalyAmount] = useState(true)

  // Use useImperativeHandle to expose the custom method
  useImperativeHandle(ref, () => ({
    refresh(timeRange) {
      fetchData(timeRange)
    },
  }));

  // Get start and end times from selected range for passing to DynamicUpdatingChart
  const { startTime, endTime } = handleStartEnd(timeRange)

  useEffect(() => {
    fetchData()
  }, [timeRange, selectedAnomalyAmountService]); // This effect runs when the service list or selected service changes

  function fetchData(customTimeRange?: string) {
    if (selectedAnomalyAmountService.length === 0) return

    setIsLoadingAnomalyAmount(true);

    // Ensure that amountServiceList is available and contains data before making the API call
    const { startTime, endTime } = handleStartEnd(customTimeRange ?? timeRange);

    const paramsAmount = {
      start_time: startTime,
      end_time: endTime,
      service_name: selectedAnomalyAmountService
    };

    GetAmountGraphic(paramsAmount)
      .then((res) => {
        setAnomalyAmountData(res.data);
      })
      .catch((error) => {
        console.error('Error fetching anomaly amount data:', error);
        setAnomalyAmountData([]); // Handle error
      })
      .finally(() => {
        setIsLoadingAnomalyAmount(false);
      });
  }

  return (
    <div className='card flex flex-col gap-6'>
      <div className='flex justify-between'>
        <span className="font-bold text-white text-2xl content-center">Anomaly Amount</span>
        {!isFullscreen && <DropdownAnomalyAmountService
          onSelectData={(value) => setSelectedAnomalyAmountService(value)}
        />}
      </div>
      <AnomalyAmountWrapper
        isLoading={isLoadingAnomalyAmount}
      >
        <AnomalyAmountChart
          data={anomalyAmountData}
          startTime={startTime} // Pass the calculated startTime
          endTime={endTime} // Pass the calculated endTime
        />
      </AnomalyAmountWrapper>
    </div>
  )
})

export default AnomalyAmountPanel
