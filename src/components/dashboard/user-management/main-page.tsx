'use client';

import React, { useState, useEffect } from 'react';
import AddUserModal from '@/components/dashboard/user-management/addUserModal';
import DeleteUserModal from '@/components/dashboard/user-management/deleteUserModal';
import { GetUsersList } from '@/modules/usecases/user-management';
import Skeleton from '@/components/system/Skeleton/Skeleton';

const UserManagementPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userList, setUserList] = useState<Record<string, any>[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [selectedUserPn, setSelectedUserPn] = useState<string | null>(null);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const openDeleteModal = (pn: string) => {
        setSelectedUserPn(pn);
        setIsDeleteModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
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
                                <td className="px-6 py-4">
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



            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <AddUserModal
                        onClose={closeModal}
                        onAddSuccess={() => fetchUsers()}
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
