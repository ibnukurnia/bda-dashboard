import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { GetAmountGraphic } from '@/modules/usecases/overviews';
import { AnomalyAmountResponse } from '@/modules/models/overviews';
import { format } from 'date-fns';
import DropdownAnomalyAmountService from '../button/dropdown-anomaly-amount-service';
import AnomalyAmountWrapper from '../wrapper/anomaly-amount-wrapper';
import AnomalyAmountChart from '../chart/anomaly-amount-chart';

const toMilliseconds = 1000 * 60;

// Hardcoded default view range (e.g., 1 hour for default view)
const DEFAULT_VIEW_RANGE_MINUTES = 60;

// Set start and end times
const handleStartEnd = () => {
  const currentTime = new Date();
  const endTime = format(currentTime, 'yyyy-MM-dd HH:mm:ss');

  const midnight = new Date(currentTime);
  midnight.setHours(0, 0, 0, 0); // Set to midnight of the current day
  const startTime = format(midnight, 'yyyy-MM-dd HH:mm:ss');

  return { startTime, endTime };
};

interface AnomalyAmountPanelProps {
  isFullscreen: boolean;
  refreshSignal: number; // Signal to trigger refresh
}

// Define the exposed methods type
export interface AnomalyAmountPanelHandle {
  refresh: (timeRange: string) => void;
}

const AnomalyAmountPanel = forwardRef<AnomalyAmountPanelHandle, AnomalyAmountPanelProps>(
  ({ refreshSignal, isFullscreen }, ref) => {
    const [selectedAnomalyAmountService, setSelectedAnomalyAmountService] = useState<string[]>([]);
    const [anomalyAmountData, setAnomalyAmountData] = useState<AnomalyAmountResponse[] | null>([]);
    const [isLoadingAnomalyAmount, setIsLoadingAnomalyAmount] = useState(true);
    const [xaxisRange, setXaxisRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });

    // Use useImperativeHandle to expose the custom method
    useImperativeHandle(ref, () => ({
      refresh(timeRange) {
        fetchData();
      },
    }));

    useEffect(() => {
      fetchData();
    }, [selectedAnomalyAmountService]); // Runs when selected services change

    useEffect(() => {
      // Re-fetch data when refreshSignal changes
      fetchData();
    }, [refreshSignal]);

    // Function to fetch data with a hardcoded time range from midnight to the current time
    function fetchData() {
      if (selectedAnomalyAmountService.length === 0) return;

      setIsLoadingAnomalyAmount(true);

      const { startTime, endTime } = handleStartEnd();

      const paramsAmount = {
        start_time: startTime,
        end_time: endTime,
        service_name: selectedAnomalyAmountService,
      };

      GetAmountGraphic(paramsAmount)
        .then((res) => {
          setAnomalyAmountData(res.data);

          // Set the initial view to the most recent hour or a default view range
          const endTimestamp = new Date().getTime();
          const startTimestamp = endTimestamp - DEFAULT_VIEW_RANGE_MINUTES * toMilliseconds;
          setXaxisRange({ min: startTimestamp, max: endTimestamp });
        })
        .catch((error) => {
          console.error('Error fetching anomaly amount data:', error);
          setAnomalyAmountData([]); // Handle error
        })
        .finally(() => {
          setIsLoadingAnomalyAmount(false);
        });
    }

    // Handle Zoom Out (show newer data)
    const handleZoomOut = () => {
      const newMax = xaxisRange.max;
      const newMin = Math.max(xaxisRange.min - DEFAULT_VIEW_RANGE_MINUTES * toMilliseconds, new Date().setHours(0, 0, 0, 0));

      setXaxisRange({ min: newMin, max: newMax });
    };

    // Handle Zoom In (show older data)
    const handleZoomIn = () => {
      const newMin = xaxisRange.min;
      const newMax = Math.min(xaxisRange.max - DEFAULT_VIEW_RANGE_MINUTES * toMilliseconds, new Date().getTime());

      setXaxisRange({ min: newMin, max: newMax });
    };

    return (
      <div className="card flex flex-col gap-6">
        <div className="flex justify-between">
          <span className="font-bold text-white text-2xl content-center">Anomaly Amount</span>
          {!isFullscreen && (
            <DropdownAnomalyAmountService onSelectData={(value) => setSelectedAnomalyAmountService(value)} />
          )}
        </div>
        <AnomalyAmountWrapper isLoading={isLoadingAnomalyAmount}>
          <AnomalyAmountChart
            data={anomalyAmountData}
            startTime={format(new Date(xaxisRange.min), 'yyyy-MM-dd HH:mm:ss')} // Convert to string
            endTime={format(new Date(xaxisRange.max), 'yyyy-MM-dd HH:mm:ss')} // Convert to string
            onZoomOut={handleZoomOut}
            onZoomIn={handleZoomIn} // Add Zoom In handler
          />
        </AnomalyAmountWrapper>
      </div>
    );
  }
);

export default AnomalyAmountPanel;
