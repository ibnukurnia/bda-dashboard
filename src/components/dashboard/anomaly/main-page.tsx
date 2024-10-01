// pages/tabs-page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
// import { Box, Stack, Typography } from '@mui/material'
import './main-page.css'
import { useSearchParams } from 'next/navigation';
import TabsWithDropdown from './button/tabs-with-dropdown';
import { DEFAULT_DATA_SOURCE_NAMESPACE, DEFAULT_TIME_RANGE } from '@/constants';
import TabContent from './panels/content-panel';

const MainPageAnomaly = () => {


  const logs = ['Log APM', 'Log Brimo']; // Example logs
  const [selectedLog, setSelectedLog] = useState(logs[0]);
  const [selectedUtilization, setSelectedUtilization] = useState('');
  const [selectedSecurity, setSelectedSecurity] = useState('');
  const [activeTab, setActiveTab] = useState('');
  const [isDropdownOpenLog, setIsDropdownOpenLog] = useState(false);
  const [isDropdownOpenUtilization, setIsDropdownOpenUtilization] = useState(false);
  const [isDropdownOpenSecurity, setIsDropdownOpenSecurity] = useState(false);
  // Explicitly type the refs
  const dropdownRefLog = useRef<HTMLDivElement | null>(null);
  const dropdownRefUtilization = useRef<HTMLDivElement | null>(null);
  const dropdownRefSecurity = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams()
  const dataSource = searchParams.get("data_source") ?? DEFAULT_DATA_SOURCE_NAMESPACE
  const timeRange = searchParams.get("time_range") ?? DEFAULT_TIME_RANGE

  useEffect(() => {
    setActiveTab('log'); // Set log as the active tab initially
    if (selectedLog === '') {
      setSelectedLog(logs[0]);
    }
  }, []);

  // Handle outside click to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRefLog.current && !dropdownRefLog.current.contains(event.target as Node)) {
        setIsDropdownOpenLog(false);
      }
      if (dropdownRefUtilization.current && !dropdownRefUtilization.current.contains(event.target as Node)) {
        setIsDropdownOpenUtilization(false);
      }
      if (dropdownRefSecurity.current && !dropdownRefSecurity.current.contains(event.target as Node)) {
        setIsDropdownOpenSecurity(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div className="flex flex-col gap-10">
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

export default MainPageAnomaly
