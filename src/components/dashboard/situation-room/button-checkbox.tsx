import React from 'react';

interface ButtonWithCheckboxProps {
    id: string;
    buttonText: string;
    isChecked: boolean;
    onCheckboxChange: (id: string, checked: boolean) => void;
    buttonClassName: string;
    type?: string; // Add the 'type' property to the props
}

const ButtonWithCheckbox: React.FC<ButtonWithCheckboxProps> = ({
    id,
    buttonText,
    isChecked,
    onCheckboxChange,
    buttonClassName = '',
    type, // Destructure the 'type' prop
}) => {
    const handleButtonClick = () => {
        onCheckboxChange(id, !isChecked);
    };

    return (
        <button
            onClick={handleButtonClick}
            className={`${buttonClassName} flex items-center space-x-3 px-4 py-2 bg-[#004889] border border-gray-300 rounded text-white`}
        >
            <input
                type="checkbox"
                checked={isChecked}
                onChange={handleButtonClick}
                className="form-checkbox"
            />
            <span>{buttonText}</span>
            {/* Optionally, render the type or use it in conditional rendering */}
            {type && <span className="ml-2 text-sm text-gray-400">({type})</span>}
        </button>
    );
};

export default ButtonWithCheckbox;
