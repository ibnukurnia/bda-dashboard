'use client'; // Enables React Server Components (Next.js feature)

import './main-page.css'; // Import global styles
import { useLayoutEffect, useMemo, useState } from 'react'; // React hooks
import { Stack, Typography } from '@mui/material'; // MUI components
import { Maximize } from 'react-feather'; // Icon for maximizing (used with the fullscreen feature)
import { useLocalStorage } from '@/hooks/use-storage'; // Custom hook for managing local storage
import { FullScreen, useFullScreenHandle } from 'react-full-screen'; // Fullscreen API utilities
import { GetForecastingData } from '@/modules/usecases/forecasting'; // API function to fetch forecasting data
import FilterPanel from './button/filter-panel'; // Custom filter panel component
import SynchronizedCharts from './chart/synchronized-charts'; // Custom chart component
import Button from '@/components/system/Button/Button'; // Custom button component
import useInterval from '@/hooks/use-interval'; // Custom hook for handling intervals
import { format, isToday } from 'date-fns'; // Utilities for working with dates
import Skeleton from '@/components/system/Skeleton/Skeleton'; // Skeleton loader for loading states

const ChartWrapper = ({
  isLoading,
  isError,
  children,
}: {
  isLoading: boolean;
  isError: boolean;
  children: React.ReactNode;
}) => {
  if (isLoading) {
    return (
      <Skeleton width={'100%'} height={400} />
    )
  }
  if (isError) {
    return (
      <span className="w-full text-center text-white content-center">
        Terjadi kesalahan. Silakan refresh halaman ini atau coba beberapa saat lagi
      </span>
    )
  }
  return children
}

const MainPageForecasting = () => {
  // State for graph data
  const [graphData, setGraphData] = useState<any[]>([]);

  // State for filter values
  const [filter, setFilter] = useState<{
    sourceData: string | null;
    serviceName: string | null;
    selectedDate: string;
    selectedMethod: string;
  }>({
    sourceData: null,
    serviceName: null,
    selectedDate: '',
    selectedMethod: 'XGBoost', // Default method
  });

  // State for persisting filter values in local storage
  const [filterValue, setFilterValue] = useLocalStorage('filter', undefined);

  // State for chart loading
  const [chartLoading, setChartLoading] = useState(false);

  // State for chart error
  const [chartError, setChartError] = useState(false);

  // State for zoom level in charts
  const [zoomLevel, setZoomLevel] = useState({
    maxZoom: undefined as number | undefined,
    minZoom: undefined as number | undefined,
  });

  // Fullscreen handler
  const handle = useFullScreenHandle();

  // Function to apply filters and fetch data
  const handleApplyFilters = async (filters: {
    selectedSource: string | null;
    selectedService: string | null;
    selectedDate: string;
    selectedMethod: string;
  }) => {
    const { selectedSource, selectedService, selectedDate, selectedMethod } = filters;

    // Update filter state and show loading indicator
    setChartLoading(true);
    setFilter({
      ...filter,
      sourceData: selectedSource,
      serviceName: selectedService,
      selectedMethod: selectedMethod,
      selectedDate,
    });

    // Fetch data with updated filters
    GetForecastingData({
      data_source: selectedSource ?? '',
      service_name: selectedService ?? '',
      date: selectedDate,
      method: selectedMethod,
    })
      .then((res) => {
        if (res.data == null) {
          setChartError(true)
          return
        }
        setGraphData(res.data); // Update graph data
        setChartError(false)
      })
      .catch(() => setChartError(true)) // Handle errors
      .finally(() => setChartLoading(false));

    // Persist filter values in local storage
    setFilterValue({ dataSource: selectedSource, service: selectedService, date: selectedDate });
  };

  // Function to update zoom level
  const handleZoom = (value?: { maxZoom?: number; minZoom?: number }) => {
    setZoomLevel({ ...zoomLevel, ...value });
  };

  // Fetch initial data on component mount
  useLayoutEffect(() => {
    setChartLoading(true);
    const { dataSource = "tpm", service = "All", date = format(new Date(), "yyyy-MM-dd") } = filterValue || {};
    setFilter({
      ...filter,
      sourceData: dataSource,
      serviceName: service,
      selectedDate: date,
    });

    // Fetch data with default filters
    GetForecastingData({
      data_source: dataSource,
      service_name: service,
      date,
      method: 'XGBoost',
    })
      .then((res) => {
        if (res.data == null) {
          setChartError(true)
          return
        }
        setGraphData(res.data); // Update graph data
        setChartError(false)
      })
      .catch(() => setChartError(true)) // Handle errors
      .finally(() => setChartLoading(false));
  }, []);

  // Use interval to periodically fetch data if conditions are met
  useInterval(
    fetchData,
    60000,
    filter.sourceData != null &&
    filter.serviceName != null &&
    filter.selectedDate != null &&
    isToday(filter.selectedDate)
  );

  // Function to fetch data
  async function fetchData() {
    GetForecastingData({
      data_source: filter.sourceData ?? '',
      service_name: filter.serviceName ?? '',
      date: filter.selectedDate,
      method: filter.selectedMethod,
    })
      .then((res) => {
        if (res.data == null) {
          setChartError(true)
          return
        }
        setGraphData(res.data); // Update graph data
        setChartError(false)
      })
      .catch(() => setChartError(true)) // Handle errors
      .finally(() => setChartLoading(false));
  }

  // Memoized chart component to avoid unnecessary re-renders
  const chartIntervalUpdate = useMemo(() => {
    return (
      <SynchronizedCharts
        chartTitle={`${filter.serviceName?.length ? filter.serviceName + ' - ' : ''} ${filter.sourceData}`}
        dataCharts={graphData.map((el) => ({
          ...el,
          title: el?.title?.toLowerCase()?.includes('existing') ? 'Actual' : el?.title,
        }))}
        height={400}
        width="100%"
        setZoom={(e) => handleZoom(e)}
        maxZoom={zoomLevel.maxZoom}
        minZoom={zoomLevel.minZoom}
        selectedDate={filter.selectedDate}
        withAlertThreshold={filter.sourceData === "error_rate"}
      />
    );
  }, [graphData]);

  return (
    <div className="flex flex-col gap-8">
      {/* Filter panel and fullscreen button */}
      <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
        <FilterPanel onApplyFilters={handleApplyFilters} activeFilter={filter} />
        <div className="ml-auto flex">
          <Button onClick={handle.enter}>
            <Maximize className='w-6 h-6' />
          </Button>
        </div>
      </Stack>

      {/* Fullscreen container */}
      <FullScreen className={`${handle.active ? "p-6" : ""} bg-[#05061E] overflow-auto`} handle={handle}>
        <div className="flex flex-col gap-10 px-14 py-12 card-style">
          {/* Conditional rendering for empty filter or chart */}
          {(() => {
            if (!filter.sourceData) {
              return (
                <div className="flex flex-col gap-8">
                  <Typography variant="h5" component="h5" color="white" align="center">
                    PLEASE USE FILTER BUTTON TO FORECAST DATA
                  </Typography>
                </div>
              );
            } else {
              return (
                <div className="flex flex-col gap-8">
                  <Typography variant="h5" component="h5" color="white">
                    Graphic Anomaly Forecasting
                  </Typography>
                  <div className="flex flex-col gap-2">
                    <Typography variant="h6" component="h6" color="white" fontWeight={600}>
                      {`${filter.serviceName?.length ? filter.serviceName + ' - ' : ''} ${filter.sourceData}`}
                    </Typography>
                    <ChartWrapper
                      isLoading={chartLoading}
                      isError={chartError}
                    >
                      {chartIntervalUpdate}
                    </ChartWrapper>
                  </div>
                </div>
              );
            }
          })()}
        </div>
      </FullScreen>
    </div>
  );
};

export default MainPageForecasting;
