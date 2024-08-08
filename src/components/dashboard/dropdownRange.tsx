import React, { useState, useEffect, useRef } from 'react';
import { Anomaly } from '@/types/anomaly';
import moment from 'moment-timezone';

interface DropdownProps {
    AnomalyData: Anomaly[];
    onFilterChange: (filteredData: Anomaly[]) => void; // Callback to pass filtered data
}

const timeRanges = {
    'Last 5 minutes': 5,
    'Last 10 minutes': 10,
    'Last 15 minutes': 15,
    'Last 30 minutes': 30,
    'Last 1 hour': 60,
    'Last 3 hours': 180,
    'Last 12 hours': 720,
} as const;

type TimeRangeKey = keyof typeof timeRanges;

const Dropdown: React.FC<DropdownProps> = ({ AnomalyData, onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRange, setSelectedRange] = useState<TimeRangeKey | ''>('');
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const parseTimestamp = (timestamp: string): moment.Moment => {
        return moment.tz(timestamp, 'Asia/Bangkok'); // Adjust time zone as needed
    };

    const formatDate = (date: Date): string => {
        const pad = (num: number) => (num < 10 ? `0${num}` : num);
        return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}+00:00`;
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const filterData = (range: TimeRangeKey) => {
        const timezone = 'Asia/Bangkok';
        const now = moment().tz(timezone); // Current time in the specified time zone
        const minutes = timeRanges[range];
        const threshold = now.clone().subtract(minutes, 'minutes'); // Threshold time in the specified time zone

        // Log the current and threshold times in the specified time zone
        console.log('Current Time:', now.format('YYYY-MM-DD HH:mm:ssZ'));
        console.log('Threshold Time:', threshold.format('YYYY-MM-DD HH:mm:ssZ'));

        const filteredData = AnomalyData.filter((item) => {
            const itemDate = parseTimestamp(item.timestamp); // Convert item timestamp to the specified time zone
            // Compare using moment objects
            return itemDate.isBetween(threshold, now, null, '[)');
        });

        // Log filtered data for debugging
        console.log(filteredData);

        // Pass filtered data to parent
        onFilterChange(filteredData);
    };


    const handleRangeChange = (range: TimeRangeKey) => {
        setSelectedRange(range);
        filterData(range);
        setIsOpen(false);
    };

    return (
        <div className="content-center relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                onClick={toggleDropdown}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
            >
                {selectedRange || "Select time range"}
                <svg
                    className="w-2.5 h-2.5 ms-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                    />
                </svg>
            </button>

            {isOpen && (
                <div
                    className="z-50 absolute right-0 mt-2 w-44 bg-gray-700 divide-y divide-gray-100 rounded-lg shadow"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="dropdownDefaultButton"
                >
                    <ul className="py-2 text-sm text-white">
                        {Object.keys(timeRanges).map((range) => (
                            <li key={range}>
                                <a
                                    href="#"
                                    onClick={() => handleRangeChange(range as TimeRangeKey)}
                                    className="block px-4 py-2 hover:bg-gray-100 text-white"
                                >
                                    {range}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};


export default Dropdown;
