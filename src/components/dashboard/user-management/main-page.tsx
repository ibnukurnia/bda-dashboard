'use client'

import React, { useState } from 'react';
import type { Metadata } from 'next';
import AddUserModal from '@/components/dashboard/user-management/addUserModal'; // Assuming your modal is in the same directory
import DeleteUserModal from '@/components/dashboard/user-management/deleteUserModal'; // Assuming your modal is in the same directory

export const metadata = { title: 'User Management' } satisfies Metadata;

interface User {
    id: number;
    name: string;
    role: string;
    avatar: string;
}

const users: User[] = [
    { id: 1, name: 'Joko Susanto', role: 'Admin', avatar: '/path-to-avatar1.png' },
    { id: 2, name: 'Rizki Saputra', role: 'Viewer', avatar: '/path-to-avatar2.png' },
    { id: 3, name: 'Muhammad Reyhandi', role: 'Admin', avatar: '/path-to-avatar3.png' },
    { id: 4, name: 'Maulana Ibrahim', role: 'Viewer', avatar: '/path-to-avatar4.png' },
    { id: 5, name: 'Subadrun', role: 'Admin', avatar: '/path-to-avatar5.png' },
    { id: 6, name: 'Subadrun', role: 'Viewer', avatar: '/path-to-avatar6.png' },
];

const UserManagementPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

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
                    {users.map((user) => (
                        <tr key={user.id} className="border-b">
                            <td className="px-6 py-4 flex items-center">{user.name}</td>
                            <td className="px-6 py-4">{user.role}</td>
                            <td className="px-6 py-4">
                                <button className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded flex items-center" onClick={openDeleteModal}>
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

            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <DeleteUserModal onClose={closeDeleteModal} />
                </div>
            )}
        </div>
    );
};

export default UserManagementPage;
