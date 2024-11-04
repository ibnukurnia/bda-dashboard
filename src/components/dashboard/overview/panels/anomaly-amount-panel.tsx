import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { GetAmountGraphic } from '@/modules/usecases/overviews';
import { AnomalyAmountResponse } from '@/modules/models/overviews';
import { format } from 'date-fns';
import DropdownAnomalyAmountService from '../button/dropdown-anomaly-amount-service';
import AnomalyAmountWrapper from '../wrapper/anomaly-amount-wrapper';
import AnomalyAmountChart from '../chart/anomaly-amount-chart';

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
}

// Define the exposed methods type
export interface AnomalyAmountPanelHandle {
  refresh: () => void;
}

const AnomalyAmountPanel = forwardRef<AnomalyAmountPanelHandle, AnomalyAmountPanelProps>(
  ({ isFullscreen }, ref) => {
    const [selectedAnomalyAmountService, setSelectedAnomalyAmountService] = useState<string[]>([]);
    const [anomalyAmountData, setAnomalyAmountData] = useState<AnomalyAmountResponse[] | null>([]);
    const [isLoadingAnomalyAmount, setIsLoadingAnomalyAmount] = useState(true);

    // Use useImperativeHandle to expose the custom method
    useImperativeHandle(ref, () => ({
      refresh() {
        fetchData();
      },
    }));

    useEffect(() => {
      fetchData();
    }, [selectedAnomalyAmountService]); // Runs when selected services change

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
          />
        </AnomalyAmountWrapper>
      </div>
    );
  }
);

export default AnomalyAmountPanel;
