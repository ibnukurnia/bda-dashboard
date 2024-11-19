'use client';

import React, { useState, useEffect } from 'react';
import AddUserModal from '@/components/dashboard/user-management/addUserModal';
import DeleteUserModal from '@/components/dashboard/user-management/deleteUserModal';
import { GetUsersList } from '@/modules/usecases/user-management';
import Skeleton from '@/components/system/Skeleton/Skeleton';
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, ColumnDef } from '@tanstack/react-table';
import Pagination from '@/components/system/Pagination/Pagination'; // Custom pagination component
import UpdateUserModal from './updateUserModal';


interface Users {
    personal_number: string;
    username: string;
    role: string;
    last_login: string;

}

const UserManagementPage: React.FC = () => {
    const [columns, setColumns] = useState<ColumnDef<Users, any>[]>([]); // Column definitions for the table
    const [data, setData] = useState<Users[]>([]); // Data to populate the table   
    const [totalRows, setTotalRows] = useState<number>(0); // Total rows for pagination
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userList, setUserList] = useState<Record<string, any>[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [selectedUserPn, setSelectedUserPn] = useState<string | null>(null);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [pagination, setPagination] = useState({
        pageIndex: 1, // Current page index (starts at 1)
        pageSize: 8, // Number of rows per page
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

    const fetchUsers = async () => {
        try {
            setIsLoadingUsers(true);
            const response = await GetUsersList();
            const data = response.data || [];
            setUserList(data);

            // Dynamically extract headers from the first object in the data
            if (data.length > 0) {
                setHeaders(Object.keys(data[0]));
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setUserList([]);
            setHeaders([]);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="min-h-screen bg-[#0816358F] text-white p-8 flex flex-col gap-4">
            <div className="flex flex-row justify-between">
                <h1 className="text-3xl font-semibold mb-6">User List</h1>
                <div className="flex justify-end mb-4">
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

            <table className="table-auto w-full rounded-lg">
                <thead className="border-b">
                    <tr className="text-left text-gray-300 uppercase">
                        {headers.map((header) => (
                            <th key={header} className="px-6 py-3">
                                {isLoadingUsers ? (
                                    <Skeleton className="m-auto" width={120} height={20} />
                                ) : (
                                    header.replace('_', ' ')
                                )}
                            </th>
                        ))}
                        <th className="px-6 py-3">
                            {isLoadingUsers ? (
                                <Skeleton className="m-auto" width={80} height={20} />
                            ) : (
                                'Action'
                            )}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoadingUsers ? (
                        // Skeleton loader for each row and column
                        Array(5) // Adjust the number of rows as needed
                            .fill(0)
                            .map((_, rowIndex) => (
                                <tr key={rowIndex} className="border-b">
                                    {headers.concat(['Action']).map((_, colIndex) => (
                                        <td key={colIndex} className="px-6 py-4">
                                            <Skeleton className="m-auto" width={120} height={20} />
                                        </td>
                                    ))}
                                </tr>
                            ))
                    ) : userList.length > 0 ? (
                        userList.map((user) => (
                            <tr key={user.pn || user.id} className="border-b">
                                {headers.map((header) => (
                                    <td key={header} className="px-6 py-4">
                                        {user[header] === '' || user[header] == null ? '-' : user[header]} {/* Handle empty strings, null, or undefined */}
                                    </td>
                                ))}
                                <td className="px-6 py-4 flex flex-row gap-2">
                                    <button
                                        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded flex items-center"
                                        onClick={() => openUpdateModal(user.pn)}
                                    >
                                        <svg
                                            className="w-4 h-4 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 7l-1 12H6L5 7h14zm-9 4v5m4-5v5m5-11H5V4h14v2z"
                                            />
                                        </svg>
                                        Update
                                    </button>
                                    <button
                                        className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded flex items-center"
                                        onClick={() => openDeleteModal(user.pn)}
                                    >
                                        <svg
                                            className="w-4 h-4 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 7l-1 12H6L5 7h14zm-9 4v5m4-5v5m5-11H5V4h14v2z"
                                            />
                                        </svg>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={headers.length + 1} className="text-center py-4">
                                No users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

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
