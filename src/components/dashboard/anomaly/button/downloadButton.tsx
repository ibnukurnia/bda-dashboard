// downloadButton.tsx

import React from 'react';

interface DownloadButtonProps {
    label?: string;
    isDownloading?: boolean;
    onClick: () => void;
    disabled?: boolean; // New prop to disable the button
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
    label = "Download CSV",
    isDownloading = false,
    onClick,
    disabled = false, // Default to false
}) => {
    const isButtonDisabled = isDownloading || disabled; // Disable if downloading or explicitly disabled

    return (
        <button
            className={`font-medium rounded-lg text-sm py-3 px-4 text-white text-center bg-blue-700 hover:bg-blue-800 inline-flex items-center gap-2 ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isButtonDisabled}
            onClick={onClick}
        >
            {isDownloading && <div className="spinner" style={{ width: "20px", height: "20px" }} />}
            {isDownloading ? "Downloading CSV... " : label}
            {!isDownloading && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
            )}
        </button>
    );
};

export default DownloadButton;
