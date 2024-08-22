import React from 'react';

interface DropdownTabsProps {
    options: string[];
    selected: string;
    onChange: (value: string) => void;
}

const DropdownTabs: React.FC<DropdownTabsProps> = ({ options, selected, onChange }) => {
    return (
        <select
            value={selected}
            onChange={(e) => onChange(e.target.value)}
            className="p-2 border rounded-md"
        >
            {options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
};

export default DropdownTabs;
