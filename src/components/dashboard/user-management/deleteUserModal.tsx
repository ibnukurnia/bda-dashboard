import React, { useState, useRef, useEffect } from 'react';
import { DeleteUser } from '@/modules/usecases/user-management';

interface DeleteModalProps {
    onClose: () => void;
    personalNumber: string | null; // Pass the user's personal number
    personalName: string | null; // Pass the user's personal number
    onDeleteSuccess: () => void; // Callback to refresh user list or provide feedback
}

const DeleteUserModal: React.FC<DeleteModalProps> = ({ onClose, personalNumber, personalName, onDeleteSuccess }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleDelete = async () => {
        if (!personalNumber) return; // Ensure personal number exists

        setIsDeleting(true); // Indicate deletion in progress
        try {
            await DeleteUser(personalNumber); // Call the delete method
            onDeleteSuccess(); // Notify parent component of successful deletion
            onClose(); // Close the modal
        } catch (error) {
            console.error('Error deleting user:', error);
            // Optionally, display an error message to the user
        } finally {
            setIsDeleting(false); // Reset deleting state
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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div
                ref={modalRef}
                className="bg-[#1A223D] text-white shadow-md rounded-lg p-6 flex flex-col gap-6"
            >
                <div className="flex flex-row gap-4 items-center">
                    <div className="flex self-start bg-red-600 p-2 rounded-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 text-white"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-1 12H6L5 7h14zm-9 4v5m4-5v5m5-11H5V4h14v2z"
                            />
                        </svg>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <h2 className="text-lg font-semibold">Delete User</h2>
                        <p className="text-base">
                            Are you sure you want to delete the user with Personal Number{' '}
                            <span className="font-bold">{personalNumber}</span>?
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="bg-transparent text-white px-4 py-2 rounded-md"
                        aria-label="Close modal"
                        disabled={isDeleting} // Disable button while deleting
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                        disabled={isDeleting} // Disable button while deleting
                    >
                        {isDeleting ? 'Deleting...' : 'Delete User'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUserModal;
