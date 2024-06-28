'use client'

import * as React from 'react';
import { Box, Grid, Stack, Typography, Button, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import DropdownButton from '@/components/dashboard/overview/dropdown-button';
import DatePickerComponent from '@/components/dashboard/overview/date-picker';
import { ArrowLeft, ArrowRight } from 'react-feather';
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
import "./page.css"
import ButtonWithCheckbox from '@/components/dashboard/integrations/button-checkbox';
import { makeStyles } from '@mui/styles';
import LineChartComponent from '@/components/dashboard/overview/line-chart';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const useStyles = makeStyles((theme) => ({
  customIndicator: {
    backgroundColor: '#F59823', // Set the custom indicator color here
  },
}));



function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      className=''
    >
      {value === index && <Box sx={{ p: 3, background: '#0A1635' }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Page(): React.JSX.Element {


  const classes = useStyles();
  const options = ["Option 1", "Option 2", "Option 3"];
  const optionsDropdown = ["Option 1", "Option 2", "Option 3"];
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const dataChart = {
    labels: ['Red', 'Yellow', 'Silver'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 10], // Adjust the data to match the three labels
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)', // Red
          'rgba(255, 206, 86, 0.2)', // Yellow
          'rgba(192, 192, 192, 0.2)', // Silver
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)', // Red
          'rgba(255, 206, 86, 1)', // Yellow
          'rgba(192, 192, 192, 1)', // Silver
        ],
        borderWidth: 1,
      },
    ],
  };

  const optionsChart = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
      },
    },

  };
  interface Person {
    id: string;
    impactedDate: string;
    severity: string;
    status: string;
    assigne: string;
    service: string;
    description: string;
    totalAlerts: number;
  }

  const defaultData: Person[] = [
    {
      id: "#1190",
      impactedDate: "11/01/2024 15:04:22 P.M",
      severity: "Minor",
      status: "Solved",
      assigne: "davin@bri.co.id  +2 others",
      service: "bridgtl-rsm-notifications",
      description: "Critical issue affecting production environment.",
      totalAlerts: 10
    },
    {
      id: "#1191",
      impactedDate: "11/01/2024 15:04:22 P.M",
      severity: "Minor",
      status: "Open",
      assigne: "davin@bri.co.id  +2 others",
      service: "bridgtl-rsm-notifications",
      description: "Performance degradation reported by users.",
      totalAlerts: 5
    },
    {
      id: "#1192",
      impactedDate: "11/01/2024 15:04:22 P.M",
      severity: "Minor",
      status: "Solved",
      assigne: "davin@bri.co.id  +2 others",
      service: "bridgtl-rsm-notifications",
      description: "Minor bug in user interface.",
      totalAlerts: 2
    },
    {
      id: "#1193",
      impactedDate: "11/01/2024 15:04:22 P.M",
      severity: "Minor",
      status: "On Progress",
      assigne: "davin@bri.co.id  +2 others",
      service: "bridgtl-rsm-notifications",
      description: "Security breach detected in backend server.",
      totalAlerts: 8
    },
    {
      id: "#1194",
      impactedDate: "11/01/2024 15:04:22 P.M",
      severity: "Minor",
      status: "Solved",
      assigne: "davin@bri.co.id  +2 others",
      service: "bridgtl-rsm-notifications",
      description: "Database connectivity issue.",
      totalAlerts: 4
    },
    {
      id: "#1195",
      impactedDate: "2024-06-15T11:00:00Z",
      severity: "Minor",
      status: "open",
      assigne: "davin@bri.co.id  +2 others",
      service: "bridgtl-rsm-notifications",
      description: "UI rendering problem on mobile devices.",
      totalAlerts: 1
    },
    {
      id: "#1196",
      impactedDate: "11/01/2024 15:04:22 P.M",
      severity: "Minor",
      status: "Solved",
      assigne: "davin@bri.co.id  +2 others",
      service: "bridgtl-rsm-notifications",
      description: "Critical application crash on startup.",
      totalAlerts: 6
    },
    {
      id: "#1997",
      impactedDate: "11/01/2024 15:04:22 P.M",
      severity: "Minor",
      status: "Solved",
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
    columnHelper.accessor("impactedDate", {
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


  // Handler functions for date changes
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };



  return (
    <Stack spacing={0}>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-8 flex-grow p-6 rounded-lg' style={{ border: '1px solid #004889' }}>
          <Stack direction="row" spacing={1}>
            <Typography variant="h5" component="h5" color="white" sx={{ lineHeight: 'normal' }}>
              On Going Situation
            </Typography>
            <DropdownButton
              buttonText="All Products"
              options={['Option 1', 'Option 2', 'Option 3']}
              buttonClassName="md:w-64" // Responsive width
            />
            <DatePickerComponent
              selectedDate={startDate} // Provide a default date if startDate is null
              onChange={handleStartDateChange}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholder="Start Date"
            />
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
          <Box>
            <table id="person">
              <thead className="table-header-assesment">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <th key={header.id} colSpan={header.colSpan}>
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
              <tbody>
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
                          <td key={cell.id} className={`${cellClassName}`}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex mt-4 justify-content-between items-center gap-4 place-content-end">
              <div className="flex gap-1">
                <span className='text-white'>Rows per page:</span>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                  className="select-button-assesment"
                >
                  {[4, 16, 32].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>

              </div>
              <div className='text-white'>
                {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getState().pagination.pageSize}
              </div>
              <div className="d-flex">
                <button
                  className="bg-transparent text-white p-2"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ArrowLeft />
                </button>
                <button
                  className="bg-transparent text-white p-2"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ArrowRight />
                </button>
              </div>
            </div>
          </Box>
        </div>
        <div className='situation-card flex flex-col gap-2'>
          <div className='p-4 border-b-2'>          <div className="flex items-center gap-6">
            <Typography variant="h5" component="h5" color="white">
              Situation Detail
            </Typography>
            <div className='bg-[#06AED5] inline-flex gap-2 items-center rounded-xl px-3'>
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
              <Typography variant="body1" component="p" color="white" sx={{ margin: 0 }}>
                #1190
              </Typography>
            </div>
            <div className='bg-[#06AED5] inline-flex gap-2 items-center rounded-xl px-3'>
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
              <Typography variant="body1" component="p" color="white" sx={{ margin: 0 }}>
                #1190
              </Typography>
            </div>
            <div className='bg-[#06AED5] inline-flex gap-2 items-center rounded-xl px-3'>
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
              <Typography variant="body1" component="p" color="white" sx={{ margin: 0 }}>
                #1190
              </Typography>
            </div>
          </div></div>

          <div className='flex flex-col gap-8 p-6'>
            <div className='flex flex-row justify-between gap-12'>
              <div className='flex flex-col gap-3'>
                <Typography variant="h6" component="h6" color="white" sx={{ lineHeight: 'normal' }}>
                  Severity
                </Typography>
                <div className='inline-flex gap-2 place-items-center'>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="yellow" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.47 21.0001H19.53C21.07 21.0001 22.03 19.3301 21.26 18.0001L13.73 4.99005C12.96 3.66005 11.04 3.66005 10.27 4.99005L2.74 18.0001C1.97 19.3301 2.93 21.0001 4.47 21.0001ZM12 14.0001C11.45 14.0001 11 13.5501 11 13.0001V11.0001C11 10.4501 11.45 10.0001 12 10.0001C12.55 10.0001 13 10.4501 13 11.0001V13.0001C13 13.5501 12.55 14.0001 12 14.0001ZM13 18.0001H11V16.0001H13V18.0001Z" fill="#FFFFF7" />
                  </svg>
                  <Typography variant="body2" component="p" color="white" sx={{ lineHeight: 'normal' }}>
                    Minor
                  </Typography>
                </div>
              </div>
              <div className='flex flex-col gap-3'>
                <Typography variant="h6" component="h6" color="white" sx={{ lineHeight: 'normal' }}>
                  Assigne
                </Typography>
                <DropdownButton
                  buttonText="All Products"
                  options={['Option 1', 'Option 2', 'Option 3']}
                  buttonClassName="w-48" // Responsive width
                />
              </div>
              <div className='flex flex-col gap-3'>
                <Typography variant="h6" component="h6" color="white" sx={{ lineHeight: 'normal' }}>
                  Status
                </Typography>
                <div className='flex flex-row gap-4'>
                  <ButtonWithCheckbox buttonText="Open" />
                  <ButtonWithCheckbox buttonText="In Progress" />
                  <ButtonWithCheckbox buttonText="Resolve" />
                  <ButtonWithCheckbox buttonText="Close" />
                </div>
              </div>
              <div className='flex flex-col gap-6'>
                <Typography variant="h6" component="h6" color="white" sx={{ lineHeight: 'normal' }}>
                  Impacted Time
                </Typography>
                <Typography variant="body1" component="p" color="white" sx={{ lineHeight: 'normal' }}>
                  11/01/2024 13:54:02 P.M
                </Typography>
              </div>
            </div>
            <Box >
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: '#F59823', // Remove bottom border color
                },
              }}>
                <Tab label="Alerts" sx={{
                  padding: '15px 30px', fontSize: 14, color: 'white', fontWeight: 500, textTransform: 'uppercase', '& .MuiTab-textColorPrimary': {
                    color: 'white', // Remove bottom border color
                  },
                }} {...a11yProps(0)} />
                <Tab label="Timeline" sx={{ padding: '15px 30px', fontSize: 14, color: 'white', fontWeight: 500, textTransform: 'uppercase' }} {...a11yProps(1)} />
                <Tab label="Topology" sx={{ padding: '15px 30px', fontSize: 14, color: 'white', fontWeight: 500, textTransform: 'uppercase' }} {...a11yProps(2)} />
                <Tab label="Metrics" sx={{ padding: '15px 30px', fontSize: 14, color: 'white', fontWeight: 500, textTransform: 'uppercase' }}  {...a11yProps(3)} />
                <Tab label="Assign Team" sx={{ padding: '15px 30px', fontSize: 14, color: 'white', fontWeight: 500, textTransform: 'uppercase' }} {...a11yProps(4)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-row justify-between p-4 rounded-lg alert-card'>
                  <div className='flex flex-row gap-2'>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.96 27.9999H26.04C28.0933 27.9999 29.3733 25.7732 28.3467 23.9999L18.3067 6.65324C17.28 4.87991 14.72 4.87991 13.6933 6.65324L3.65333 23.9999C2.62667 25.7732 3.90667 27.9999 5.96 27.9999ZM16 18.6666C15.2667 18.6666 14.6667 18.0666 14.6667 17.3332V14.6666C14.6667 13.9332 15.2667 13.3332 16 13.3332C16.7333 13.3332 17.3333 13.9332 17.3333 14.6666V17.3332C17.3333 18.0666 16.7333 18.6666 16 18.6666ZM17.3333 23.9999H14.6667V21.3332H17.3333V23.9999Z" fill="#DE1A1A" />
                    </svg>
                    <div className='flex flex-col gap-2'>
                      <Typography variant="h6" component="h6" color="red">
                        Error occurred during VM initialization in bri_ats_N8jBB92uijlK_vm
                      </Typography>
                      <div className='flex flex-row gap-3 '>
                        <div className='inline-flex gap-2'>
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_137_8720)">
                              <path d="M13.5 14.25H4.5C4.0875 14.25 3.75 13.9125 3.75 13.5V4.5C3.75 4.0875 4.0875 3.75 4.5 3.75H8.25C8.6625 3.75 9 3.4125 9 3C9 2.5875 8.6625 2.25 8.25 2.25H3.75C2.9175 2.25 2.25 2.925 2.25 3.75V14.25C2.25 15.075 2.925 15.75 3.75 15.75H14.25C15.075 15.75 15.75 15.075 15.75 14.25V9.75C15.75 9.3375 15.4125 9 15 9C14.5875 9 14.25 9.3375 14.25 9.75V13.5C14.25 13.9125 13.9125 14.25 13.5 14.25ZM10.5 3C10.5 3.4125 10.8375 3.75 11.25 3.75H13.1925L6.345 10.5975C6.0525 10.89 6.0525 11.3625 6.345 11.655C6.6375 11.9475 7.11 11.9475 7.4025 11.655L14.25 4.8075V6.75C14.25 7.1625 14.5875 7.5 15 7.5C15.4125 7.5 15.75 7.1625 15.75 6.75V2.25H11.25C10.8375 2.25 10.5 2.5875 10.5 3Z" fill="#FFFFF7" />
                            </g>
                            <defs>
                              <clipPath id="clip0_137_8720">
                                <rect width="18" height="18" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <Typography variant="body2" component="p" color="white">
                            Timeline
                          </Typography>
                        </div>
                        <div className='inline-flex gap-2'>
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_137_8720)">
                              <path d="M13.5 14.25H4.5C4.0875 14.25 3.75 13.9125 3.75 13.5V4.5C3.75 4.0875 4.0875 3.75 4.5 3.75H8.25C8.6625 3.75 9 3.4125 9 3C9 2.5875 8.6625 2.25 8.25 2.25H3.75C2.9175 2.25 2.25 2.925 2.25 3.75V14.25C2.25 15.075 2.925 15.75 3.75 15.75H14.25C15.075 15.75 15.75 15.075 15.75 14.25V9.75C15.75 9.3375 15.4125 9 15 9C14.5875 9 14.25 9.3375 14.25 9.75V13.5C14.25 13.9125 13.9125 14.25 13.5 14.25ZM10.5 3C10.5 3.4125 10.8375 3.75 11.25 3.75H13.1925L6.345 10.5975C6.0525 10.89 6.0525 11.3625 6.345 11.655C6.6375 11.9475 7.11 11.9475 7.4025 11.655L14.25 4.8075V6.75C14.25 7.1625 14.5875 7.5 15 7.5C15.4125 7.5 15.75 7.1625 15.75 6.75V2.25H11.25C10.8375 2.25 10.5 2.5875 10.5 3Z" fill="#FFFFF7" />
                            </g>
                            <defs>
                              <clipPath id="clip0_137_8720">
                                <rect width="18" height="18" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <Typography variant="body2" component="p" color="white">
                            Topology
                          </Typography>
                        </div>
                        <div className='inline-flex gap-2'>
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_137_8720)">
                              <path d="M13.5 14.25H4.5C4.0875 14.25 3.75 13.9125 3.75 13.5V4.5C3.75 4.0875 4.0875 3.75 4.5 3.75H8.25C8.6625 3.75 9 3.4125 9 3C9 2.5875 8.6625 2.25 8.25 2.25H3.75C2.9175 2.25 2.25 2.925 2.25 3.75V14.25C2.25 15.075 2.925 15.75 3.75 15.75H14.25C15.075 15.75 15.75 15.075 15.75 14.25V9.75C15.75 9.3375 15.4125 9 15 9C14.5875 9 14.25 9.3375 14.25 9.75V13.5C14.25 13.9125 13.9125 14.25 13.5 14.25ZM10.5 3C10.5 3.4125 10.8375 3.75 11.25 3.75H13.1925L6.345 10.5975C6.0525 10.89 6.0525 11.3625 6.345 11.655C6.6375 11.9475 7.11 11.9475 7.4025 11.655L14.25 4.8075V6.75C14.25 7.1625 14.5875 7.5 15 7.5C15.4125 7.5 15.75 7.1625 15.75 6.75V2.25H11.25C10.8375 2.25 10.5 2.5875 10.5 3Z" fill="#FFFFF7" />
                            </g>
                            <defs>
                              <clipPath id="clip0_137_8720">
                                <rect width="18" height="18" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <Typography variant="body2" component="p" color="white">
                            Visualization
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-col gap-2'>
                    <Typography variant="body2" component="p" color="white">
                      Alert time
                    </Typography>
                    <Typography variant="body2" component="p" color="white">
                      11/01/2024 13:54:02 P.M
                    </Typography>
                  </div>
                </div>
                <div className='flex flex-row justify-between p-4 rounded-lg alert-card-2'>
                  <div className='flex flex-row gap-2'>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.96 27.9999H26.04C28.0933 27.9999 29.3733 25.7732 28.3467 23.9999L18.3067 6.65324C17.28 4.87991 14.72 4.87991 13.6933 6.65324L3.65333 23.9999C2.62667 25.7732 3.90667 27.9999 5.96 27.9999ZM16 18.6666C15.2667 18.6666 14.6667 18.0666 14.6667 17.3332V14.6666C14.6667 13.9332 15.2667 13.3332 16 13.3332C16.7333 13.3332 17.3333 13.9332 17.3333 14.6666V17.3332C17.3333 18.0666 16.7333 18.6666 16 18.6666ZM17.3333 23.9999H14.6667V21.3332H17.3333V23.9999Z" fill="#F59823" />
                    </svg>

                    <div className='flex flex-col gap-2'>
                      <Typography variant="h6" component="h6" color="yellow">
                        CPU limit has reached 98.12%!
                      </Typography>
                      <div className='flex flex-row gap-3 '>
                        <div className='inline-flex gap-2'>
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_137_8720)">
                              <path d="M13.5 14.25H4.5C4.0875 14.25 3.75 13.9125 3.75 13.5V4.5C3.75 4.0875 4.0875 3.75 4.5 3.75H8.25C8.6625 3.75 9 3.4125 9 3C9 2.5875 8.6625 2.25 8.25 2.25H3.75C2.9175 2.25 2.25 2.925 2.25 3.75V14.25C2.25 15.075 2.925 15.75 3.75 15.75H14.25C15.075 15.75 15.75 15.075 15.75 14.25V9.75C15.75 9.3375 15.4125 9 15 9C14.5875 9 14.25 9.3375 14.25 9.75V13.5C14.25 13.9125 13.9125 14.25 13.5 14.25ZM10.5 3C10.5 3.4125 10.8375 3.75 11.25 3.75H13.1925L6.345 10.5975C6.0525 10.89 6.0525 11.3625 6.345 11.655C6.6375 11.9475 7.11 11.9475 7.4025 11.655L14.25 4.8075V6.75C14.25 7.1625 14.5875 7.5 15 7.5C15.4125 7.5 15.75 7.1625 15.75 6.75V2.25H11.25C10.8375 2.25 10.5 2.5875 10.5 3Z" fill="#FFFFF7" />
                            </g>
                            <defs>
                              <clipPath id="clip0_137_8720">
                                <rect width="18" height="18" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <Typography variant="body2" component="p" color="white">
                            Timeline
                          </Typography>
                        </div>
                        <div className='inline-flex gap-2'>
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_137_8720)">
                              <path d="M13.5 14.25H4.5C4.0875 14.25 3.75 13.9125 3.75 13.5V4.5C3.75 4.0875 4.0875 3.75 4.5 3.75H8.25C8.6625 3.75 9 3.4125 9 3C9 2.5875 8.6625 2.25 8.25 2.25H3.75C2.9175 2.25 2.25 2.925 2.25 3.75V14.25C2.25 15.075 2.925 15.75 3.75 15.75H14.25C15.075 15.75 15.75 15.075 15.75 14.25V9.75C15.75 9.3375 15.4125 9 15 9C14.5875 9 14.25 9.3375 14.25 9.75V13.5C14.25 13.9125 13.9125 14.25 13.5 14.25ZM10.5 3C10.5 3.4125 10.8375 3.75 11.25 3.75H13.1925L6.345 10.5975C6.0525 10.89 6.0525 11.3625 6.345 11.655C6.6375 11.9475 7.11 11.9475 7.4025 11.655L14.25 4.8075V6.75C14.25 7.1625 14.5875 7.5 15 7.5C15.4125 7.5 15.75 7.1625 15.75 6.75V2.25H11.25C10.8375 2.25 10.5 2.5875 10.5 3Z" fill="#FFFFF7" />
                            </g>
                            <defs>
                              <clipPath id="clip0_137_8720">
                                <rect width="18" height="18" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <Typography variant="body2" component="p" color="white">
                            Topology
                          </Typography>
                        </div>
                        <div className='inline-flex gap-2'>
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_137_8720)">
                              <path d="M13.5 14.25H4.5C4.0875 14.25 3.75 13.9125 3.75 13.5V4.5C3.75 4.0875 4.0875 3.75 4.5 3.75H8.25C8.6625 3.75 9 3.4125 9 3C9 2.5875 8.6625 2.25 8.25 2.25H3.75C2.9175 2.25 2.25 2.925 2.25 3.75V14.25C2.25 15.075 2.925 15.75 3.75 15.75H14.25C15.075 15.75 15.75 15.075 15.75 14.25V9.75C15.75 9.3375 15.4125 9 15 9C14.5875 9 14.25 9.3375 14.25 9.75V13.5C14.25 13.9125 13.9125 14.25 13.5 14.25ZM10.5 3C10.5 3.4125 10.8375 3.75 11.25 3.75H13.1925L6.345 10.5975C6.0525 10.89 6.0525 11.3625 6.345 11.655C6.6375 11.9475 7.11 11.9475 7.4025 11.655L14.25 4.8075V6.75C14.25 7.1625 14.5875 7.5 15 7.5C15.4125 7.5 15.75 7.1625 15.75 6.75V2.25H11.25C10.8375 2.25 10.5 2.5875 10.5 3Z" fill="#FFFFF7" />
                            </g>
                            <defs>
                              <clipPath id="clip0_137_8720">
                                <rect width="18" height="18" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <Typography variant="body2" component="p" color="white">
                            Visualization
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-col gap-2'>
                    <Typography variant="body2" component="p" color="white">
                      Alert time
                    </Typography>
                    <Typography variant="body2" component="p" color="white">
                      11/01/2024 13:54:02 P.M
                    </Typography>
                  </div>
                </div>
                <div className='flex flex-row justify-between p-4 rounded-lg alert-card-2'>
                  <div className='flex flex-row gap-2'>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.96 27.9999H26.04C28.0933 27.9999 29.3733 25.7732 28.3467 23.9999L18.3067 6.65324C17.28 4.87991 14.72 4.87991 13.6933 6.65324L3.65333 23.9999C2.62667 25.7732 3.90667 27.9999 5.96 27.9999ZM16 18.6666C15.2667 18.6666 14.6667 18.0666 14.6667 17.3332V14.6666C14.6667 13.9332 15.2667 13.3332 16 13.3332C16.7333 13.3332 17.3333 13.9332 17.3333 14.6666V17.3332C17.3333 18.0666 16.7333 18.6666 16 18.6666ZM17.3333 23.9999H14.6667V21.3332H17.3333V23.9999Z" fill="#F59823" />
                    </svg>
                    <div className='flex flex-col gap-2'>
                      <Typography variant="h6" component="h6" color="yellow">
                        CPU limit has reached 98.12%!
                      </Typography>
                      <div className='flex flex-row gap-3 '>
                        <div className='inline-flex gap-2'>
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_137_8720)">
                              <path d="M13.5 14.25H4.5C4.0875 14.25 3.75 13.9125 3.75 13.5V4.5C3.75 4.0875 4.0875 3.75 4.5 3.75H8.25C8.6625 3.75 9 3.4125 9 3C9 2.5875 8.6625 2.25 8.25 2.25H3.75C2.9175 2.25 2.25 2.925 2.25 3.75V14.25C2.25 15.075 2.925 15.75 3.75 15.75H14.25C15.075 15.75 15.75 15.075 15.75 14.25V9.75C15.75 9.3375 15.4125 9 15 9C14.5875 9 14.25 9.3375 14.25 9.75V13.5C14.25 13.9125 13.9125 14.25 13.5 14.25ZM10.5 3C10.5 3.4125 10.8375 3.75 11.25 3.75H13.1925L6.345 10.5975C6.0525 10.89 6.0525 11.3625 6.345 11.655C6.6375 11.9475 7.11 11.9475 7.4025 11.655L14.25 4.8075V6.75C14.25 7.1625 14.5875 7.5 15 7.5C15.4125 7.5 15.75 7.1625 15.75 6.75V2.25H11.25C10.8375 2.25 10.5 2.5875 10.5 3Z" fill="#FFFFF7" />
                            </g>
                            <defs>
                              <clipPath id="clip0_137_8720">
                                <rect width="18" height="18" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <Typography variant="body2" component="p" color="white">
                            Timeline
                          </Typography>
                        </div>
                        <div className='inline-flex gap-2'>
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_137_8720)">
                              <path d="M13.5 14.25H4.5C4.0875 14.25 3.75 13.9125 3.75 13.5V4.5C3.75 4.0875 4.0875 3.75 4.5 3.75H8.25C8.6625 3.75 9 3.4125 9 3C9 2.5875 8.6625 2.25 8.25 2.25H3.75C2.9175 2.25 2.25 2.925 2.25 3.75V14.25C2.25 15.075 2.925 15.75 3.75 15.75H14.25C15.075 15.75 15.75 15.075 15.75 14.25V9.75C15.75 9.3375 15.4125 9 15 9C14.5875 9 14.25 9.3375 14.25 9.75V13.5C14.25 13.9125 13.9125 14.25 13.5 14.25ZM10.5 3C10.5 3.4125 10.8375 3.75 11.25 3.75H13.1925L6.345 10.5975C6.0525 10.89 6.0525 11.3625 6.345 11.655C6.6375 11.9475 7.11 11.9475 7.4025 11.655L14.25 4.8075V6.75C14.25 7.1625 14.5875 7.5 15 7.5C15.4125 7.5 15.75 7.1625 15.75 6.75V2.25H11.25C10.8375 2.25 10.5 2.5875 10.5 3Z" fill="#FFFFF7" />
                            </g>
                            <defs>
                              <clipPath id="clip0_137_8720">
                                <rect width="18" height="18" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <Typography variant="body2" component="p" color="white">
                            Topology
                          </Typography>
                        </div>
                        <div className='inline-flex gap-2'>
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_137_8720)">
                              <path d="M13.5 14.25H4.5C4.0875 14.25 3.75 13.9125 3.75 13.5V4.5C3.75 4.0875 4.0875 3.75 4.5 3.75H8.25C8.6625 3.75 9 3.4125 9 3C9 2.5875 8.6625 2.25 8.25 2.25H3.75C2.9175 2.25 2.25 2.925 2.25 3.75V14.25C2.25 15.075 2.925 15.75 3.75 15.75H14.25C15.075 15.75 15.75 15.075 15.75 14.25V9.75C15.75 9.3375 15.4125 9 15 9C14.5875 9 14.25 9.3375 14.25 9.75V13.5C14.25 13.9125 13.9125 14.25 13.5 14.25ZM10.5 3C10.5 3.4125 10.8375 3.75 11.25 3.75H13.1925L6.345 10.5975C6.0525 10.89 6.0525 11.3625 6.345 11.655C6.6375 11.9475 7.11 11.9475 7.4025 11.655L14.25 4.8075V6.75C14.25 7.1625 14.5875 7.5 15 7.5C15.4125 7.5 15.75 7.1625 15.75 6.75V2.25H11.25C10.8375 2.25 10.5 2.5875 10.5 3Z" fill="#FFFFF7" />
                            </g>
                            <defs>
                              <clipPath id="clip0_137_8720">
                                <rect width="18" height="18" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <Typography variant="body2" component="p" color="white">
                            Visualization
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <Typography variant="body2" component="p" color="white">
                      Alert time
                    </Typography>
                    <Typography variant="body2" component="p" color="white">
                      11/01/2024 13:54:02 P.M
                    </Typography>
                  </div>
                </div>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              Timeline
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              Topology
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
              <div className='chart-container' style={{ height: '380px', width: '100%' }}>
                <LineChartComponent data={dataChart} options={optionsChart} />
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
              Assign Team
            </CustomTabPanel>
          </div>

        </div>
      </div >
    </Stack >
  );
}

