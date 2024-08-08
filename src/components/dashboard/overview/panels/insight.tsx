import { useContext, useEffect, useState } from "react"
import DropdownButton from "../dropdown-button"
import DatePickerComponent from "../date-picker"
import { Box, Stack, Typography } from "@mui/material"
import { OverviewContext } from '@/contexts/overview-context';
import {
    PaginationState,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table"
import { CurrentSituation, InsightOverviewResponse } from "@/modules/models/overviews"
import { GetProducts } from "@/modules/usecases/global/product-usecase"
import "../table.css"
import Loading from "@/components/loading-out";
import ErrorFetchingData from "@/components/error-fetching-data";

export const InsightPanel = () => {
    const { insightOverview, getInsightOverview } = useContext(OverviewContext)
    const [selectedOption, setSelectedOption] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 4,
    });
    const [products, setProducts] = useState<{ id: number, name: string }[]>([])


    useEffect(() => {
        if (insightOverview !== null) {
            setIsLoading(false);
            setError(false);
        } else {
            setIsLoading(true);
            setError(true);
        }
    }, [insightOverview]);


    useEffect(() => {
        // Initial load of products
        fetchProducts();
    }, []);


    const fetchProducts = () => {
        setIsLoading(true);
        setError(false);

        GetProducts()
            .then((res) => {
                setProducts(res?.data ?? []);
                setIsLoading(false);
                setError(false);
            })
            .catch((error) => {
                console.log('Error fetching products:', error);
                setIsLoading(false);
                setError(true);
            });
    };

    const handleOptionSelection = (option: string) => {
        setSelectedOption(option); // Set the selected option state
        console.log('Selected option:', option);
        getInsightOverview()
    };


    const columnHelper = createColumnHelper<CurrentSituation>()

    const renderAssignees = (assignees: { email: string }[]): string => {
        const n = assignees.length

        if (n === 0) {
            return "-"
        }

        const s = assignees[0]

        return n === 1 ? s.email : `${s.email} and ${n - 1} more`
    }

    const columns = [
        columnHelper.accessor("id", {
            header: "ID",
        }),
        columnHelper.accessor('created_date', {
            id: "created_date",
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
        // columnHelper.accessor('assignees', {
        //     header: "Assignee",
        //     cell: (info) => <span> {renderAssignees(info.getValue())} </span>

        // }),
        columnHelper.accessor("service", {
            header: "Service",
        }),
        columnHelper.accessor("description", {
            header: "Description",
        }),
        columnHelper.accessor('total_alerts', {
            header: "Total Alerts",
        }),
    ];

    const table = useReactTable<CurrentSituation>({
        data: insightOverview?.current_situations ?? [],
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
    // const [startDate, setStartDate] = useState<Date | null>(null);
    // const [endDate, setEndDate] = useState<Date | null>(null);

    // Handler functions for date changes
    // const handleStartDateChange = (date: Date | null) => {
    //     setStartDate(date);
    // };

    // const handleEndDateChange = (date: Date | null) => {
    //     setEndDate(date);
    // };

    return (
        <div className='flex flex-col gap-8'>

            {isLoading ? (
                <Loading />
            ) : error ? (
                <ErrorFetchingData />
            ) : (
                <Stack sx={{ display: 'flex', gap: 6, flexDirection: 'row', px: 3 }}>

                    <Stack sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <div className='inline-flex align-center gap-3'>
                            <svg width="32" height="24" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.96 27.9999H26.04C28.0933 27.9999 29.3733 25.7732 28.3467 23.9999L18.3067 6.65324C17.28 4.87991 14.72 4.87991 13.6933 6.65324L3.65333 23.9999C2.62667 25.7732 3.90667 27.9999 5.96 27.9999ZM16 18.6666C15.2667 18.6666 14.6667 18.0666 14.6667 17.3332V14.6666C14.6667 13.9332 15.2667 13.3332 16 13.3332C16.7333 13.3332 17.3333 13.9332 17.3333 14.6666V17.3332C17.3333 18.0666 16.7333 18.6666 16 18.6666ZM17.3333 23.9999H14.6667V21.3332H17.3333V23.9999Z" fill="#F59823" />
                            </svg>

                            <Typography variant="body1" component="p" color="white" sx={{ margin: 0 }}>
                                Total Alerts
                            </Typography>
                        </div>
                        <Typography variant="h4" component="h4" color="white" sx={{ margin: 0, fontSize: '42px' }}>
                            {insightOverview?.total_alerts}<span style={{ fontSize: '16px', marginLeft: '5px', fontWeight: 400 }}>alerts</span>
                        </Typography>
                    </Stack>
                    <Stack sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <div className='inline-flex align-center gap-3'>
                            <svg width="32" height="24" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.96 27.9999H26.04C28.0933 27.9999 29.3733 25.7732 28.3467 23.9999L18.3067 6.65324C17.28 4.87991 14.72 4.87991 13.6933 6.65324L3.65333 23.9999C2.62667 25.7732 3.90667 27.9999 5.96 27.9999ZM16 18.6666C15.2667 18.6666 14.6667 18.0666 14.6667 17.3332V14.6666C14.6667 13.9332 15.2667 13.3332 16 13.3332C16.7333 13.3332 17.3333 13.9332 17.3333 14.6666V17.3332C17.3333 18.0666 16.7333 18.6666 16 18.6666ZM17.3333 23.9999H14.6667V21.3332H17.3333V23.9999Z" fill="#F59823" />
                            </svg>

                            <Typography variant="body1" component="p" color="white" sx={{ margin: 0 }}>
                                Most Anomaly Source
                            </Typography>
                        </div>
                        <Typography variant="h4" component="h4" color="white" sx={{ margin: 0, fontSize: '42px' }}>
                            Log<span style={{ fontSize: '16px', marginLeft: '5px', fontWeight: 400 }}>{insightOverview?.total_alerts}</span>
                        </Typography>
                    </Stack>

                </Stack>
            )}

            <Box sx={{ border: '1px solid #004889', borderRadius: 2, px: 2, gap: 1, display: 'flex', flexDirection: 'column' }}>
                <div className='px-3 py-4'>
                    <Typography variant="h5" component="h5" color="white" sx={{ margin: 0 }}>
                        Current Situation
                    </Typography>
                </div>
                <div className="min-w-full">
                    <table id="person" className="table-auto divide-y divide-gray-200 w-full">
                        <thead className="table-header-assesment">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
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
                                        );
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-gray-200">
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
                                                    case "open":
                                                        cellClassName = "open-status";
                                                        break;
                                                    case "solved":
                                                        cellClassName = "solved-status";
                                                        break;
                                                    case "in progress":
                                                        cellClassName = "on-progress-status";
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            }

                                            if (cell.column.id === 'severity') {
                                                // i want to add icon which is the svg in beside text of severity value
                                                //                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                // <path d="M4.47 21.0001H19.53C21.07 21.0001 22.03 19.3301 21.26 18.0001L13.73 4.99005C12.96 3.66005 11.04 3.66005 10.27 4.99005L2.74 18.0001C1.97 19.3301 2.93 21.0001 4.47 21.0001ZM12 14.0001C11.45 14.0001 11 13.5501 11 13.0001V11.0001C11 10.4501 11.45 10.0001 12 10.0001C12.55 10.0001 13 10.4501 13 11.0001V13.0001C13 13.5501 12.55 14.0001 12 14.0001ZM13 18.0001H11V16.0001H13V18.0001Z" fill="#FFFFF7"/>
                                                // </svg>
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
                    </table></div>

            </Box>
        </div>
    )
}
