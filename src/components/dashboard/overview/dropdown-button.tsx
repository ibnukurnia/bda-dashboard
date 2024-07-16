'use client';

import React, { useState } from 'react';
import { ArrowDown } from 'react-feather';
import "./dropdown-button.css"

interface DropdownButtonProps {
    options: string[];
    buttonText: string;
    buttonClassName?: string;
    dropdownClassName?: string;
    onSelectOption: (option: string) => void;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
    options,
    buttonText,
    buttonClassName = '',
    dropdownClassName = '',
    onSelectOption
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown: () => void = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option: string) => {
        onSelectOption(option); // Call parent function with selected option
        setIsOpen(false); // Close dropdown after selection
    };

    return (
        <div className="relative h-full">
            <button
                onClick={toggleDropdown}
                className={`font-bold flex justify-between items-center p-3 rounded-lg dropdown-button-style text-white ${buttonClassName}`}
            >
                {buttonText}
                <ArrowDown size={20} />
            </button>
            {isOpen && (
                <div className={`absolute top-full left-0 w-full z-50 dropdown-button-children-style shadow-md rounded mt-2 z-99 ${dropdownClassName}`}>
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className="block px-4 py-2 text-white cursor-pointer transition duration-300 ease-in-out"
                            onClick={() => handleOptionClick(option)} // Handle option click
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DropdownButton;
