import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the styles
import styled from 'styled-components'; // Import styled-components for styling
import { Calendar } from 'react-feather';

interface DatePickerProps {
  selectedDate: Date | null; // Allow null for initial state
  onChange: (date: Date | null) => void;
  selectsStart?: boolean;
  selectsEnd?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  minDate?: Date | null;
  maxDate?: Date | null;
  placeholder?: string;
}
const DatePickerContainer = styled.div`
  position: relative;
  width: 240px;
  height: 46px;
`;

const CalendarIcon = styled(Calendar)`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  pointer-events: none; // Ensure the icon doesn't block input events
`;
// Styled DatePicker with styled-components
const CustomDatePicker = styled(DatePicker)`
  width: 240px;
  height: 46px;
  padding: 11px 12px;
  gap: 10px;
  border-radius: 8px;
  box-shadow: 0px 4px 10.1px 12px #00000040;
  background: linear-gradient(263.89deg, #004889 37.01%, rgba(0, 53, 190, 0.001) 115.92%, rgba(12, 48, 142, 0) 115.93%);
  color: white;
   &::placeholder {
    color: white;
    opacity: 1; // Override the default opacity
  }

  /* Targeting the placeholder pseudo-element */
  & .react-datepicker__input-container input::placeholder {
    color: white;
    opacity: 1; // Override the default opacity
  }
`;

const DatePickerComponent: React.FC<DatePickerProps> = ({
  selectedDate,
  onChange,
  selectsStart = false,
  selectsEnd = false,
  startDate,
  endDate,
  minDate,
  maxDate,
  placeholder,
}) => {
  // @ts-ignore
  // @ts-nocheck
  return (
    <DatePickerContainer>
      <CustomDatePicker
        className='cursor-pointer'
        selected={selectedDate}
        onChange={onChange}
        selectsStart={selectsStart}
        selectsEnd={selectsEnd}
        startDate={startDate ?? undefined} // Ensure null is converted to undefined
        endDate={endDate ?? undefined} // Ensure null is converted to undefined
        minDate={minDate ?? undefined} // Ensure null is converted to undefined
        maxDate={maxDate ?? undefined} // Ensure null is converted to undefined
        placeholderText={placeholder}
      />
      <CalendarIcon />
    </DatePickerContainer>
  );
};

export default DatePickerComponent;
