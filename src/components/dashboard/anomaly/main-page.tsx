// pages/tabs-page.tsx
'use client'

import { useEffect, useState } from 'react'
import './main-page.css'
import { useSearchParams } from 'next/navigation';
import TabsWithDropdown from './button/tabs-with-dropdown';
import { DEFAULT_DATA_SOURCE_NAMESPACE, DEFAULT_TIME_RANGE } from '@/constants';
import TabContent from './panels/content-panel';

const MainPageAnomaly = () => {
  const logs = ['Log APM', 'Log Brimo']; // Example logs
  const [selectedLog, setSelectedLog] = useState(logs[0]);
  const [activeTab, setActiveTab] = useState('');
  const searchParams = useSearchParams()
  const dataSource = searchParams.get("data_source") ?? DEFAULT_DATA_SOURCE_NAMESPACE
  const timeRange = searchParams.get("time_range") ?? DEFAULT_TIME_RANGE

  useEffect(() => {
    setActiveTab('log'); // Set log as the active tab initially
    if (selectedLog === '') {
      setSelectedLog(logs[0]);
    }
  }, []);



  return (
    <div className="flex flex-col gap-12">
      <TabsWithDropdown
        selectedDataSource={dataSource}
      />
      <TabContent
        selectedDataSource={dataSource}
        selectedTimeRange={timeRange}
      />
    </div>
  )
}

export default MainPageAnomaly;
