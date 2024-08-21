import React, { useState, useEffect, useRef } from 'react';

interface DropdownRangeProps {
    timeRanges: Record<string, number>;
    onRangeChange: (rangeKey: string) => void;
}

const DropdownRange: React.FC<DropdownRangeProps> = ({ timeRanges, onRangeChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRange, setSelectedRange] = useState<string>('');
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    const handleRangeChange = (rangeKey: string) => {
        setSelectedRange(rangeKey);
        onRangeChange(rangeKey);
        setIsOpen(false);
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
        <div className="flex econtent-end relative inline-block text-left self-end" ref={dropdownRef}>
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
                        {Object.keys(timeRanges).map((rangeKey) => (
                            <li key={rangeKey}>
                                <a
                                    href="#"
                                    onClick={() => handleRangeChange(rangeKey)}
                                    className="block px-4 py-2 hover:bg-gray-600 text-white"
                                >
                                    {rangeKey}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DropdownRange;
