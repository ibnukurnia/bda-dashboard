// pages/tabs-page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import updatedAnomalyData from '@/lib/data/anomaly'
import { ArrowLeft, ArrowRight } from 'react-feather'
import DatePickerComponent from '../overview/date-picker'
import BarChart from '../anomaly/chart/bar-chart'
import Dropdown from '../dropdownRange';
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

const MainPageAnomaly = () => {
  const [activeTab, setActiveTab] = useState('a')
  const [data, setData] = useState(updatedAnomalyData);
  const seriesBarChart = [{
    data: [400, 430, 448, 470]
  }];
  const columnHelper = createColumnHelper<Anomaly>()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 4,
  })

  const columns = [
    // columnHelper.accessor('id', {
    //   header: 'ID',
    // }),
    columnHelper.accessor('timestamp', {
      id: 'Insident Time',
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Insident Time</span>,
    }),
    columnHelper.accessor('service_name', {
      header: 'Service',
    }),
    columnHelper.accessor('status_code', {
      header: 'Status',
    }),
    columnHelper.accessor('response_time', {
      header: 'Response Time',
    }),
    columnHelper.accessor('pod_name', {
      header: 'Pod',
    }),

  ]

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
  })

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
  }

  const handleFilterChange = (filteredData: Anomaly[]) => {
    setData(filteredData); // Update table data based on filter
  };

  useEffect(() => {
    setData(updatedAnomalyData);
  }, []);


  return (
    <div className="flex flex-col gap-6">
      <div className='flex flex-row justify-between'>
        <div className='flex flex-row gap-6 container-button-x p-3'>

          <div className='container-button'>
            <button
              onClick={() => handleTabClick('a')}
              className={activeTab === 'a' ? 'active' : ''}
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
              Log
            </button>
          </div>
          <div className='container-button'>
            <button
              onClick={() => handleTabClick('b')}
              className={activeTab === 'b' ? 'active' : ''}
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
              Utilization
            </button>
          </div>
          <div className='container-button'>
            <button
              onClick={() => handleTabClick('c')}
              className={activeTab === 'c' ? 'active' : ''}
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
              Network
            </button>
          </div>
          <div className='container-button'>
            <button
              onClick={() => handleTabClick('d')}
              className={activeTab === 'd' ? 'active' : ''}
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
              Security
            </button>
          </div>

        </div>
        <Dropdown AnomalyData={data} onFilterChange={handleFilterChange} />
      </div>

      <div>
        {activeTab === 'a' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-20">
              <div className='card-style'>
                <Typography variant="h5" component="h5" color="white">
                  Most Recent Anomaly
                </Typography>
                <BarChart
                  series={seriesBarChart}
                  height={350}
                  width="100%"
                />
              </div>

            </div>
            <div className="flex flex-col gap-8 p-6" style={{ border: '1px solid #004889', borderRadius: 2 }}>
              <Typography variant="h5" component="h5" color="white">
                Historical Anomaly Records
              </Typography>
              <Box>
                <div className="overflow-x-auto w-full">
                  <div className="min-w-full">
                    <table id="person" className="table-auto divide-y divide-gray-200 w-full">
                      <thead className="">
                        {table.getHeaderGroups().map((headerGroup) => (
                          <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                              <th key={header.id} colSpan={header.colSpan} className="p-1">
                                <div
                                  className={`${header.column.getCanSort() ? "cursor-pointer select-none" : ""} px-3`}
                                  onClick={header.column.getToggleSortingHandler()}
                                >
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                  {header.column.getCanSort() && (
                                    <>
                                      {{
                                        asc: "🔼",
                                        desc: "🔽",
                                        undefined: "🔽" // Default icon for unsorted state
                                      }[header.column.getIsSorted() as string] || "🔽"} {/* Fallback to default icon */}
                                    </>
                                  )}
                                </div>
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row) => {
                          return (
                            <tr key={row.id}>
                              {row.getVisibleCells().map((cell) => {
                                let cellClassName = ''

                                if (cell.column.id === 'id') {
                                  cellClassName = 'id-cell'
                                }

                                return (
                                  <td key={cell.id} className={`px-1 py-4 whitespace-nowrap`}>
                                    <div
                                      className={`${cellClassName} inline-flex items-center px-3 py-1 rounded-full gap-x-2`}
                                    >
                                      {cell.column.id === 'severity' && (
                                        <svg
                                          width="14"
                                          height="15"
                                          viewBox="0 0 14 15"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M2.6075 12.75H11.3925C12.2908 12.75 12.8508 11.7759 12.4017 11L8.00917 3.41085C7.56 2.63502 6.44 2.63502 5.99083 3.41085L1.59833 11C1.14917 11.7759 1.70917 12.75 2.6075 12.75ZM7 8.66669C6.67917 8.66669 6.41667 8.40419 6.41667 8.08335V6.91669C6.41667 6.59585 6.67917 6.33335 7 6.33335C7.32083 6.33335 7.58333 6.59585 7.58333 6.91669V8.08335C7.58333 8.40419 7.32083 8.66669 7 8.66669ZM7.58333 11H6.41667V9.83335H7.58333V11Z"
                                            fill="#F59823"
                                          />
                                        </svg>
                                      )}
                                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                  </td>
                                )
                              })}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex mt-4 justify-content-between items-center gap-4 place-content-end">
                    <div className="flex gap-1">
                      <span className="text-white">Rows per page:</span>
                      <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                          table.setPageSize(Number(e.target.value))
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
                    <div className="text-white">
                      {table.getState().pagination.pageIndex + 1} of {table.getState().pagination.pageSize}
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
                </div>
              </Box>
            </div>
          </div>
        )}
        {activeTab === 'b' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-20">
              <div className='card-style'>
                <Typography variant="h5" component="h5" color="white">
                  Most Recent Anomaly
                </Typography>
                <BarChart
                  series={seriesBarChart}
                  height={350}
                  width="100%"
                />
              </div>

            </div>
            <div className="flex flex-col gap-8 p-6" style={{ border: '1px solid #004889', borderRadius: 2 }}>
              <Typography variant="h5" component="h5" color="white">
                Historical Anomaly Records
              </Typography>
              <Box>
                <div className="overflow-x-auto w-full">
                  <div className="min-w-full">
                    <table id="person" className="table-auto divide-y divide-gray-200 w-full">
                      <thead className="">
                        {table.getHeaderGroups().map((headerGroup) => (
                          <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                              <th key={header.id} colSpan={header.colSpan} className="p-1">
                                <div
                                  className={`${header.column.getCanSort() ? "cursor-pointer select-none" : ""} px-3`}
                                  onClick={header.column.getToggleSortingHandler()}
                                >
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                  {header.column.getCanSort() && (
                                    <>
                                      {{
                                        asc: "🔼",
                                        desc: "🔽",
                                        undefined: "🔽" // Default icon for unsorted state
                                      }[header.column.getIsSorted() as string] || "🔽"} {/* Fallback to default icon */}
                                    </>
                                  )}
                                </div>
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row) => {
                          return (
                            <tr key={row.id}>
                              {row.getVisibleCells().map((cell) => {
                                let cellClassName = ''

                                if (cell.column.id === 'id') {
                                  cellClassName = 'id-cell'
                                }

                                return (
                                  <td key={cell.id} className={`px-1 py-4 whitespace-nowrap`}>
                                    <div
                                      className={`${cellClassName} inline-flex items-center px-3 py-1 rounded-full gap-x-2`}
                                    >
                                      {cell.column.id === 'severity' && (
                                        <svg
                                          width="14"
                                          height="15"
                                          viewBox="0 0 14 15"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M2.6075 12.75H11.3925C12.2908 12.75 12.8508 11.7759 12.4017 11L8.00917 3.41085C7.56 2.63502 6.44 2.63502 5.99083 3.41085L1.59833 11C1.14917 11.7759 1.70917 12.75 2.6075 12.75ZM7 8.66669C6.67917 8.66669 6.41667 8.40419 6.41667 8.08335V6.91669C6.41667 6.59585 6.67917 6.33335 7 6.33335C7.32083 6.33335 7.58333 6.59585 7.58333 6.91669V8.08335C7.58333 8.40419 7.32083 8.66669 7 8.66669ZM7.58333 11H6.41667V9.83335H7.58333V11Z"
                                            fill="#F59823"
                                          />
                                        </svg>
                                      )}
                                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                  </td>
                                )
                              })}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex mt-4 justify-content-between items-center gap-4 place-content-end">
                    <div className="flex gap-1">
                      <span className="text-white">Rows per page:</span>
                      <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                          table.setPageSize(Number(e.target.value))
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
                    <div className="text-white">
                      {table.getState().pagination.pageIndex + 1} of {table.getState().pagination.pageSize}
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
                </div>
              </Box>
            </div>
          </div>
        )}
        {activeTab === 'c' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-20">
              <div className='card-style'>
                <Typography variant="h5" component="h5" color="white">
                  Most Recent Anomaly
                </Typography>
                <BarChart
                  series={seriesBarChart}
                  height={350}
                  width="100%"
                />
              </div>

            </div>
            <div className="flex flex-col gap-8 p-6" style={{ border: '1px solid #004889', borderRadius: 2 }}>
              <Typography variant="h5" component="h5" color="white">
                Historical Anomaly Records
              </Typography>
              <Box>
                <div className="overflow-x-auto w-full">
                  <div className="min-w-full">
                    <table id="person" className="table-auto divide-y divide-gray-200 w-full">
                      <thead className="">
                        {table.getHeaderGroups().map((headerGroup) => (
                          <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                              <th key={header.id} colSpan={header.colSpan} className="p-1">
                                <div
                                  className={`${header.column.getCanSort() ? "cursor-pointer select-none" : ""} px-3`}
                                  onClick={header.column.getToggleSortingHandler()}
                                >
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                  {header.column.getCanSort() && (
                                    <>
                                      {{
                                        asc: "🔼",
                                        desc: "🔽",
                                        undefined: "🔽" // Default icon for unsorted state
                                      }[header.column.getIsSorted() as string] || "🔽"} {/* Fallback to default icon */}
                                    </>
                                  )}
                                </div>
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row) => {
                          return (
                            <tr key={row.id}>
                              {row.getVisibleCells().map((cell) => {
                                let cellClassName = ''

                                if (cell.column.id === 'id') {
                                  cellClassName = 'id-cell'
                                }

                                return (
                                  <td key={cell.id} className={`px-1 py-4 whitespace-nowrap`}>
                                    <div
                                      className={`${cellClassName} inline-flex items-center px-3 py-1 rounded-full gap-x-2`}
                                    >
                                      {cell.column.id === 'severity' && (
                                        <svg
                                          width="14"
                                          height="15"
                                          viewBox="0 0 14 15"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M2.6075 12.75H11.3925C12.2908 12.75 12.8508 11.7759 12.4017 11L8.00917 3.41085C7.56 2.63502 6.44 2.63502 5.99083 3.41085L1.59833 11C1.14917 11.7759 1.70917 12.75 2.6075 12.75ZM7 8.66669C6.67917 8.66669 6.41667 8.40419 6.41667 8.08335V6.91669C6.41667 6.59585 6.67917 6.33335 7 6.33335C7.32083 6.33335 7.58333 6.59585 7.58333 6.91669V8.08335C7.58333 8.40419 7.32083 8.66669 7 8.66669ZM7.58333 11H6.41667V9.83335H7.58333V11Z"
                                            fill="#F59823"
                                          />
                                        </svg>
                                      )}
                                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                  </td>
                                )
                              })}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex mt-4 justify-content-between items-center gap-4 place-content-end">
                    <div className="flex gap-1">
                      <span className="text-white">Rows per page:</span>
                      <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                          table.setPageSize(Number(e.target.value))
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
                    <div className="text-white">
                      {table.getState().pagination.pageIndex + 1} of {table.getState().pagination.pageSize}
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
                </div>
              </Box>
            </div>
          </div>
        )}
        {activeTab === 'd' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-20">
              <div className='card-style'>
                <Typography variant="h5" component="h5" color="white">
                  Most Recent Anomaly
                </Typography>
                <BarChart
                  series={seriesBarChart}
                  height={350}
                  width="100%"
                />
              </div>

            </div>
            <div className="flex flex-col gap-8 p-6" style={{ border: '1px solid #004889', borderRadius: 2 }}>
              <Typography variant="h5" component="h5" color="white">
                Historical Anomaly Records
              </Typography>
              <Box>
                <div className="overflow-x-auto w-full">
                  <div className="min-w-full">
                    <table id="person" className="table-auto divide-y divide-gray-200 w-full">
                      <thead className="">
                        {table.getHeaderGroups().map((headerGroup) => (
                          <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                              <th key={header.id} colSpan={header.colSpan} className="p-1">
                                <div
                                  className={`${header.column.getCanSort() ? "cursor-pointer select-none" : ""} px-3`}
                                  onClick={header.column.getToggleSortingHandler()}
                                >
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                  {header.column.getCanSort() && (
                                    <>
                                      {{
                                        asc: "🔼",
                                        desc: "🔽",
                                        undefined: "🔽" // Default icon for unsorted state
                                      }[header.column.getIsSorted() as string] || "🔽"} {/* Fallback to default icon */}
                                    </>
                                  )}
                                </div>
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row) => {
                          return (
                            <tr key={row.id}>
                              {row.getVisibleCells().map((cell) => {
                                let cellClassName = ''

                                if (cell.column.id === 'id') {
                                  cellClassName = 'id-cell'
                                }

                                return (
                                  <td key={cell.id} className={`px-1 py-4 whitespace-nowrap`}>
                                    <div
                                      className={`${cellClassName} inline-flex items-center px-3 py-1 rounded-full gap-x-2`}
                                    >
                                      {cell.column.id === 'severity' && (
                                        <svg
                                          width="14"
                                          height="15"
                                          viewBox="0 0 14 15"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M2.6075 12.75H11.3925C12.2908 12.75 12.8508 11.7759 12.4017 11L8.00917 3.41085C7.56 2.63502 6.44 2.63502 5.99083 3.41085L1.59833 11C1.14917 11.7759 1.70917 12.75 2.6075 12.75ZM7 8.66669C6.67917 8.66669 6.41667 8.40419 6.41667 8.08335V6.91669C6.41667 6.59585 6.67917 6.33335 7 6.33335C7.32083 6.33335 7.58333 6.59585 7.58333 6.91669V8.08335C7.58333 8.40419 7.32083 8.66669 7 8.66669ZM7.58333 11H6.41667V9.83335H7.58333V11Z"
                                            fill="#F59823"
                                          />
                                        </svg>
                                      )}
                                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                  </td>
                                )
                              })}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex mt-4 justify-content-between items-center gap-4 place-content-end">
                    <div className="flex gap-1">
                      <span className="text-white">Rows per page:</span>
                      <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                          table.setPageSize(Number(e.target.value))
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
                    <div className="text-white">
                      {table.getState().pagination.pageIndex + 1} of {table.getState().pagination.pageSize}
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
                </div>
              </Box>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MainPageAnomaly
