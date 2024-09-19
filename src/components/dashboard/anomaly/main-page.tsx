// pages/tabs-page.tsx
'use client'

import { SetStateAction, useContext, useEffect, useRef, useState } from 'react'
// import { Box, Stack, Typography } from '@mui/material'
import updatedAnomalyData from '@/lib/data/anomaly'
import { Anomaly } from '@/types/anomaly'; // Import the Anomaly type
import {
  Column,
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Table,
  useReactTable,
} from '@tanstack/react-table'
import './main-page.css'
import TabLogContent from './panels/log-panel'
import TabUtilizationContent from './panels/utilization.panel'
import TabNetworkContent from './panels/network-panel'
import TabSecurityContent from './panels/security-panel'
import { OverviewContext } from '@/contexts/overview-context'
import { useSearchParams } from 'next/navigation';
import TabsWithDropdown from './button/tabs-with-dropdown';
import { DEFAULT_DATA_SOURCE_NAMESPACE, DEFAULT_TIME_RANGE } from '@/constants';
import TabContent from './panels/content-panel';

const MainPageAnomaly = () => {


  const logs = ['Log APM', 'Log Brimo']; // Example logs
  const utilizations = ['Prometheus OCP', 'Prometheus DB']; // Example logs
  const security = ['Palo Alto', 'Fortinet', 'Web Application Security', 'Prtg', 'Zabbix']
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

  const columnHelper = createColumnHelper<Anomaly>();

  const columns: ColumnDef<Anomaly, any>[] = [
    columnHelper.accessor('timestamp', {
      id: 'incident-time',
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Incident Time</span>,
    }),
    columnHelper.accessor('service_name', {
      header: () => <span>Service</span>,
    }),
    columnHelper.accessor('status_code', {
      header: () => <span>Status</span>,
    }),
    columnHelper.accessor('response_time', {
      header: () => <span>Response Time</span>,
    }),
    columnHelper.accessor('pod_name', {
      header: () => <span>Pod</span>,
    }),
  ];

  const handleTabClick = (tab: string) => {
    if (tab === 'log') {
      setIsDropdownOpenUtilization(false);
      setIsDropdownOpenSecurity(false);
      setIsDropdownOpenLog(!isDropdownOpenLog); // Toggle Log dropdown
    } else if (tab === 'utilization') {
      setIsDropdownOpenLog(false);
      setIsDropdownOpenSecurity(false);
      setIsDropdownOpenUtilization(!isDropdownOpenUtilization); // Toggle Utilization dropdown
    } else if (tab === 'network') {
      setIsDropdownOpenLog(false);
      setIsDropdownOpenUtilization(false);
      setIsDropdownOpenSecurity(false);
      setActiveTab('network');
    } else if (tab === 'security') {
      setIsDropdownOpenLog(false);
      setIsDropdownOpenUtilization(false);
      setIsDropdownOpenSecurity(!isDropdownOpenSecurity); // Toggle Security dropdown
    }
  };


  const handleDropdownSelection = (type: string, value: SetStateAction<string>) => {
    if (type === 'log') {
      setSelectedLog(value);
      setActiveTab('log'); // Only set Log tab active when a log is selected
      setSelectedUtilization('');
      setIsDropdownOpenLog(false);
    } else if (type === 'utilization') {
      setSelectedUtilization(value);
      setActiveTab('utilization'); // Only set Utilization tab active when an option is selected
      setSelectedLog('');
      setIsDropdownOpenUtilization(false);
    } else if (type === 'security') {
      setSelectedSecurity(value);
      setActiveTab('security'); // Only set Security tab active when an option is selected
      setSelectedLog('');
      setSelectedUtilization('');
      setIsDropdownOpenSecurity(false);
    }
  };


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
