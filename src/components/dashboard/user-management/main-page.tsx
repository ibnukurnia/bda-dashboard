'use client';

import React, { Fragment, useEffect, useState } from 'react';
import AddUserModal from '@/components/dashboard/user-management/addUserModal';
import DeleteUserModal from '@/components/dashboard/user-management/deleteUserModal';
import { GetUsersList, AllowUser, SortUserList } from '@/modules/usecases/user-management';
import Skeleton from '@/components/system/Skeleton/Skeleton';
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, ColumnDef, HeaderContext } from '@tanstack/react-table';
import Pagination from '@/components/system/Pagination/Pagination'; // Custom pagination component
import UpdateUserModal from './updateUserModal';
import { Typography } from '@mui/material'; // MUI Typography component for styled text
import styles from './table.module.css'; // CSS module for table-specific styles



interface TableHeaderWrapperProps {
    isLoading: boolean;
    children: JSX.Element;
}

// Wrapper component to show skeleton loader for the table header while loading
const TableHeaderWrapper: React.FC<TableHeaderWrapperProps> = ({
    isLoading,
    children,
}) => {
    if (isLoading) {
        return (
            <tr>
                {/* Generate 5 skeleton headers */}
                {Array.from(Array(5), (_, j) => (
                    <th key={j} className={`p-4 py-6`}>
                        <Skeleton className='px-3 min-w-full' width={120} height={20} />
                    </th>
                ))}
            </tr>
        );
    }
    return children; // Render actual header content when loading is complete
};

// Interface for table body skeleton props
interface TableBodyWrapperProps {
    isLoading: boolean;
    isEmpty: boolean;
    pageSize: number;
    columnSize: number;
    children: JSX.Element;
}

// Wrapper component to show skeleton loader or empty state for the table body
const TableBodyWrapper: React.FC<TableBodyWrapperProps> = ({
    isLoading,
    isEmpty,
    pageSize,
    columnSize,
    children,
}) => {
    if (isLoading) {
        return (
            // Generate skeleton rows based on pageSize and columnSize
            Array.from(Array(pageSize), (_, i) => (
                <tr key={i}>
                    {Array.from(Array(columnSize), (_, j) => (
                        <td key={j} className={`p-4`}>
                            <Skeleton className='px-3 min-w-full' width={120} height={20} />
                        </td>
                    ))}
                </tr>
            ))
        );
    }
    if (isEmpty) {
        return (
            // Display "No data available" message when the table is empty
            <tr>
                <td className={`p-4`} colSpan={columnSize}>
                    <Typography variant="subtitle1" color="white" align="center">
                        No data available.
                    </Typography>
                </td>
            </tr>
        );
    }
    return children; // Render actual body content when loading is complete and data is available
}
interface Users {
    pn: string;
    username: string;
    role: string;
    last_login: string;
    [key: string]: any; // Allow additional dynamic keys
}

const UserManagementPage: React.FC = () => {
    const [currentSort, setCurrentSort] = useState<{ [key: string]: 'asc' | 'desc' }>({});
    const [columns, setColumns] = useState<ColumnDef<Users, any>[]>([]); // Column definitions for the table
    const [data, setData] = useState<Users[]>([]); // Data to populate the table   
    const [totalRows, setTotalRows] = useState<number>(0); // Total rows for pagination
    const [isLoadingHeader, setIsLoadingHeader] = useState<boolean>(true); // Loading state for the header
    const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state for table data
    const [isError, setIsError] = useState<boolean>(false); // Error state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUserPn, setSelectedUserPn] = useState<string | null>(null);
    const [isToggled, setIsToggled] = useState(true);
    const [pagination, setPagination] = useState({
        pageIndex: 1, // Current page index (starts at 1)
        pageSize: 10, // Number of rows per page
    });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: true, // Manual pagination to sync with server-side
        state: {
            pagination,
        },
    });

    const openModal = () => {
        setIsModalOpen(true);
    };

    const openDeleteModal = (pn: string) => {
        setSelectedUserPn(pn);
        setIsDeleteModalOpen(true);
    };

    const openUpdateModal = (pn: string) => {
        setSelectedUserPn(pn);
        setIsUpdateModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const closeUpdateModal = () => {
        setSelectedUserPn(null);
        setIsUpdateModalOpen(false);
    };

    const closeDeleteModal = () => {
        setSelectedUserPn(null);
        setIsDeleteModalOpen(false);
    };

    const handleToggle = async () => {
        setIsToggled(!isToggled);

        try {
            const response = await AllowUser(true);
            console.log('API response:', response);
            // Handle the API response, e.g., update UI, show notifications
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors, e.g., show error messages
        }
    };

    const getToggleUser = async () => {
        try {
            const response = await AllowUser(!isToggled);
            console.log('API response:', response);

            // Update the isToggled state based on the API response
            setIsToggled(response.data.allow_all_user); // Assuming the response structure is correct

            // Handle the API response, e.g., update UI, show notifications
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors, e.g., show error messages
            throw error; // Re-throw the error to be handled by the caller
        }
    };


    const handleSort = async (columnId: string) => {
        // Get the current sort state for the clicked column
        const currentSortValue = currentSort[columnId] || 'asc'; // Default to 'asc' if not sorted

        // Update the sort state based on the current sort
        const newSort = currentSortValue === 'asc' ? 'desc' : 'asc';

        // Update state with the new sort value for the clicked column
        setCurrentSort({ ...currentSort, [columnId]: newSort });

        await fetchUsers(pagination.pageIndex, newSort, columnId); // Fetch users with sorting parameters
    };

    const fetchUsers = async (page?: number, sort?: string, order?: string) => {
        try {
            setIsLoading(true);

            const response = await GetUsersList({
                page: page ?? pagination.pageIndex,
                limit: pagination.pageSize,
                sort, // Include the sort parameter
                order, // Include the order parameter
            });

            if (response?.data) {
                console.log('API Response Data:', response.data);

                const { columns, rows, total_rows } = response.data;

                const mappedColumns: ColumnDef<Users, any>[] = columns.map((column: any) => ({
                    id: column.key,
                    header: column.title,
                    accessorKey: column.key,
                }));


                setColumns(mappedColumns); // Set table columns
                setTotalRows(total_rows); // Set total rows count

                console.log('Mapped Columns:', mappedColumns);
                console.log('Extracted Rows:', rows);

                setData(rows as Users[]);
                setIsError(false);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setData([]); // Reset data on error
        } finally {
            setIsLoading(false);
            setIsLoadingHeader(false);
        }
    };

    // Fetch data whenever pageIndex or pageSize changes
    useEffect(() => {
        fetchUsers(pagination.pageIndex);
    }, [pagination.pageIndex, pagination.pageSize]);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        getToggleUser();
    }, []);

    return (
        <div className="min-h-screen bg-[#0816358F] text-white p-8 flex flex-col gap-4">
            <div className="flex flex-row justify-between">
                <h1 className="text-3xl font-semibold mb-6">User List</h1>
                <div className="flex justify-end mb-4 gap-4 ">
                    <div className='flex content-center'>
                        <label className="inline-flex items-center cursor-pointer">
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2">Allow All Users</span>
                            <input type="checkbox" value="" className="sr-only peer" checked={isToggled} onChange={(e) => handleToggle()} />
                            <div className="relative w-11 h-6 rounded-full bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    <button
                        onClick={openModal}
                        className="bg-[#3078FF] hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded flex items-center"
                    >
                        <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add New User
                    </button>
                </div>
            </div>

            {/* Table container */}
            <div className={`w-full max-h-[65dvh] overflow-x-auto ${styles.scrollbar}`}>
                <div className="min-w-full">
                    <table className="table-auto divide-y divide-gray-200 w-full">
                        {/* Table header */}
                        <thead className="sticky top-0 z-[16] border-b border-gray-700 bg-[#060F2C]">
                            <TableHeaderWrapper isLoading={isLoadingHeader}>
                                <Fragment>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <tr key={headerGroup.id} className="text-left">
                                            {headerGroup.headers.map((header) => (
                                                <th
                                                    key={header.id}

                                                    colSpan={header.colSpan}
                                                    className={`${styles.first_child} p-2`}
                                                >
                                                    <button
                                                        className={`${header.column.getCanSort()
                                                            ? "cursor-pointer select-none uppercase font-semibold"
                                                            : ""
                                                            } w-full px-3 m-auto text-gray-100`}
                                                        onClick={() => {
                                                            handleSort(header.id);
                                                        }}
                                                    >
                                                        {typeof header.column.columnDef.header === "function"
                                                            ? header.column.columnDef.header({} as any) // Pass a dummy context
                                                            : header.column.columnDef.header}
                                                        {header.column.getCanSort() && (
                                                            <Fragment>
                                                                {currentSort[header.id] === 'asc' ? '🔼' : currentSort[header.id] === 'desc' ? '🔽' : '🔼'}
                                                            </Fragment>
                                                        )}
                                                    </button>
                                                </th>
                                            ))}
                                            <th className="px-6 py-3 text-center">Action</th>
                                        </tr>
                                    ))}
                                </Fragment>
                            </TableHeaderWrapper>
                        </thead>

                        {/* Table body */}
                        <tbody className="divide-y !divide-gray-200 text-gray-600">
                            <TableBodyWrapper
                                pageSize={10}
                                columnSize={
                                    table.getHeaderGroups()?.[0].headers.length === 0
                                        ? 6 // Adjust the column size to account for the new column
                                        : table.getHeaderGroups()?.[0].headers.length + 1
                                }
                                isLoading={isLoading}
                                isEmpty={data.length === 0}
                            >
                                <Fragment>
                                    {table.getRowModel().rows.map((row) => (
                                        <tr key={row.id} className={`${styles.row_hover} text-gray-100`}>
                                            {row.getVisibleCells().map((cell, idx) => (
                                                <td key={cell.id} className={`whitespace-nowrap ${idx === 0 ? styles.first_child : ""}`}>
                                                    <div className="w-full h-full flex px-4 py-4 items-center rounded-full gap-x-2">
                                                        {cell.getValue()}  {/* Assuming 'getValue' is your accessor function name */}
                                                    </div>
                                                </td>
                                            ))}
                                            {/* Add the "Action" column cell */}
                                            <td className="whitespace-nowrap">
                                                <div className="flex flex-row gap-2">
                                                    <button
                                                        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                                                        onClick={() => openUpdateModal(row.original.pn)}
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                                                        onClick={() => openDeleteModal(row.original.pn)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </Fragment>
                            </TableBodyWrapper>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination component */}
            {data.length > 0 && (
                <Pagination
                    currentPage={pagination.pageIndex}
                    onPageChange={(page) => setPagination((prev) => ({ ...prev, pageIndex: page }))}
                    onRowsPerPageChange={(rows) => setPagination({ pageSize: rows, pageIndex: 1 })}
                    rowsPerPage={table.getState().pagination.pageSize}
                    rowsPerPageOptions={[10, 20, 50]} // Options for rows per page
                    totalRows={totalRows} // Total number of rows
                />
            )}



            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <AddUserModal
                        onClose={closeModal}
                        onAddSuccess={() => fetchUsers()}
                    />
                </div>
            )}

            {isUpdateModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <UpdateUserModal
                        onClose={closeUpdateModal}
                        personalNumber={selectedUserPn}
                        onUpdateSuccess={() => fetchUsers()}
                    />
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <DeleteUserModal
                        onClose={closeDeleteModal}
                        personalNumber={selectedUserPn}
                        onDeleteSuccess={() => fetchUsers()}
                    />
                </div>
            )}
        </div>
    );
};

export default UserManagementPage;
