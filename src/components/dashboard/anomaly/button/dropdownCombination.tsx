import React, { useState, useRef, useEffect } from 'react';

interface MultiSelectDropdownProps {
    options: string[];
    placeholder?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ options, placeholder = "Select multiple options..." }) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (option: string) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter(item => item !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                className="relative w-full py-3 ps-4 pe-9 flex gap-x-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-start text-sm focus:outline-none"
                onClick={toggleDropdown}
            >
                {selectedOptions.length > 0 ? selectedOptions.join(', ') : placeholder}
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 12z" clipRule="evenodd" />
                    </svg>
                </div>
            </button>
            {isOpen && (
                <div className="absolute mt-2 w-full rounded-lg shadow-lg bg-white z-10">
                    <ul className="max-h-60 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {options.map((option) => (
                            <li
                                key={option}
                                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 text-gray-900 hover:bg-gray-100 ${selectedOptions.includes(option) ? 'font-semibold' : ''
                                    }`}
                                onClick={() => handleOptionClick(option)}
                            >
                                <span className="block truncate">{option}</span>
                                {selectedOptions.includes(option) && (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 12z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;
