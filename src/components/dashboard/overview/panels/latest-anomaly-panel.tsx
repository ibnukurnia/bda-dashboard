import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import TableCriticalAnomaly, { TableCriticalAnomalyHandle } from '../table/table-critical-anomaly'
import DropdownDataSourceLatestAnomaly, { DropdownDataSourceLatestAnomalyHandle } from '../button/dropdown-datasource-latest-anomaly'
import DropdownSeverity from '../button/dropdown-severity'

interface LatestAnomalyPanelProps {
  timeRange: string
  isFullscreen: boolean
}

// Define the exposed methods type
export interface LatestAnomalyPanelHandle {
  refresh: (timeRange: string) => void
}

const LatestAnomalyPanel = forwardRef<LatestAnomalyPanelHandle, LatestAnomalyPanelProps>(({
  timeRange,
  isFullscreen,
}, ref) => {
  const [selectedDataSourceLatestAnomaly, setSelectedDataSourceLatestAnomaly] = useState<string | null | undefined>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<{ value: any; id: number; label: string }[]>([])
  const dropdownDataSourceRef = useRef<DropdownDataSourceLatestAnomalyHandle>(null)
  const tableRef = useRef<TableCriticalAnomalyHandle>(null)

  // Use useImperativeHandle to expose the custom method
  useImperativeHandle(ref, () => ({
    refresh(timeRange) {
      dropdownDataSourceRef.current?.refresh(timeRange)
      tableRef.current?.refresh(timeRange)
    },
  }));

  const handleSelectDataSourceLatestAnomaly = (value?: string) => {
    setSelectedDataSourceLatestAnomaly(value);
  }

  const handleSelectSeverity = (value: { value: any; id: number; label: string }) => {
    setSelectedSeverity((prevs) =>
      prevs.some(prev => prev.id === value.id) ?
        prevs.filter(prev => prev.id !== value.id) :
        [...prevs, value]
    );
  }

  return (
    <div className='card flex flex-col gap-8'>
      <div className='flex justify-between'>
        <span className="font-bold text-white text-2xl content-center">Latest Anomaly</span>
        <div className='flex gap-4'>
          {!isFullscreen && <DropdownDataSourceLatestAnomaly
            ref={dropdownDataSourceRef}
            timeRange={timeRange}
            onSelectData={(e) => handleSelectDataSourceLatestAnomaly(e)}
            handleReset={() => setSelectedDataSourceLatestAnomaly(undefined)}
            selectedData={selectedDataSourceLatestAnomaly}
          />}
          {!isFullscreen && <DropdownSeverity
            onSelectData={(e) => handleSelectSeverity(e)}
            handleReset={() => setSelectedSeverity([])}
            selectedData={selectedSeverity}
          />}
        </div>
      </div>
      <TableCriticalAnomaly
        ref={tableRef}
        timeRange={timeRange}
        dataSource={selectedDataSourceLatestAnomaly}
        severity={selectedSeverity}
      />
    </div>
  )
})

export default LatestAnomalyPanel
