import React, { useRef } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getYear, getMonth } from 'date-fns';
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
const CustomDatePicker = ({ selectedDate, handleDateChange }) => {
  const datePickerRef = useRef(null); // Reference for DatePicker

  const years = Array.from(
    { length: getYear(new Date()) - 1990 + 1 },
    (_, i) => 1990 + i
  );

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div style={{ display: 'inline-block', position: 'relative', border:'2px solid var(--border-color)', borderRadius:'8px', background:'white' }}>
      <button
        className='data-picker-icon-btn'
        onClick={() => datePickerRef.current.setOpen(true)} // Open DatePicker on button click
        style={{
            width:'fit-content',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          padding: '0px',
          fontSize:'small',
          color:'var(--border-color)'
        }}
      >
        <span style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
        <FaRegCalendarAlt style={{ fontSize: '24px', color: 'var(--link-color)' }} />
        {/* Fecha de Nacimiento */}
        </span>
      </button>
      
      <DatePicker
        ref={datePickerRef}                // Attach ref to DatePicker
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div
            style={{
              margin: 10,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button className='data-picker-btn' onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
            <FaArrowLeft/>
            </button>
            <select
              value={getYear(date)}
              onChange={({ target: { value } }) => changeYear(value)}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={months[getMonth(date)]}
              onChange={({ target: { value } }) =>
                changeMonth(months.indexOf(value))
              }
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>

            <button className='data-picker-btn' onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
            <FaArrowRight/>
            </button>
          </div>
        )}
        selected={selectedDate}             // Use the passed prop for the selected date
        onChange={handleDateChange}         // Call the parent handler when date changes
        customInput={<input style={{ display: 'none' }} />} // Hide default input
      />
    </div>
  );
};

export default CustomDatePicker;
