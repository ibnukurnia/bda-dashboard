import React, { useState } from 'react';

interface ButtonWithCheckboxProps {
    buttonText: string;
    buttonClassName: string;
}

const ButtonWithCheckbox: React.FC<ButtonWithCheckboxProps> = ({ buttonText, buttonClassName = '' }) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleButtonClick = () => {
        setIsChecked(!isChecked);
    };

    return (
        <button
            onClick={handleButtonClick}
            className={`${buttonClassName} flex items-center space-x-2 px-4 py-2 bg-[#004889] border border-gray-300 rounded text-white w-40`}
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
