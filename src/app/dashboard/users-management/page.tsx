import React from 'react';
import Image from 'next/image';

interface User {
    id: number;
    name: string;
    role: string;
    lastActive: string;
    status: string;
    avatar: string;
}

const users: User[] = [
    { id: 1, name: 'Joko Susanto', role: 'Admin', lastActive: '02-10-2024', status: 'Active', avatar: '/path-to-avatar1.png' },
    { id: 2, name: 'Rizki Saputra', role: 'Viewer', lastActive: '02-10-2024', status: 'Inactive', avatar: '/path-to-avatar2.png' },
    { id: 3, name: 'Muhammad Reyhandi', role: 'Admin', lastActive: '02-10-2024', status: 'Active', avatar: '/path-to-avatar3.png' },
    { id: 4, name: 'Maulana Ibrahim', role: 'Viewer', lastActive: '02-10-2024', status: 'Inactive', avatar: '/path-to-avatar4.png' },
    { id: 5, name: 'Subadrun', role: 'Admin', lastActive: '02-10-2024', status: 'Active', avatar: '/path-to-avatar5.png' },
    { id: 6, name: 'Subadrun', role: 'Viewer', lastActive: '02-10-2024', status: 'Active', avatar: '/path-to-avatar6.png' },
];

const UserManagementPage = () => {
    return (
        <div className="min-h-screen bg-[#0816358F] text-white p-8 flex flex-col gap-4">
            <div className='flex flex-row justify-between'>
                <h1 className="text-3xl font-semibold mb-6">User List</h1>
                <div className="flex justify-end mb-4">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Add New User
                    </button>
                </div>
            </div>


            <table className="table-auto w-full rounded-lg">
                <thead className='border-b '>
                    <tr className="text-left text-gray-300  ">
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3">Last Active</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b">
                            <td className="px-6 py-4 flex items-center">
                                {user.name}
                            </td>
                            <td className="px-6 py-4">{user.role}</td>
                            <td className="px-6 py-4">{user.lastActive}</td>
                            <td className="px-6 py-4">
                                <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium `}
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill={user.status === 'Active' ? 'green' : 'red'}
                                        viewBox="0 0 8 8"
                                    >
                                        <circle cx="4" cy="4" r="3" />
                                    </svg>
                                    {user.status}
                                </span>
                            </td>

                            <td className="px-6 py-4">
                                <button className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-1 12H6L5 7h14zm-9 4v5m4-5v5m5-11H5V4h14v2z"></path>
                                    </svg>
                                    Delete User
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagementPage;
