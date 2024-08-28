import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';

interface DropdownRangeProps {
    timeRanges: Record<string, number>;
    onRangeChange: (rangeKey: string) => void;
    selectedRange: string; // Receive selectedRange as a prop
}

const DropdownRange: React.FC<DropdownRangeProps> = ({ timeRanges, onRangeChange, selectedRange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCustomRange, setIsCustomRange] = useState(false);
    const [customRangeStart, setCustomRangeStart] = useState<string>(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    const [customRangeEnd, setCustomRangeEnd] = useState<string>(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
            setIsCustomRange(false); // Close custom range picker when clicking outside
        }
    };

    const handleRangeChange = (rangeKey: string) => {
        if (rangeKey === 'Custom') {
            setIsCustomRange(true);
        } else {
            onRangeChange(rangeKey);
            setIsCustomRange(false);
            setIsOpen(false);
        }
    };

    const handleCustomRangeChange = () => {
        if (customRangeStart && customRangeEnd) {
            const customRangeLabel = `${customRangeStart} - ${customRangeEnd}`;
            onRangeChange(customRangeLabel);
            setIsCustomRange(false);
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

    return (
        <div className="relative inline-block text-left self-end" ref={dropdownRef}>
            <button
                type="button"
                onClick={toggleDropdown}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm py-3 px-4 text-center inline-flex items-center"
            >
                {selectedRange || "Select time range"}
                <svg
                    className="w-2.5 h-2.5 ml-2"
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
                <div className={`absolute right-0 mt-2 bg-white rounded-lg shadow-lg z-50 py-4 px-2 flex ${isCustomRange ? 'w-[600px]' : 'w-auto]'}`}>
                    <ul className="text-sm text-gray-800 w-48">
                        {Object.keys(timeRanges).map((rangeKey) => (
                            <li key={rangeKey}>
                                <a
                                    href="#"
                                    onClick={() => handleRangeChange(rangeKey)}
                                    className="block px-4 py-2 hover:bg-gray-200"
                                >
                                    {rangeKey}
                                </a>
                            </li>
                        ))}
                        <li key="custom">
                            <a
                                href="#"
                                onClick={() => handleRangeChange('Custom')}
                                className="block px-4 py-2 hover:bg-gray-200"
                            >
                                Custom
                            </a>
                        </li>
                    </ul>

                    {isCustomRange && (
                        <div className="p-4 border-l-2 w-full">
                            <div className="flex flex-col space-y-3">
                                <label className="text-xs font-semibold text-gray-700">Start Date and Time</label>
                                <input
                                    type="datetime-local"
                                    value={customRangeStart}
                                    onChange={(e) => setCustomRangeStart(e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                                <label className="text-xs font-semibold text-gray-700">End Date and Time</label>
                                <input
                                    type="datetime-local"
                                    value={customRangeEnd}
                                    onChange={(e) => setCustomRangeEnd(e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                            </div>
                            <button
                                onClick={handleCustomRangeChange}
                                className="bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-700 w-full text-sm mt-6"
                            >
                                Apply
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DropdownRange;
