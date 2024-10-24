import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { TopServicesResponse } from '@/modules/models/overviews'
import { GetPieChartsOverview, GetTopServicesOverview } from '@/modules/usecases/overviews'
import DropdownDS from '../button/dropdown-ds'
import DonutChartWrapper from '../wrapper/donut-wrapper'
import DonutChart from '../chart/donut-chart'
import TableSeverityWrapper from '../wrapper/table-severity-wrapper'
import TableSeverity from '../table/table-severity'
import TableServicesWrapper from '../wrapper/table-services-wrapper'
import TableServices from '../table/table-services'
import TooltipServiceCollection from '../collection/tooltip-service-collection'
import { SEVERITY_LABELS } from '@/constants'
import { handleStartEnd } from '@/helper'

const thSeverity = ['Severity', 'Count']
const configDataKey = ['service_name', 'very_high', 'high', 'medium']

interface AnomalyOverviewPanelProps {
  timeRange: string
  isFullscreen: boolean
}

// Define the exposed methods type
export interface AnomalyOverviewPanelHandle {
  refresh: (timeRange: string) => void
}

const AnomalyOverviewPanel = forwardRef<AnomalyOverviewPanelHandle, AnomalyOverviewPanelProps>(({
  timeRange,
  isFullscreen,
}, ref) => {
  const [selectedDataSource, setSelectedDataSource] = useState<string | null | undefined>(null)
  const [pieChartData, setPieChartData] = useState([])
  const [topServicesData, setTopServicesData] = useState<TopServicesResponse | null>(null)
  const [isLoadingPieChart, setIsLoadingPieChart] = useState(true)
  const [isLoadingTopServices, setIsLoadingTopServices] = useState(true)

  // Use useImperativeHandle to expose the custom method
  useImperativeHandle(ref, () => ({
    refresh(timeRange) {
      setIsLoadingPieChart(true)
      setIsLoadingTopServices(true)
      fetchData(timeRange)
    },
  }));

  useEffect(() => {
    setIsLoadingPieChart(true)
    setIsLoadingTopServices(true)
    fetchData()
  }, [timeRange, selectedDataSource])

  function fetchData(customTimeRange?: string) {
    const { startTime, endTime } = handleStartEnd(customTimeRange ?? timeRange);
    const paramsTime = { start_time: startTime, end_time: endTime };
    const params = { ...paramsTime, type: selectedDataSource };

    // Fetch Pie Chart Data
    GetPieChartsOverview(params)
      .then((res) => {
        setPieChartData(res.data.data);
        setIsLoadingPieChart(false);
      })
      .catch(() => {
        setPieChartData([]);
        setIsLoadingPieChart(false);
      });

    // Fetch Top Services Data
    GetTopServicesOverview(params)
      .then((res) => {
        setTopServicesData(res.data);
        setIsLoadingTopServices(false);
      })
      .catch(() => {
        setTopServicesData(null);
        setIsLoadingTopServices(false);
      });
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex flex-col gap-8 card">
        <div className="flex justify-between items-center">
          <span className="font-bold text-white text-2xl">Anomaly Overview</span>
          {!isFullscreen && <DropdownDS
            onSelectData={(e) => setSelectedDataSource(e)}
            selectedData={selectedDataSource}
          />}
        </div>
        <div className="grid grid-cols-2 2xl:flex 2xl:flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <DonutChartWrapper
              isLoading={isLoadingPieChart}
            >
              <DonutChart
                series={pieChartData.map((item: any) => item.count)}
                labels={pieChartData.map((sditem: any) => SEVERITY_LABELS[sditem.severity])}
              />
            </DonutChartWrapper>
            <TableSeverityWrapper
              isLoading={isLoadingPieChart}
            >
              <TableSeverity
                tableHeader={thSeverity}
                data={pieChartData}
                clickable={selectedDataSource != null}
                queryParams={{
                  time_range: timeRange,
                  data_source: selectedDataSource
                }}
              />
            </TableSeverityWrapper>
          </div>
          <TableServicesWrapper
            isLoading={isLoadingTopServices}
          >
            <TableServices
              data={topServicesData?.data}
              tableHeader={topServicesData?.header ?? []}
              dataKeys={configDataKey}
              selectedDataSource={selectedDataSource}
              queryParams={{
                time_range: timeRange,
              }}
            />
            <TooltipServiceCollection
              data={topServicesData?.data}
            />
          </TableServicesWrapper>
        </div>
      </div>
    </div>
  )
})

export default AnomalyOverviewPanel
