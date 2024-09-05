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

const MainPageAnomaly = () => {

  const [mostRecentAnomalyData, setMostRecentAnomalyData] = useState([{ data: [400, 430, 448, 470] }]);
  const [mostRecentAnomalyCategory, setMostRecentAnomalyCategory] = useState(['mylta', 'impala', 'pochinkisaldo', 'rozhok']);
  const { metricsOverviews, getMetricsOverview } = useContext(OverviewContext);
  const logs = ['Log APM', 'Log Brimo']; // Example logs
  const utilizations = ['Prometheus OCP', 'Prometheus DB']; // Example logs
  const security = ['Palo Alto', 'Fortinet', 'Web Application Security']
  const [selectedLog, setSelectedLog] = useState(logs[0]);
  const [selectedUtilization, setSelectedUtilization] = useState('');
  const [selectedSecurity, setSelectedSecurity] = useState('');
  const [activeTab, setActiveTab] = useState('');
  const [data, setData] = useState(updatedAnomalyData);
  const [isDropdownOpenLog, setIsDropdownOpenLog] = useState(false);
  const [isDropdownOpenUtilization, setIsDropdownOpenUtilization] = useState(false);
  const [isDropdownOpenSecurity, setIsDropdownOpenSecurity] = useState(false);
  // Explicitly type the refs
  const dropdownRefLog = useRef<HTMLDivElement | null>(null);
  const dropdownRefUtilization = useRef<HTMLDivElement | null>(null);
  const dropdownRefSecurity = useRef<HTMLDivElement | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 4,
  })


  const series = [
    {
      name: 'Series 1',
      data: [10, 41, 35, 51, 49, 62, 69, 91, 128],
    },
  ];

  const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];


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

  //this was to run the update data first time when the main-page.tsx mounting
  useEffect(() => {
    setData(updatedAnomalyData);
    // console.log(updatedAnomalyData)
  }, []);

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
      <div className='flex flex-row justify-between'>
        <div className='flex flex-row gap-6 container-button-x p-3'>
          {/* Log Tab */}
          <div className="container-button relative inline-block z-50" ref={dropdownRefLog}>
            <button
              onClick={() => handleTabClick('log')}
              className={`flex items-center px-4 py-2 border rounded text-white ${activeTab === 'log' ? 'active' : 'bg-transparent'} transition duration-300 ease-in-out`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* SVG paths */}
              </svg>
              Logs
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`ml-2 transition-transform ${isDropdownOpenLog ? 'rotate-180' : 'rotate-0'}`}>
                <path d="M6 9L12 15L18 9H6Z" fill="#FFFFF7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpenLog && (
              <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded shadow-lg z-10">
                {logs.map((log, index) => (
                  <button
                    key={index}
                    onClick={() => handleDropdownSelection('log', log)}
                    className={`text-black block w-full text-left p-6 text-sm ${selectedLog === log ? 'text-blue-600' : 'text-black'} transition duration-300 ease-in-out hover:bg-blue-100`}
                  >
                    {log}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Utilization Tab */}
          <div className="container-button relative inline-block z-50" ref={dropdownRefUtilization}>
            <button
              onClick={() => handleTabClick('utilization')}
              className={`flex items-center px-4 py-2 border rounded text-white ${activeTab === 'utilization' ? 'active' : 'bg-transparent'} transition duration-300 ease-in-out`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* SVG paths */}
              </svg>
              {'Utilization'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`ml-2 transition-transform ${isDropdownOpenUtilization ? 'rotate-180' : 'rotate-0'}`}>
                <path d="M6 9L12 15L18 9H6Z" fill="#FFFFF7" />
              </svg>
            </button>
            {/* Dropdown Menu */}
            {isDropdownOpenUtilization && (
              <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded shadow-lg z-10">
                {utilizations.map((utilization, index) => (
                  <button
                    key={index}
                    onClick={() => handleDropdownSelection('utilization', utilization)}
                    className={`text-black block w-full text-left p-6 text-sm ${selectedUtilization === utilization ? 'text-blue-600' : 'text-black'} transition duration-300 ease-in-out hover:bg-blue-100`}
                  >
                    {utilization}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Network Tab */}
          <div className='container-button'>
            <button
              onClick={() => handleTabClick('network')}
              className={`flex items-center px-4 py-2 border rounded text-white ${activeTab === 'network' ? 'active' : 'bg-transparent'} transition duration-300 ease-in-out`}
            >
              {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_28_4313)">
                  <path
                    d="M21 8C19.55 8 18.74 9.44 19.07 10.51L15.52 14.07C15.22 13.98 14.78 13.98 14.48 14.07L11.93 11.52C12.27 10.45 11.46 9 10 9C8.55 9 7.73 10.44 8.07 11.52L3.51 16.07C2.44 15.74 1 16.55 1 18C1 19.1 1.9 20 3 20C4.45 20 5.26 18.56 4.93 17.49L9.48 12.93C9.78 13.02 10.22 13.02 10.52 12.93L13.07 15.48C12.73 16.55 13.54 18 15 18C16.45 18 17.27 16.56 16.93 15.48L20.49 11.93C21.56 12.26 23 11.45 23 10C23 8.9 22.1 8 21 8Z"
                    fill="#FFFFF7"
                  />
                  <path d="M15 9L15.94 6.93L18 6L15.94 5.07L15 3L14.08 5.07L12 6L14.08 6.93L15 9Z" fill="#FFFFF7" />
                  <path d="M3.5 11L4 9L6 8.5L4 8L3.5 6L3 8L1 8.5L3 9L3.5 11Z" fill="#FFFFF7" />
                </g>
                <defs>
                  <clipPath id="clip0_28_4313">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg> */}
              Network
            </button>
          </div>
          {/* Security Tab */}
          <div className="container-button relative inline-block z-50" ref={dropdownRefSecurity}>
            <button
              onClick={() => handleTabClick('security')}
              className={`flex items-center px-4 py-2 border rounded text-white ${activeTab === 'security' ? 'active' : 'bg-transparent'} transition duration-300 ease-in-out`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_28_4313)">
                  <path
                    d="M21 8C19.55 8 18.74 9.44 19.07 10.51L15.52 14.07C15.22 13.98 14.78 13.98 14.48 14.07L11.93 11.52C12.27 10.45 11.46 9 10 9C8.55 9 7.73 10.44 8.07 11.52L3.51 16.07C2.44 15.74 1 16.55 1 18C1 19.1 1.9 20 3 20C4.45 20 5.26 18.56 4.93 17.49L9.48 12.93C9.78 13.02 10.22 13.02 10.52 12.93L13.07 15.48C12.73 16.55 13.54 18 15 18C16.45 18 17.27 16.56 16.93 15.48L20.49 11.93C21.56 12.26 23 11.45 23 10C23 8.9 22.1 8 21 8Z"
                    fill="#FFFFF7"
                  />
                  <path d="M15 9L15.94 6.93L18 6L15.94 5.07L15 3L14.08 5.07L12 6L14.08 6.93L15 9Z" fill="#FFFFF7" />
                  <path d="M3.5 11L4 9L6 8.5L4 8L3.5 6L3 8L1 8.5L3 9L3.5 11Z" fill="#FFFFF7" />
                </g>
                <defs>
                  <clipPath id="clip0_28_4313">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              {'Security'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`ml-2 transition-transform ${isDropdownOpenSecurity ? 'rotate-180' : 'rotate-0'}`}>
                <path d="M6 9L12 15L18 9H6Z" fill="#FFFFF7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpenSecurity && (
              <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded shadow-lg z-10">
                {security.map((security, index) => (
                  <button
                    key={index}
                    onClick={() => handleDropdownSelection('security', security)}
                    className={`text-black block w-full text-left p-6 text-sm ${selectedSecurity === security ? 'text-blue-600' : 'text-black'} transition duration-300 ease-in-out hover:bg-blue-100`}
                  >
                    {security}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        {activeTab === 'log' && selectedLog && (
          <TabLogContent
            selectedLog={selectedLog}
          />
        )}
        {activeTab === 'utilization' && selectedUtilization && (
          <TabUtilizationContent
            selectedUtilization={selectedUtilization}
          />
        )}
        {activeTab === 'network' && (
          <TabNetworkContent
            selectedNetwork={selectedLog}
            series={series} // Example: Pass appropriate data based on selected log
            categories={categories} // Pass appropriate categories based on selected log
            anomalyData={mostRecentAnomalyData}
            anomalyCategory={mostRecentAnomalyCategory}
            data={data}
            columns={columns}
            pagination={pagination}
            setPagination={setPagination}
          />
        )}

        {activeTab === 'security' && selectedSecurity && (
          <TabSecurityContent
            selectedSecurity={selectedSecurity}
          />
        )}
      </div>
    </div>
  )
}

export default MainPageAnomaly
