import { useEffect, useRef, useState } from 'react';
import { UpdateUser } from '@/modules/usecases/user-management';

interface UpdateUserModalProps {
    onClose: () => void;
    personalNumber: string | null; // Pass the user's personal number
    personalName: string | null; // Pass the user's personal number
    onUpdateSuccess: () => void; // Callback to refresh the user list or provide feedback
}

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({ onClose, onUpdateSuccess, personalNumber, personalName }) => {
    // const [userName, setUserName] = useState(personalName || '');
    const [role, setRole] = useState<string>('Admin'); // Default role set to 'Admin'
    const [isAdding, setIsAdding] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleUpdateUser = async () => {
        if (!personalNumber) return; // Ensure personal number exists

        setIsAdding(true); // Indicate addition in progress
        try {
            const response = await UpdateUser({ personal_number: personalNumber, role });
            // console.log('User created successfully:', response);
            onUpdateSuccess(); // Refresh the user list
            onClose(); // Close the modal after success
        } catch (error) {
            console.error('Error creating user:', error);
        } finally {
            setIsAdding(false); // Reset adding state
        }
    };

    // Close modal when clicking outside
    const handleOutsideClick = (e: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <div
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
        >
            <div className="bg-[#1A223D] shadow-md rounded-lg p-6 flex flex-col gap-6 w-96">
                <div className="flex flex-row justify-between">
                    <h2 className="text-lg font-semibold text-white">Update Roles</h2>
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
                    {/* 
                    <div className="flex flex-col gap-1">
                        <label className="block text-sm font-medium text-white">Username</label>
                        <input
                            type="text"
                            placeholder="Input Username"
                            value={userName} // Use the userName state for input value
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^a-zA-Z ]/g, ''); // Remove non-alphanumeric characters and spaces
                                setUserName(value);
                            }}
                            className="p-2 border-gray-600 rounded-md shadow-sm focus:outline-none bg-gray-700 text-white w-full"

                        />
                    </div> */}

                    <div className="flex flex-col gap-1">
                        <label className="block text-sm font-medium text-white">Roles</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="p-2 border-gray-600 rounded-md shadow-sm focus:outline-none bg-gray-700 text-white w-full"
                        >
                            <option value="Admin">Admin</option>
                            <option value="Viewer">Viewer</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleUpdateUser}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        disabled={isAdding}
                    >
                        {isAdding ? 'Adding...' : 'Update User'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateUserModal;
