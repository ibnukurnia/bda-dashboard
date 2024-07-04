'use client'

import * as React from 'react';
// import type { Metadata } from 'next';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { CompaniesFilters } from '@/components/dashboard/overview/overview-filters';
import { useState } from 'react';
import TabsComponent from '@/components/dashboard/overview/tabs';
import DropdownButton from '@/components/dashboard/overview/dropdown-button';
import DatePickerComponent from '@/components/dashboard/overview/date-picker';
import ImageGrid from '@/components/dashboard/overview/image-grid';
import LineChartComponent from '@/components/dashboard/overview/line-chart';
import {
  createColumnHelper,
  Column,
  ColumnDef,
  PaginationState,
  Table,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import "../../components/dashboard/overview/table.css";



export default function Page(): React.ReactElement {
  // const options = ["Option 1", "Option 2", "Option 3"];

  const dataCard = [
    {
      title: 'bridgtl-sms-service',
      tags: ['#1190', '#1190', '#1190'],
      bgColor: 'custom-blue',
      stats: [
        { label: '12min', description: 'Last Impacted' },
        { label: '3', description: 'Open Issues' },
        { label: '30', description: 'Team Member' },
        { label: '23m', description: 'Avg. Time Solved' },
        { label: 'Running', description: 'Current Cond.', color: '#06BA63' },
      ],
    },
    {
      title: 'paylater-credit-scoring',
      tags: [],
      bgColor: 'custom-blue',
      stats: [
        { label: '14min', description: 'Last Impacted' },
        { label: '3', description: 'Open Issues' },
        { label: '4', description: 'Team Member' },
        { label: '58m', description: 'Avg. Time Solved' },
        { label: 'Running', description: 'Current Cond.', color: '#06BA63' },
      ],
    },
    {
      title: 'bridgtl-trx-service',
      tags: ['#2029'],
      bgColor: 'custom-red',
      stats: [
        { label: '2sec', description: 'Last Impacted' },
        { label: '1', description: 'Open Issues' },
        { label: '30', description: 'Team Member' },
        { label: '23m', description: 'Avg. Time Solved' },
        { label: 'Crash', description: 'Current Cond.', color: '#DE1A1A' },
      ],
    },
    {
      title: 'cloud-services-AxbYN',
      tags: ['#1829'],
      bgColor: 'custom-blue',
      stats: [
        { label: '26days', description: 'Last Impacted' },
        { label: '-', description: 'Open Issues' },
        { label: '5', description: 'Team Member' },
        { label: '32m', description: 'Avg. Time Solved' },
        { label: 'Running', description: 'Current Cond.', color: '#06BA63' },
      ],
    },
    {
      title: 'mobile-banking',
      tags: [],
      bgColor: 'custom-blue',
      stats: [
        { label: '6days', description: 'Last Impacted' },
        { label: '-', description: 'Open Issues' },
        { label: '64', description: 'Team Member' },
        { label: '3m', description: 'Avg. Time Solved' },
        { label: 'Running', description: 'Current Cond.', color: '#06BA63' },
      ],
    },
    {
      title: 'load-balancer',
      tags: ['#1888'],
      bgColor: 'custom-yellow',
      stats: [
        { label: '45sec', description: 'Last Impacted' },
        { label: '1', description: 'Open Issues' },
        { label: '2', description: 'Team Member' },
        { label: '23m', description: 'Avg. Time Solved' },
        { label: 'Warning', description: 'Current Cond.', color: '#F59823' },
      ],
    },
  ];

  const dataCardTeams = [
    {
      bgColor: 'custom-blue',
      tags: ['#1190'],
      title: 'bridgtl-sms-service',
      stats: [
        { label: '12min', description: 'Impacted Duration' },
        { label: '3', description: 'Open Issues' },
        { label: '2', description: 'Contributor' },
        { label: '4', description: 'Alert Attempted' },
      ],
    },
    {
      bgColor: 'custom-red',
      tags: ['#1190'],
      title: 'bridgtl-sms-service',
      stats: [
        { label: '12min', description: 'Impacted Duration' },
        { label: '3', description: 'Open Issues' },
        { label: '2', description: 'Contributor' },
        { label: '4', description: 'Alert Attempted' },
      ],
    },
    {
      bgColor: 'custom-blue',
      tags: ['#1190'],
      title: 'bridgtl-sms-service',
      stats: [
        { label: '12min', description: 'Impacted Duration' },
        { label: '3', description: 'Open Issues' },
        { label: '2', description: 'Contributor' },
        { label: '4', description: 'Alert Attempted' },
      ],
    },
    {
      bgColor: 'custom-blue',
      tags: ['#1190'],
      title: 'bridgtl-sms-service',
      stats: [
        { label: '12min', description: 'Impacted Duration' },
        { label: '3', description: 'Open Issues' },
        { label: '2', description: 'Contributor' },
        { label: '4', description: 'Alert Attempted' },
      ],
    },
    {
      bgColor: 'custom-red',
      tags: ['#1190'],
      title: 'bridgtl-sms-service',
      stats: [
        { label: '12min', description: 'Impacted Duration' },
        { label: '3', description: 'Open Issues' },
        { label: '2', description: 'Contributor' },
        { label: '4', description: 'Alert Attempted' },
      ],
    },
    {
      bgColor: 'custom-blue',
      tags: ['#1190'],
      title: 'bridgtl-sms-service',
      stats: [
        { label: '12min', description: 'Impacted Duration' },
        { label: '3', description: 'Open Issues' },
        { label: '2', description: 'Contributor' },
        { label: '4', description: 'Alert Attempted' },
      ],
    },
  ];

  const dataChart = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Agustus'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40, 23],
        fill: false,
        borderColor: '#FE981C',
      },
    ],

  };

  const optionsChart = {
    responsive: true,
    layout: {
      padding: 30
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          // This more specific font property overrides the global property
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'VM00009MOPB92 - BRIMO - mobile-banking - used_memory',
        align: 'start' as 'start',  // Explicitly setting the type
        color: 'white',
        padding: {
          top: 10,
          bottom: 30
        }
      },
    },
  };

  interface Person {
    id: string;
    createdDate: string;
    severity: string;
    status: string;
    assigne: string;
    service: string;
    description: string;
    totalAlerts: number;
  }

  const defaultData: Person[] = [
    {
      id: '#1190',
      createdDate: "11/01/2024 15:04:22 P.M",
      severity: "Minor",
      status: "Solved",
      assigne: "davin@bri.co.id  +2 others",
      service: "bridgtl-rsm-notifications",
      description: "Critical issue affecting production environment.",
      totalAlerts: 10
    },
    {
      id: '#1191',
      createdDate: "11/01/2024 15:04:22 P.M",
      severity: "Minor",
      status: "Open",
      assigne: "davin@bri.co.id  +2 others",
      service: "bridgtl-rsm-notifications",
      description: "Performance degradation reported by users.",
      totalAlerts: 5
    },
    {
      id: '#1192',
      createdDate: "11/01/2024 15:04:22 P.M",
      severity: "Minor",
      status: "On Progress",
      assigne: "davin@bri.co.id  +2 others",
      service: "bridgtl-rsm-notifications",
      description: "Minor bug in user interface.",
      totalAlerts: 2
    },
    {
      id: '#1193',
      createdDate: "11/01/2024 15:04:22 P.M",
      severity: "Minor",
      status: "Open",
      assigne: "davin@bri.co.id  +2 others",
      service: "bridgtl-rsm-notifications",
      description: "Security breach detected in backend server.",
      totalAlerts: 8
    },
    {
      id: '#1194',
      createdDate: "11/01/2024 15:04:22 P.M",
      severity: "Minor",
      status: "Solved",
      assigne: "davin@bri.co.id  +2 others",
      service: "bridgtl-rsm-notifications",
      description: "Database connectivity issue.",
      totalAlerts: 4
    },
    {
      id: '#1195',
      createdDate: "2024-06-15T11:00:00Z",
      severity: "Minor",
      status: "Open",
      assigne: "davin@bri.co.id  +2 others",
      service: "bridgtl-rsm-notifications",
      description: "UI rendering problem on mobile devices.",
      totalAlerts: 1
    },
    {
      id: '#1196',
      createdDate: "11/01/2024 15:04:22 P.M",
      severity: "Minor",
      status: "Open",
      assigne: "davin@bri.co.id  +2 others",
      service: "bridgtl-rsm-notifications",
      description: "Critical application crash on startup.",
      totalAlerts: 6
    },
    {
      id: '#1997',
      createdDate: "11/01/2024 15:04:22 P.M",
      severity: "Minor",
      status: "On Progress",
      assigne: "davin@bri.co.id  +2 others",
      service: "bridgtl-rsm-notifications",
      description: "Payment gateway integration issue.",
      totalAlerts: 3
    }
  ];

  const columnHelper = createColumnHelper<Person>();
  const [data, _setData] = useState(() => [...defaultData]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 4,
  });

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
    }),
    columnHelper.accessor("createdDate", {
      id: "CreatedData",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Created Date</span>,
    }),
    columnHelper.accessor("severity", {
      header: () => "Severity",
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor("status", {
      header: "Status",
    }),
    columnHelper.accessor("assigne", {
      header: "Assigne",
    }),
    columnHelper.accessor("service", {
      header: "Service",
    }),
    columnHelper.accessor("description", {
      header: "Description",
    }),
    columnHelper.accessor("totalAlerts", {
      header: "Total Alerts",
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      pagination,
    },
  });

  // State for managing startDate and endDate
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Handler functions for date changes
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  const tabs = [
    {
      id: 'insights',
      label: 'Insights',
      icon:
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_28_4313)">
            <path d="M21 8C19.55 8 18.74 9.44 19.07 10.51L15.52 14.07C15.22 13.98 14.78 13.98 14.48 14.07L11.93 11.52C12.27 10.45 11.46 9 10 9C8.55 9 7.73 10.44 8.07 11.52L3.51 16.07C2.44 15.74 1 16.55 1 18C1 19.1 1.9 20 3 20C4.45 20 5.26 18.56 4.93 17.49L9.48 12.93C9.78 13.02 10.22 13.02 10.52 12.93L13.07 15.48C12.73 16.55 13.54 18 15 18C16.45 18 17.27 16.56 16.93 15.48L20.49 11.93C21.56 12.26 23 11.45 23 10C23 8.9 22.1 8 21 8Z" fill="#FFFFF7" />
            <path d="M15 9L15.94 6.93L18 6L15.94 5.07L15 3L14.08 5.07L12 6L14.08 6.93L15 9Z" fill="#FFFFF7" />
            <path d="M3.5 11L4 9L6 8.5L4 8L3.5 6L3 8L1 8.5L3 9L3.5 11Z" fill="#FFFFF7" />
          </g>
          <defs>
            <clipPath id="clip0_28_4313">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>,
      content: (
        <div className='flex flex-col gap-10'>
          <Stack direction="row" spacing={3}>
            <DropdownButton
              buttonText="All Products"
              options={['Option 1', 'Option 2', 'Option 3']}
              buttonClassName="md:w-64" // Responsive width
            />
            {/* Render DatePickerComponent for startDate */}
            <DatePickerComponent
              selectedDate={startDate} // Provide a default date if startDate is null
              onChange={handleStartDateChange}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholder="Start Date"
            />

            {/* Render DatePickerComponent for endDate */}
            <DatePickerComponent
              selectedDate={endDate} // Provide a default date if endDate is null
              onChange={handleEndDateChange}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate} // Ensure endDate cannot be before startDate
              placeholder="End Date"
            />
          </Stack>
          <Stack sx={{ display: 'flex', gap: 6, flexDirection: 'row', px: 3 }}>
            <Stack sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className='flex flex-col'>
                <div className='inline-flex allign-center gap-3'>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_399_120)">
                      <path d="M8.79 9.24V5.5C8.79 4.12 9.91 3 11.29 3C12.67 3 13.79 4.12 13.79 5.5V9.24C15 8.43 15.79 7.06 15.79 5.5C15.79 3.01 13.78 1 11.29 1C8.8 1 6.79 3.01 6.79 5.5C6.79 7.06 7.58 8.43 8.79 9.24ZM14.29 11.71C14.01 11.57 13.71 11.5 13.4 11.5H12.79V5.5C12.79 4.67 12.12 4 11.29 4C10.46 4 9.79 4.67 9.79 5.5V16.24L6.35 15.52C5.98 15.44 5.59 15.56 5.32 15.83C4.89 16.27 4.89 16.97 5.32 17.41L9.33 21.42C9.71 21.79 10.22 22 10.75 22H16.85C17.85 22 18.69 21.27 18.83 20.28L19.46 15.81C19.58 14.96 19.14 14.12 18.37 13.74L14.29 11.71Z" fill="#FFFFF7" />
                    </g>
                    <defs>
                      <clipPath id="clip0_399_120">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <Typography variant="body1" component="p" color="white">
                    Total Event Trigerred
                  </Typography>
                </div>
                <div className='inline-flex gap-1 self-end'>
                  <Typography variant="body2" component="p" color="#06BA63">
                    +2.1%
                  </Typography>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_547_130)">
                      <path d="M16.85 6.85L18.29 8.29L13.41 13.17L10.12 9.88C9.73 9.49 9.1 9.49 8.71 9.88L2.71 15.89C2.32 16.28 2.32 16.91 2.71 17.3C3.1 17.69 3.73 17.69 4.12 17.3L9.41 12L12.7 15.29C13.09 15.68 13.72 15.68 14.11 15.29L19.7 9.71L21.14 11.15C21.45 11.46 21.99 11.24 21.99 10.8V6.5C22 6.22 21.78 6 21.5 6H17.21C16.76 6 16.54 6.54 16.85 6.85Z" fill="#06BA63" />
                    </g>
                    <defs>
                      <clipPath id="clip0_547_130">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>
              <Typography variant="h4" component="h4" color="white" sx={{ margin: 0, fontSize: '42px' }}>
                2,289<span style={{ fontSize: '16px', marginLeft: '5px', fontWeight: 400 }}>events</span>
              </Typography>
            </Stack>
            <Stack sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className='flex flex-col'>
                <div className='inline-flex allign-center gap-3'>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.47 21.0001H19.53C21.07 21.0001 22.03 19.3301 21.26 18.0001L13.73 4.99005C12.96 3.66005 11.04 3.66005 10.27 4.99005L2.74 18.0001C1.97 19.3301 2.93 21.0001 4.47 21.0001ZM12 14.0001C11.45 14.0001 11 13.5501 11 13.0001V11.0001C11 10.4501 11.45 10.0001 12 10.0001C12.55 10.0001 13 10.4501 13 11.0001V13.0001C13 13.5501 12.55 14.0001 12 14.0001ZM13 18.0001H11V16.0001H13V18.0001Z" fill="#FFFFF7" />
                  </svg>
                  <Typography variant="body1" component="p" color="white">
                    Total Alerts
                  </Typography>
                </div>
                <div className='inline-flex gap-1 self-end'>
                  <Typography variant="body2" component="p" color="#06BA63">
                    -1.02%
                  </Typography>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_547_130)">
                      <path d="M16.85 6.85L18.29 8.29L13.41 13.17L10.12 9.88C9.73 9.49 9.1 9.49 8.71 9.88L2.71 15.89C2.32 16.28 2.32 16.91 2.71 17.3C3.1 17.69 3.73 17.69 4.12 17.3L9.41 12L12.7 15.29C13.09 15.68 13.72 15.68 14.11 15.29L19.7 9.71L21.14 11.15C21.45 11.46 21.99 11.24 21.99 10.8V6.5C22 6.22 21.78 6 21.5 6H17.21C16.76 6 16.54 6.54 16.85 6.85Z" fill="#06BA63" />
                    </g>
                    <defs>
                      <clipPath id="clip0_547_130">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>
              <Typography variant="h4" component="h4" color="white" sx={{ margin: 0, fontSize: '42px' }}>
                558<span style={{ fontSize: '16px', marginLeft: '5px', fontWeight: 400 }}>alerts</span>
              </Typography>
            </Stack>
            <Stack sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className='inline-flex allign-center gap-3'>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.47 21.0001H19.53C21.07 21.0001 22.03 19.3301 21.26 18.0001L13.73 4.99005C12.96 3.66005 11.04 3.66005 10.27 4.99005L2.74 18.0001C1.97 19.3301 2.93 21.0001 4.47 21.0001ZM12 14.0001C11.45 14.0001 11 13.5501 11 13.0001V11.0001C11 10.4501 11.45 10.0001 12 10.0001C12.55 10.0001 13 10.4501 13 11.0001V13.0001C13 13.5501 12.55 14.0001 12 14.0001ZM13 18.0001H11V16.0001H13V18.0001Z" fill="#FFFFF7" />
                </svg>
                <Typography variant="body1" component="p" color="white">
                  Total Ongoing Situation
                </Typography>
              </div>
              <div className='inline-flex gap-1 self-end'>
                <Typography variant="body2" component="p" color="red">
                  +12%
                </Typography>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_28_4322)">
                    <path d="M16.85 17.15L18.29 15.71L13.41 10.83L10.12 14.12C9.72998 14.51 9.09998 14.51 8.70998 14.12L2.70998 8.10997C2.31998 7.71997 2.31998 7.08997 2.70998 6.69997C3.09998 6.30997 3.72998 6.30997 4.11998 6.69997L9.40998 12L12.7 8.70997C13.09 8.31997 13.72 8.31997 14.11 8.70997L19.7 14.29L21.14 12.85C21.45 12.54 21.99 12.76 21.99 13.2V17.49C21.99 17.77 21.77 17.99 21.49 17.99H17.2C16.76 18 16.54 17.46 16.85 17.15Z" fill="#DE1A1A" />
                  </g>
                  <defs>
                    <clipPath id="clip0_28_4322">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

              </div>
              <Typography variant="h4" component="h4" color="white" sx={{ margin: 0, fontSize: '42px' }}>
                23<span style={{ fontSize: '16px', marginLeft: '5px', fontWeight: 400 }}>situation</span>
              </Typography>

            </Stack>
            <Stack sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className='flex flex-col'><div className='inline-flex allign-center gap-3'>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_399_120)">
                    <path d="M8.79 9.24V5.5C8.79 4.12 9.91 3 11.29 3C12.67 3 13.79 4.12 13.79 5.5V9.24C15 8.43 15.79 7.06 15.79 5.5C15.79 3.01 13.78 1 11.29 1C8.8 1 6.79 3.01 6.79 5.5C6.79 7.06 7.58 8.43 8.79 9.24ZM14.29 11.71C14.01 11.57 13.71 11.5 13.4 11.5H12.79V5.5C12.79 4.67 12.12 4 11.29 4C10.46 4 9.79 4.67 9.79 5.5V16.24L6.35 15.52C5.98 15.44 5.59 15.56 5.32 15.83C4.89 16.27 4.89 16.97 5.32 17.41L9.33 21.42C9.71 21.79 10.22 22 10.75 22H16.85C17.85 22 18.69 21.27 18.83 20.28L19.46 15.81C19.58 14.96 19.14 14.12 18.37 13.74L14.29 11.71Z" fill="#FFFFF7" />
                  </g>
                  <defs>
                    <clipPath id="clip0_399_120">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <Typography variant="body1" component="p" color="white">
                  Average Time Solved
                </Typography>
              </div>
                <div className='inline-flex gap-1 self-end'>
                  <Typography variant="body2" component="p" color="#06BA63">
                    -8,5%
                  </Typography>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_547_130)">
                      <path d="M16.85 6.85L18.29 8.29L13.41 13.17L10.12 9.88C9.73 9.49 9.1 9.49 8.71 9.88L2.71 15.89C2.32 16.28 2.32 16.91 2.71 17.3C3.1 17.69 3.73 17.69 4.12 17.3L9.41 12L12.7 15.29C13.09 15.68 13.72 15.68 14.11 15.29L19.7 9.71L21.14 11.15C21.45 11.46 21.99 11.24 21.99 10.8V6.5C22 6.22 21.78 6 21.5 6H17.21C16.76 6 16.54 6.54 16.85 6.85Z" fill="#06BA63" />
                    </g>
                    <defs>
                      <clipPath id="clip0_547_130">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div></div>
              <Typography variant="h4" component="h4" color="white" sx={{ margin: 0, fontSize: '42px' }}>
                16<span style={{ fontSize: '16px', marginLeft: '5px', fontWeight: 400 }}>m</span>
              </Typography>
            </Stack>
          </Stack>
          <Box sx={{ border: '1px solid #004889', borderRadius: 2, px: 1 }}>
            <div className='px-3 py-4'>
              <Typography variant="h5" component="h5" color="white">
                Current Situation
              </Typography>
            </div>
            <div className="overflow-x-auto w-full">
              <table id="person" className='table-auto divide-y divide-gray-200'>
                <thead className="">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <th key={header.id} colSpan={header.colSpan} className='py-3.5 px-4 text-left'>
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : "",
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: " 🔼",
                                desc: " 🔽",
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {table.getRowModel().rows.map((row) => {
                    return (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => {
                          const cellValue = cell.row.original.status;
                          let cellClassName = "";

                          if (cell.column.id === 'id') {
                            cellClassName = 'id-cell';
                          }

                          if (cell.column.id === "status") {
                            switch (cellValue) {
                              case "Open":
                                cellClassName = "open-status";
                                break;
                              case "Solved":
                                cellClassName = "solved-status";
                                break;
                              case "On Progress":
                                cellClassName = "on-progress-status";
                                break;
                              default:
                                break;
                            }
                          }

                          return (
                            <td key={cell.id} className="px-1 py-4 whitespace-nowrap">
                              <div className={`${cellClassName} w-full flex items-center px-3 py-1 rounded-full gap-x-2 `}>
                                {cell.column.id === 'severity' && (
                                  <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.6075 12.75H11.3925C12.2908 12.75 12.8508 11.7759 12.4017 11L8.00917 3.41085C7.56 2.63502 6.44 2.63502 5.99083 3.41085L1.59833 11C1.14917 11.7759 1.70917 12.75 2.6075 12.75ZM7 8.66669C6.67917 8.66669 6.41667 8.40419 6.41667 8.08335V6.91669C6.41667 6.59585 6.67917 6.33335 7 6.33335C7.32083 6.33335 7.58333 6.59585 7.58333 6.91669V8.08335C7.58333 8.40419 7.32083 8.66669 7 8.66669ZM7.58333 11H6.41667V9.83335H7.58333V11Z" fill="#F59823" />
                                  </svg>
                                )}
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Box>
        </div>
      ),
    },
    {
      id: 'team-overview',
      label: 'Team Overview',
      icon:
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_28_4579)">
            <path d="M12 2C8.14 2 5 5.14 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.14 15.86 2 12 2ZM12 4C13.1 4 14 4.9 14 6C14 7.11 13.1 8 12 8C10.9 8 10 7.11 10 6C10 4.9 10.9 4 12 4ZM12 14C10.33 14 8.86 13.15 8 11.85C8.02 10.53 10.67 9.8 12 9.8C13.33 9.8 15.98 10.53 16 11.85C15.14 13.15 13.67 14 12 14Z" fill="#FFFFF7" />
          </g>
          <defs>
            <clipPath id="clip0_28_4579">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>,
      content: (
        <div className='flex flex-row gap-4'>
          <div className='flex flex-col gap-8 col-span-2'>
            <Stack direction="row" spacing={3}>
              <DropdownButton
                buttonText="BRIMO"
                options={['Brimo', 'Brimo', 'Brimo']}
                buttonClassName="md:w-64" // Responsive width
              />
              {/* Render DatePickerComponent for startDate */}
              <DatePickerComponent
                selectedDate={startDate} // Provide a default date if startDate is null
                onChange={handleStartDateChange}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholder="Start Date"
              />

              {/* Render DatePickerComponent for endDate */}
              <DatePickerComponent
                selectedDate={endDate} // Provide a default date if endDate is null
                onChange={handleEndDateChange}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate} // Ensure endDate cannot be before startDate
                placeholder="End Date"
              />
            </Stack>
            <Stack sx={{ display: 'flex', gap: 6, flexDirection: 'row', px: 2 }}>
              <Stack sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <div className='inline-flex align-center gap-2'>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_28_4779)">
                      <path d="M18 16H16V15H8V16H6V15H2V20H22V15H18V16Z" fill="#FFFFF7" />
                      <path d="M20 8H17V6C17 4.9 16.1 4 15 4H9C7.9 4 7 4.9 7 6V8H4C2.9 8 2 8.9 2 10V14H6V12H8V14H16V12H18V14H22V10C22 8.9 21.1 8 20 8ZM15 8H9V6H15V8Z" fill="#FFFFF7" />
                    </g>
                    <defs>
                      <clipPath id="clip0_28_4779">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <Typography variant="body1" component="p" color="white">
                    Total Situation Solved
                  </Typography>
                </div>
                <Typography variant="h4" component="h4" color="white" sx={{ margin: 0, fontSize: '42px' }}>
                  387<span style={{ fontSize: '16px', marginLeft: '5px', fontWeight: 400 }}>situation</span>
                </Typography>
              </Stack>
              <Stack sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <div className='inline-flex align-center gap-2'>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_28_4805)">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.54 15.85L15.85 16.54C15.46 16.93 14.83 16.93 14.44 16.54L11.39 13.49C10.17 13.92 8.75 13.66 7.77 12.68C6.66 11.57 6.47 9.89 7.18 8.58L9.53 10.93L10.94 9.52L8.58 7.17C9.9 6.46 11.57 6.65 12.68 7.76C13.66 8.74 13.92 10.16 13.49 11.38L16.54 14.43C16.93 14.82 16.93 15.46 16.54 15.85Z" fill="#FFFFF7" />
                    </g>
                    <defs>
                      <clipPath id="clip0_28_4805">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <Typography variant="body1" component="p" color="white">
                    Current In Progress Situation
                  </Typography>
                </div>
                <Typography variant="h4" component="h4" color="white" sx={{ margin: 0, fontSize: '42px' }}>
                  12<span style={{ fontSize: '16px', marginLeft: '5px', fontWeight: 400 }}>situation</span>
                </Typography>
              </Stack>
              <Stack sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <div className='inline-flex align-center gap-2'>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_28_4914)">
                      <path d="M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3ZM12 7C13.66 7 15 8.34 15 10C15 11.66 13.66 13 12 13C10.34 13 9 11.66 9 10C9 8.34 10.34 7 12 7ZM18 19H6V17.6C6 15.6 10 14.5 12 14.5C14 14.5 18 15.6 18 17.6V19Z" fill="#FFFFF7" />
                    </g>
                    <defs>
                      <clipPath id="clip0_28_4914">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <Typography variant="body1" component="p" color="white">
                    Total Team Member
                  </Typography>
                </div>
                <Typography variant="h4" component="h4" color="white" sx={{ margin: 0, fontSize: '42px' }}>
                  34<span style={{ fontSize: '16px', marginLeft: '5px', fontWeight: 400 }}>Member</span>
                </Typography>
              </Stack>

            </Stack>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="h5" component="h5" color="white">
                On Going Situation
              </Typography>
              <div className='grid grid-cols-2 gap-8'>
                {dataCardTeams.map((team, index) => (
                  <div key={index} className={`bg-[#0A1635] flex flex-col gap-6 rounded-lg p-2`}>
                    <div className="flex items-center gap-6">
                      <div className={`bg-${team.bgColor} inline-flex gap-3 items-center rounded-lg px-3 py-1`}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="10" cy="10" r="10" fill={team.bgColor === 'custom-blue' ? '#06AED5' : '#DE1A1A'} />
                          <g clipPath="url(#clip0_28_4938)">
                            <path d="M6.25004 10.0417C5.05837 10.0417 4.08337 11.0167 4.08337 12.2083C4.08337 13.4 5.05837 14.375 6.25004 14.375C7.44171 14.375 8.41671 13.4 8.41671 12.2083C8.41671 11.0167 7.44171 10.0417 6.25004 10.0417ZM9.50004 4.625C8.30837 4.625 7.33337 5.6 7.33337 6.79167C7.33337 7.98333 8.30837 8.95833 9.50004 8.95833C10.6917 8.95833 11.6667 7.98333 11.6667 6.79167C11.6667 5.6 10.6917 4.625 9.50004 4.625ZM12.75 10.0417C11.5584 10.0417 10.5834 11.0167 10.5834 12.2083C10.5834 13.4 11.5584 14.375 12.75 14.375C13.9417 14.375 14.9167 13.4 14.9167 12.2083C14.9167 11.0167 13.9417 10.0417 12.75 10.0417Z" fill="#FFFFF7" />
                          </g>
                          <defs>
                            <clipPath id="clip0_28_4938">
                              <rect width="13" height="13" fill="white" transform="translate(3 3)" />
                            </clipPath>
                          </defs>
                        </svg>
                        <Typography variant="body1" component="p" color="white">
                          {team.tags[0]}
                        </Typography>
                      </div>
                      <Typography variant="body1" component="h3" color="white">
                        {team.title}
                      </Typography>
                    </div>
                    <div className="grid grid-cols-4">
                      {team.stats.map((stat, index) => (
                        <div key={index} className='flex flex-col justify-between items-center text-center'>
                          <Typography variant="h6" component="h3" color="white" >
                            {stat.label}
                          </Typography>
                          <Typography variant="body2" component="p" color="white" >
                            {stat.description}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </Box>
          </div>
          <div className='flex flex-col gap-6 col-span-1 px-3 py-4' style={{ border: '1px solid #004889', borderRadius: 18 }}>
            <Typography variant="h5" component="h5" color="white">
              Your Current Project
            </Typography>
            <ImageGrid />
          </div>
        </div>
      ),
    },
    {
      id: 'service-overview',
      label: 'Service Overview',
      icon:
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_40_5959)">
            <path d="M13 13C12.44 13.56 11.55 13.56 11 13.01V13C10.45 12.45 10.45 11.56 11 11.01V11C11.55 10.45 12.44 10.45 12.99 11H13C13.55 11.55 13.55 12.45 13 13ZM12 5.99996L14.12 8.11996L16.62 5.61996L13.42 2.41996C12.64 1.63996 11.37 1.63996 10.59 2.41996L7.38996 5.61996L9.88996 8.11996L12 5.99996ZM5.99996 12L8.11996 9.87996L5.61996 7.37996L2.41996 10.58C1.63996 11.36 1.63996 12.63 2.41996 13.41L5.61996 16.61L8.11996 14.11L5.99996 12ZM18 12L15.88 14.12L18.38 16.62L21.58 13.42C22.36 12.64 22.36 11.37 21.58 10.59L18.38 7.38996L15.88 9.88996L18 12ZM12 18L9.87996 15.88L7.37996 18.38L10.58 21.58C11.36 22.36 12.63 22.36 13.41 21.58L16.61 18.38L14.11 15.88L12 18Z" fill="#FFFFF7" />
          </g>
          <defs>
            <clipPath id="clip0_40_5959">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>,
      content: (
        <div className='flex flex-col gap-8 col-span-2'>
          <Stack direction="row" spacing={1} justifyContent={'space-between'} >
            <DropdownButton
              buttonText="All Services"
              options={['Option 1', 'Option 2', 'Option 3']}
              buttonClassName="md:w-64" // Responsive width
            />
            <CompaniesFilters />
          </Stack>
          <div className='grid grid-cols-2 gap-8'>
            {dataCard.map((item, index) => (
              <div key={index} className="bg-[#0A1635] flex flex-col gap-7 rounded-lg p-4">
                <div className="flex items-center gap-6">
                  <Typography variant="body3" component="h3" color="white">
                    {item.title}
                  </Typography>
                  {item.tags.map((tag, tagIndex) => (
                    <div key={tagIndex} className={`bg-${item.bgColor} inline-flex gap-2 items-center rounded-lg px-3 py-1`}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="10" fill="#06AED5" />
                        <g clipPath="url(#clip0_28_4938)">
                          <path d="M6.25004 10.0417C5.05837 10.0417 4.08337 11.0167 4.08337 12.2083C4.08337 13.4 5.05837 14.375 6.25004 14.375C7.44171 14.375 8.41671 13.4 8.41671 12.2083C8.41671 11.0167 7.44171 10.0417 6.25004 10.0417ZM9.50004 4.625C8.30837 4.625 7.33337 5.6 7.33337 6.79167C7.33337 7.98333 8.30837 8.95833 9.50004 8.95833C10.6917 8.95833 11.6667 7.98333 11.6667 6.79167C11.6667 5.6 10.6917 4.625 9.50004 4.625ZM12.75 10.0417C11.5584 10.0417 10.5834 11.0167 10.5834 12.2083C10.5834 13.4 11.5584 14.375 12.75 14.375C13.9417 14.375 14.9167 13.4 14.9167 12.2083C14.9167 11.0167 13.9417 10.0417 12.75 10.0417Z" fill="#FFFFF7" />
                        </g>
                        <defs>
                          <clipPath id="clip0_28_4938">
                            <rect width="13" height="13" fill="white" transform="translate(3 3)" />
                          </clipPath>
                        </defs>
                      </svg>
                      <Typography variant="body1" component="p" color="white">
                        {tag}
                      </Typography>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {item.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="flex flex-col gap-y-2 justify-between text-center flex-grow">
                      <Typography variant="h6" component="h3" color={stat.color || 'white'}>
                        {stat.label}
                      </Typography>
                      <Typography variant="body2" component="p" color="white">
                        {stat.description}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'metrics',
      label: 'Metrics',
      icon:
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_40_5963)">
            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM8 17C7.45 17 7 16.55 7 16V11C7 10.45 7.45 10 8 10C8.55 10 9 10.45 9 11V16C9 16.55 8.55 17 8 17ZM12 17C11.45 17 11 16.55 11 16V8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8V16C13 16.55 12.55 17 12 17ZM16 17C15.45 17 15 16.55 15 16V14C15 13.45 15.45 13 16 13C16.55 13 17 13.45 17 14V16C17 16.55 16.55 17 16 17Z" fill="#FFFFF7" />
          </g>
          <defs>
            <clipPath id="clip0_40_5963">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>,
      content: (
        <div className='flex flex-col gap-12 col-span-2'>
          <Stack direction="row" spacing={1} justifyContent={'space-between'} >
            <DropdownButton
              buttonText="All Products"
              options={['Option 1', 'Option 2', 'Option 3']}
              buttonClassName="md:w-64" // Responsive width
            />
            <CompaniesFilters />
          </Stack>
          <div className='flex flex-col gap-8 w-full'>
            <div className='chart-container' style={{ height: '380px' }}>
              <LineChartComponent data={dataChart} options={optionsChart} />
            </div>
            <div className='chart-container' style={{ height: '380px' }}>
              <LineChartComponent data={dataChart} options={optionsChart} />
            </div>
          </div>
        </div>
      ),
    },

  ];

  return (
    <Stack spacing={3}>
      <TabsComponent tabs={tabs} />
      {/* <Typography variant="body2" component="p" color="white">
          Last Updated a minute ago
        </Typography> */}
    </Stack>
  );
}
