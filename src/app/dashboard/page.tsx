'use client'

import { useState, useEffect, useContext } from 'react';
// import type { Metadata } from 'next';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { CompaniesFilters } from '@/components/dashboard/overview/old-component/overview-filters';
import TabsComponent from '@/components/dashboard/overview/tabs';
import DropdownButton from '@/components/dashboard/overview/dropdown-button';
import DatePickerComponent from '@/components/dashboard/overview/date-picker';
import LineChart from '@/components/dashboard/overview/line-chart';
import ImageGrid from '@/components/dashboard/overview/image-grid';
// import {
//   createColumnHelper,
//   Column,
//   ColumnDef,
//   PaginationState,
//   Table,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import "../../components/dashboard/overview/table.css";
// import { handleError } from '@/lib/error-handler';
// import { CurrentSituation, InsightOverviewResponse } from '@/modules/models/overviews';
// import { GetCurrentSituation } from '@/modules/usecases/overviews';
import { OverviewContext } from '@/contexts/overview-context';
import { InsightPanel } from '@/components/dashboard/overview/panels/insight';
import { TeamOverviewPanel } from '@/components/dashboard/overview/panels/team-overview';
import { SeviceOverviewPanel } from '@/components/dashboard/overview/panels/service-overview-panel';
// import second from '@/components/dashboard/overview/table.css'



export default function Page(): React.ReactElement {
  // const options = ["Option 1", "Option 2", "Option 3"];

  const series = [
    {
      name: 'VM00009MOPB92 - BRIMO - mobile-banking - used_memory',
      data: [10, 41, 35, 51, 49, 62, 69],
    },
  ];
  const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  // const dataChart = {
  //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Agustus'],
  //   datasets: [
  //     {
  //       data: [65, 59, 80, 81, 56, 55, 40, 23],
  //       fill: false,
  //       borderColor: '#FE981C',
  //     },
  //   ],

  // };

  // const optionsChart = {
  //   responsive: true,
  //   layout: {
  //     padding: 30
  //   },
  //   plugins: {
  //     legend: {
  //       display: false,
  //       labels: {
  //         // This more specific font property overrides the global property
  //         font: {
  //           size: 14
  //         }
  //       }
  //     },
  //     title: {
  //       display: true,
  //       text: 'VM00009MOPB92 - BRIMO - mobile-banking - used_memory',
  //       align: 'start' as 'start',  // Explicitly setting the type
  //       color: 'white',
  //       padding: {
  //         top: 10,
  //         bottom: 30
  //       }
  //     },
  //   },
  // };

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

  const {
    insightOverview,
    teamOverview,
    serviceOverviews,
    setLoad
  } = useContext(OverviewContext)


  const [data, _setData] = useState(() => [...defaultData]);
  // const columnHelper = createColumnHelper<CurrentSituation>();
  // const [overview, setOverview] = useState<InsightOverviewResponse | undefined>(undefined)
  // const [pagination, setPagination] = useState<PaginationState>({
  //   pageIndex: 0,
  //   pageSize: 4,
  // });

  // const columns = [
  //   columnHelper.accessor("id", {
  //     header: "ID",
  //   }),
  //   columnHelper.accessor('created_date', {
  //     id: "created_date",
  //     cell: (info) => <i>{info.getValue()}</i>,
  //     header: () => <span>Created Date</span>,
  //   }),
  //   columnHelper.accessor("severity", {
  //     header: () => "Severity",
  //     cell: (info) => info.renderValue(),
  //   }),
  //   columnHelper.accessor("status", {
  //     header: "Status",
  //   }),
  //   columnHelper.accessor('assignees', {
  //     header: "Assignee",
  //     // cell: (info) => <span> {renderAssignees(info.getValue())} </span>
  //   }),
  //   columnHelper.accessor("service", {
  //     header: "Service",
  //   }),
  //   columnHelper.accessor("description", {
  //     header: "Description",
  //   }),
  //   columnHelper.accessor('total_alerts', {
  //     header: "Total Alerts",
  //   }),
  // ];

  // const table = useReactTable<CurrentSituation>({
  //   data: overview?.current_situations ?? [],
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   onPaginationChange: setPagination,
  //   //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
  //   state: {
  //     pagination,
  //   },
  // });

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
      content: <InsightPanel insightOverview={insightOverview} />,
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
      content: <TeamOverviewPanel teamOverview={teamOverview} />,
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
      content: <SeviceOverviewPanel serviceOverviews={serviceOverviews} />
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
              <LineChart
                series={series}
                categories={categories}
                title="VM00009MOPB92 - BRIMO - mobile-banking - used_memory"
                lineColor="#FE981c"
                yAxisMin={0}
                yAxisMax={160}
              />
            </div>
            <div className='chart-container' style={{ height: '380px' }}>
              <LineChart
                series={series}
                categories={categories}
                title="VM00009MOPB92 - BRIMO - mobile-banking - used_memory"
                lineColor="#FE981c"
                yAxisMin={0}
                yAxisMax={160}
              />
            </div>
          </div>
        </div>
      ),
    },

  ];

  useEffect(() => {
    setLoad(true)
  }, [])


  return (
    <Stack spacing={3}>
      <TabsComponent tabs={tabs} />
      {/* <Typography variant="body2" component="p" color="white">
          Last Updated a minute ago
        </Typography> */}
    </Stack>
  );
}
