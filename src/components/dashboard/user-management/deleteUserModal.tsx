import React from 'react';

interface DeleteModalProps {
    onClose: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ onClose }) => {
    return (
        <div className="bg-[#1A223D] text-white shadow-md rounded-lg p-6  flex flex-col gap-6">
            <div className="flex flex-row gap-4 items-center">
                <div className="fles self-start bg-red-600 p-2 rounded-full">
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
                            d="M19 7l-1 12H6L5 7h14zm-9 4v5m4-5v5m5-11H5V4h14v2z"
                        />
                    </svg>
                </div>

                <div className='flex flex-col gap-2.5'>
                    <h2 className="text-lg font-semibold">Delete User</h2>
                    <p className='text-base'>Are you sure you want to delete this user?</p>
                </div>

            </div>


            <div className="flex justify-end gap-4">
                <button
                    onClick={onClose}
                    className="bg-transparent text-white px-4 py-2 rounded-md"
                    aria-label="Close modal"
                >
                    Cancel
                </button>
                <button

                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                >
                    Delete User
                </button>
            </div>
        </div>
    );
};

export default DeleteModal;
