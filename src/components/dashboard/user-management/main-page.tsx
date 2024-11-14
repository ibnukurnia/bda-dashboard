'use client'

import React, { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import AddUserModal from '@/components/dashboard/user-management/addUserModal'; // Assuming your modal is in the same directory
import DeleteUserModal from '@/components/dashboard/user-management/deleteUserModal'; // Assuming your modal is in the same directory
import { GetUsersList } from '@/modules/usecases/user-management';

export const metadata = { title: 'User Management' } satisfies Metadata;

interface User {
    id: string;
    name: string;
    role: string;
}

const UserManagementPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [userList, setUserList] = useState<User[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    useEffect(() => {
        GetUsersList()
            .then((res) => {
                setUserList(res.data); // Ensure `res.data` matches the `User[]` structure
            })
            .catch(() => {
                setUserList([]);
            });
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
                <thead className="border-b ">
                    <tr className="text-left text-gray-300">
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.map((user) => (
                        <tr key={user.id} className="border-b">
                            <td className="px-6 py-4 flex items-center">{user.name}</td>
                            <td className="px-6 py-4">{user.role}</td>
                            <td className="px-6 py-4">
                                <button
                                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded flex items-center"
                                    onClick={() => openDeleteModal()}
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
                                    Delete User
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>


            </table>

            {/* Modal for adding a new user */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <AddUserModal onClose={closeModal} />
                </div>

            )}

            {/* Modal for delete user */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <DeleteUserModal onClose={closeDeleteModal} />
                </div>
            )}
        </div>
    );
};

export default UserManagementPage;
