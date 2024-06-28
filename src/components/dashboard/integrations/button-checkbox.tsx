import React, { useState } from 'react';

interface ButtonWithCheckboxProps {
    buttonText: string;
}

const ButtonWithCheckbox: React.FC<ButtonWithCheckboxProps> = ({ buttonText }) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleButtonClick = () => {
        setIsChecked(!isChecked);
    };

    return (
        <button
            onClick={handleButtonClick}
            className="flex items-center space-x-2 p-2 bg-[#004889] border border-gray-300 rounded text-white"
        >
            <input
                type="checkbox"
                checked={isChecked}
                onChange={handleButtonClick}
                className="form-checkbox"
            />
            <span>{buttonText}</span>
        </button>
    );
};

export default ButtonWithCheckbox;
