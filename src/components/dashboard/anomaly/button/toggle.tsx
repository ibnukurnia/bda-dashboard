import React, { useState } from "react";
import "./toggle.css"; // Import the CSS file

export type ToggleOption = {
  id: string;
  icon: JSX.Element;
}

interface ToggleProps {
  defaultToggle: ToggleOption;
  toggleList: ToggleOption[];
  handleSelect: (value: ToggleOption) => void;
}

const Toggle: React.FC<ToggleProps> = ({
  defaultToggle,
  toggleList,
  handleSelect,
}) => {
  const [selected, setSelected] = useState<ToggleOption>(defaultToggle ?? toggleList[0]);

  const handleOnSelect = (value: ToggleOption): void => {
    setSelected(value);
    handleSelect(value)
  };

  return (
    <div className={`toggle-container`}>
      {toggleList.map(toggle => 
        <button
          key={toggle.id}
          className={`
            option ${selected.id === toggle.id ? "selected" : ""}
            flex gap-2 p-2 justify-center w-full
          `}
          onClick={() => handleOnSelect(toggle)}
        >
          {selected.id === toggle.id &&
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="12" height="12" x="0" y="0" viewBox="0 0 511.985 511.985">
              <g>
                <path d="M500.088 83.681c-15.841-15.862-41.564-15.852-57.426 0L184.205 342.148 69.332 227.276c-15.862-15.862-41.574-15.862-57.436 0-15.862 15.862-15.862 41.574 0 57.436l143.585 143.585c7.926 7.926 18.319 11.899 28.713 11.899 10.394 0 20.797-3.963 28.723-11.899l287.171-287.181c15.862-15.851 15.862-41.574 0-57.435z" fill="#FFFFFF">
                </path>
              </g>
            </svg>
          }
          {toggle.icon}
        </button>
      )}
    </div>
  );
};

export default Toggle;
