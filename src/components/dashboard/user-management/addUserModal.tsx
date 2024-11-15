import { useState } from 'react';
import { CreateUser } from '@/modules/usecases/user-management';

interface AddUserModalProps {
    onClose: () => void;
    onAddSuccess: () => void; // Callback to refresh the user list or provide feedback
}

const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, onAddSuccess }) => {
    const [pnNumber, setPnNumber] = useState<string>('');
    const [role, setRole] = useState<string>('Admin'); // Default role set to 'Admin'
    const [isAdding, setIsAdding] = useState(false);

    const handleAddUser = async () => {
        setIsAdding(true); // Indicate addition in progress
        try {
            const response = await CreateUser({ personal_number: pnNumber, role });
            console.log('User created successfully:', response);
            onAddSuccess(); // Refresh the user list
            onClose(); // Close the modal after success
        } catch (error) {
            console.error('Error creating user:', error);
        } finally {
            setIsAdding(false); // Reset adding state
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose(); // Close the modal when clicking outside
        }
    };

    return (
        <div
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleBackdropClick} // Close modal on backdrop click
        >
            <div className="bg-[#1A223D] shadow-md rounded-lg p-6 flex flex-col gap-6 w-96">
                <div className="flex flex-row justify-between">
                    <h2 className="text-lg font-semibold text-white">Add New User</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
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

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="block text-sm font-medium text-white">PN Number</label>
                        <input
                            type="text"
                            placeholder="Input PN Number..."
                            value={pnNumber}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    setPnNumber(value);
                                }
                            }}
                            className="mt-1 p-2 border-gray-600 rounded-md shadow-sm focus:outline-none bg-gray-700 text-white w-full"
                        />
                        {pnNumber !== '' && !/^\d+$/.test(pnNumber) && (
                            <span className="text-red-500 text-xs mt-1">
                                PN Number should contain only numbers.
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="block text-sm font-medium text-white">Roles</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-1 p-2 border-gray-600 rounded-md shadow-sm focus:outline-none bg-gray-700 text-white w-full"
                        >
                            <option value="Admin">Admin</option>
                            <option value="viewer">Viewer</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleAddUser}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        disabled={isAdding}
                    >
                        {isAdding ? 'Adding...' : 'Add User'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddUserModal;
