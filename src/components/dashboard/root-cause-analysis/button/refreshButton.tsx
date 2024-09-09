import React, { useState, useEffect, useRef } from 'react';

// Define the available intervals
const intervals = [
    { label: '5 seconds', value: 5000 },
    { label: '10 seconds', value: 10000 },
    { label: '30 seconds', value: 30000 },
    { label: '1 minute', value: 60000 },
    { label: '5 minutes', value: 300000 },
    { label: '10 minutes', value: 600000 },
    { label: '30 minutes', value: 1800000 },
    { label: '1 hour', value: 3600000 },
    // { label: '2 hours', value: 7200000 },
    // { label: '1 day', value: 86400000 }
];

const AutoRefreshButton = ({
    onRefresh,
    onAutoRefreshChange
}: {
    onRefresh: () => void,
    onAutoRefreshChange: (autoRefresh: boolean, interval: number) => void
}) => {
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [selectedInterval, setSelectedInterval] = useState<number>(5000); // Default: 5 seconds
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null); // Use ref for the dropdown container

    const handleIntervalChange = (value: number) => {
        setSelectedInterval(value);
        if (!autoRefresh) {
            setAutoRefresh(true); // Automatically check the Auto Refresh box
        }
        onAutoRefreshChange(true, value); // Notify parent of interval change and auto-refresh activation
        setIsDropdownOpen(false); // Close the dropdown after selection
    };

    const toggleAutoRefresh = () => {
        setAutoRefresh(!autoRefresh);
        onAutoRefreshChange(!autoRefresh, selectedInterval); // Notify parent of auto-refresh toggle
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false); // Close the dropdown
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <div className="relative text-left flex flex-row">
            {/* Refresh Now Button */}
            <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium text-sm py-3 px-4 text-center rounded-l inline-flex items-center"
                onClick={onRefresh}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            </button>

            {/* Auto Refresh Button */}
            <div className="relative inline-block border-l" ref={dropdownRef}>
                <button
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium text-sm py-3 px-4 text-center rounded-r inline-flex items-center"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <span className="mr-2">Auto Refresh</span>
                    <svg className={`w-4 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-4">
                        <div className="px-4">
                            <label className="flex items-center mb-2">
                                <input type="checkbox" checked={autoRefresh} onChange={toggleAutoRefresh} className="mr-2" />
                                <span>Auto Refresh</span>
                            </label>

                            <div className="mb-4 text-gray-400 uppercase text-xs">Refresh Interval</div>
                            <ul className="text-sm text-gray-800">
                                {intervals.map((interval) => (
                                    <li key={interval.value}>
                                        <button onClick={() => handleIntervalChange(interval.value)} className={`block w-full text-left px-1 py-2 ${selectedInterval === interval.value ? 'text-blue-600' : 'hover:bg-gray-100'}`}>
                                            {interval.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export default AutoRefreshButton;
