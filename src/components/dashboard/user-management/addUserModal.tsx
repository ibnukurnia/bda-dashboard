import { useState } from 'react';
import { CreateUser } from '@/modules/usecases/user-management';

interface AddUserModalProps {
    onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ onClose }) => {
    const [pnNumber, setPnNumber] = useState<string>('');
    const [role, setRole] = useState<string>('admin'); // Default role set to 'admin'

    const handleAddUser = async () => {
        try {
            const response = await CreateUser({ pn: pnNumber, roles: role });
            console.log('User created successfully:', response);
            // Optionally close the modal after success
            onClose();
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <div className="bg-[#1A223D] shadow-md rounded-lg p-6 flex flex-col gap-6 w-96">
            <div className="flex flex-row justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    Add New User
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    aria-label="Close modal"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                    </svg>
                </button>
            </div>

            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-1'>
                    <label className="block text-sm font-medium text-white">
                        PN Number
                    </label>
                    <input
                        type="text"
                        placeholder="Input PN Number..."
                        value={pnNumber}
                        onChange={(e) => setPnNumber(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none dark:bg-gray-700 dark:text-white w-full"
                    />
                </div>
                <div className='flex flex-col gap-1'>
                    <label className="block text-sm font-medium text-white">
                        Roles
                    </label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none dark:bg-gray-700 dark:text-white w-full"
                    >
                        <option value="admin">Admin</option>
                        <option value="viewer">Viewer</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleAddUser}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Add User
                </button>
            </div>
        </div>
    );
};

export default AddUserModal;
