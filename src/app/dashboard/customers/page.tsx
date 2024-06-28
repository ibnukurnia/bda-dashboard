'use client'

import * as React from 'react';
import { Box, Grid, Stack, Typography, Button } from '@mui/material';
import { useState } from 'react';
import DropdownButton from '@/components/dashboard/overview/dropdown-button';
import DatePickerComponent from '@/components/dashboard/overview/date-picker';
import { ArrowLeft, ArrowRight } from 'react-feather';
import DoughnutChartComponent from '@/components/dashboard/customer/doughnut-chart';
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
} from "@tanstack/react-table"; import TabsComponent from '@/components/dashboard/overview/tabs';
import "./page.css"


export default function Page(): React.JSX.Element {
    const options = ["Option 1", "Option 2", "Option 3"];
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

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
    }; interface Person {
        id: number;
        impactedDate: string;
        severity: string;
        service: string;
        description: string;
        totalAlerts: number;
    }

    const defaultData: Person[] = [
        {
            id: 1190,
            impactedDate: "11/01/2024 15:04:22 P.M",
            severity: "Minor",
            service: "bridgtl-rsm-notifications",
            description: "Critical issue affecting production environment.",
            totalAlerts: 10
        },
        {
            id: 1191,
            impactedDate: "11/01/2024 15:04:22 P.M",
            severity: "Minor",
            service: "bridgtl-rsm-notifications",
            description: "Performance degradation reported by users.",
            totalAlerts: 5
        },
        {
            id: 1192,
            impactedDate: "11/01/2024 15:04:22 P.M",
            severity: "Minor",
            service: "bridgtl-rsm-notifications",
            description: "Minor bug in user interface.",
            totalAlerts: 2
        },
        {
            id: 1193,
            impactedDate: "11/01/2024 15:04:22 P.M",
            severity: "Minor",
            service: "bridgtl-rsm-notifications",
            description: "Security breach detected in backend server.",
            totalAlerts: 8
        },
        {
            id: 1194,
            impactedDate: "11/01/2024 15:04:22 P.M",
            severity: "Minor",
            service: "bridgtl-rsm-notifications",
            description: "Database connectivity issue.",
            totalAlerts: 4
        },
        {
            id: 1195,
            impactedDate: "2024-06-15T11:00:00Z",
            severity: "Minor",
            service: "bridgtl-rsm-notifications",
            description: "UI rendering problem on mobile devices.",
            totalAlerts: 1
        },
        {
            id: 1196,
            impactedDate: "11/01/2024 15:04:22 P.M",
            severity: "Minor",
            service: "bridgtl-rsm-notifications",
            description: "Critical application crash on startup.",
            totalAlerts: 6
        },
        {
            id: 1997,
            impactedDate: "11/01/2024 15:04:22 P.M",
            severity: "Minor",
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

    const tabs = [
        {
            id: 'insights',
            label: 'Insights',
            content: (
                <div className='flex flex-row gap-6'>
                    <div className='flex flex-col gap-8 flex-grow p-6' style={{ border: '1px solid #004889', borderRadius: 2 }}>
                        <Typography variant="h5" component="h5" color="white" sx={{ margin: 0 }}>
                            Historical Anomaly Records
                        </Typography>
                        <Stack direction="row" spacing={1}>
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
                                                    const cellValue = cell.row.original.id;
                                                    let cellClassName = "";

                                                    if (cell.column.id === 'id') {
                                                        cellClassName = 'id-cell';
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
                    <div className='flex flex-col gap-6 flex-grow'>
                        <div className='flex flex-col gap-6 card-background-color p-6'>
                            <Typography variant="h6" component="h6" color="white">
                                Most Recent Anomaly
                            </Typography>
                            <div className='flex flex-row gap-3'>
                                <img src="/assets/dashboard/donut.png" alt="qodkoqwkd" className='object-contain h-28 w-32' />
                                <div className='flex flex-col gap-3'>
                                    <div className='flex flex-row gap-3'>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="9" cy="9" r="9" fill="#FFAC45" />
                                        </svg>
                                        <Typography variant="body2" component="p" color="white">
                                            Minor
                                        </Typography>
                                    </div>
                                    <div className='flex flex-row gap-3'>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="9" cy="9" r="9" fill="#FFAC45" />
                                        </svg>
                                        <Typography variant="body2" component="p" color="white">
                                            Minor
                                        </Typography>
                                    </div>
                                    <div className='flex flex-row gap-3'>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="9" cy="9" r="9" fill="#FFAC45" />
                                        </svg>
                                        <Typography variant="body2" component="p" color="white">
                                            Minor
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-8 card-background-color p-6'>
                            <Typography variant="h6" component="h6" color="white">
                                Severity Ration
                            </Typography>
                            <div className='flex flex-row gap-5'>
                                <div style={{ width: '140px', height: '150px' }}>
                                    <DoughnutChartComponent data={dataChart} options={optionsChart} />
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <div className='flex flex-row gap-3 items-center'>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="9" cy="9" r="9" fill="#FFAC45" />
                                        </svg>
                                        <Typography variant="body2" component="p" color="white">
                                            Minor
                                        </Typography>
                                    </div>
                                    <div className='flex flex-row gap-3 items-center'>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="9" cy="9" r="9" fill="#F84D4D" />
                                        </svg>
                                        <Typography variant="body2" component="p" color="white">
                                            Major
                                        </Typography>
                                    </div>
                                    <div className='flex flex-row gap-3 items-center'>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="9" cy="9" r="9" fill="#C4C4C4" />
                                        </svg>
                                        <Typography variant="body2" component="p" color="white">
                                            No Severity
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <Stack spacing={0}>
            <TabsComponent tabs={tabs} />
        </Stack>
    );
}
