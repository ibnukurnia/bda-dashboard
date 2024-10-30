import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { format } from 'date-fns'

import Button from '@/components/system/Button/Button'

interface DropdownTimeProps {
  timeRanges: Record<string, number>
  onRangeChange: (rangeKey: string) => void
  selectedRange: string
  disableMaxRange?: boolean // New prop to disable 2-hour limitation
  disabled?: boolean; // Add disabled prop
}

const DropdownTime: React.FC<DropdownTimeProps> = ({ timeRanges, onRangeChange, selectedRange, disableMaxRange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCustomRange, setIsCustomRange] = useState(false)
  const [customRangeStart, setCustomRangeStart] = useState<string>(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
  const [customRangeEnd, setCustomRangeEnd] = useState<string>(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
  const [position, setPosition] = useState<number>(0)
  const [validationMessage, setValidationMessage] = useState('')
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const dropdownContainerRef = useRef<HTMLDivElement | null>(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
      setIsCustomRange(false) // Close custom range picker when clicking outside
    }
  }

  const handleRangeChange = (rangeKey: string) => {
    if (rangeKey === 'Custom') {
      setIsCustomRange(true)
    } else {
      onRangeChange(rangeKey)
      setIsCustomRange(false)
      setIsOpen(false)
    }
  }

  const handleCustomRangeChange = () => {
    if (customRangeStart && customRangeEnd) {
      const formattedStart = format(new Date(customRangeStart), 'yyyy-MM-dd HH:mm:ss')
      const formattedEnd = format(new Date(customRangeEnd), 'yyyy-MM-dd HH:mm:ss')
      const customRangeLabel = `${formattedStart} - ${formattedEnd}`

      onRangeChange(customRangeLabel)
      setIsCustomRange(false)
      setIsOpen(false)
    }
  }

  const logicValidationDateTime = () => {
    if (disableMaxRange) return false; // Disable validation if max range is bypassed

    // Regular validation logic for max 2-hour range
    if (
      new Date(customRangeEnd).getTime() - new Date(customRangeStart).getTime() > 1000 * 60 * 60 * 2 ||
      new Date(customRangeEnd).getTime() - new Date(customRangeStart).getTime() < 0 ||
      new Date(customRangeEnd).getTime() === new Date(customRangeStart).getTime()
    ) {
      return true
    } else {
      return false
    }
  }


  useEffect(() => {
    if (disableMaxRange) {
      setValidationMessage('') // Clear validation if max range is disabled
      return
    }

    // Existing validation checks
    if (new Date(customRangeEnd).getTime() - new Date(customRangeStart).getTime() > 1000 * 60 * 60 * 2) {
      setValidationMessage('Maximum range of time that can be selected is 2 hours')
    } else if (new Date(customRangeEnd).getTime() - new Date(customRangeStart).getTime() < 0) {
      setValidationMessage('Invalid time selected')
    } else if (new Date(customRangeEnd).getTime() === new Date(customRangeStart).getTime()) {
      setValidationMessage('Minimum range of time that can be selected is 1 minute')
    } else {
      setValidationMessage('')
    }
  }, [customRangeStart, customRangeEnd, disableMaxRange])


  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useLayoutEffect(() => {
    const containerHeight = dropdownContainerRef.current?.clientHeight
    const buttonPos = dropdownRef.current?.offsetTop
    const buttonHeight = dropdownRef.current?.clientHeight
    const emptySpaceTop = dropdownContainerRef.current?.getBoundingClientRect().top;
    const emptySpaceDown = window.innerHeight + window.scrollY - (buttonHeight ?? 0)

    if (buttonPos &&
      containerHeight &&
      emptySpaceTop &&
      (buttonPos + containerHeight > emptySpaceDown) &&
      (buttonPos + containerHeight < emptySpaceTop)
    ) {
      setPosition(0 - containerHeight - 4)
    } else {
      if (buttonHeight) {
        setPosition(buttonHeight + 4)
      }
    }
  }, [isOpen])

  return (
    <div className="relative inline-block text-left self-end" ref={dropdownRef}>
      <Button onClick={toggleDropdown} disabled={disabled}>
        <span className='h-5 flex items-center'>
          {selectedRange?.split(' - ')?.length > 1 ? 'Custom' : selectedRange}
        </span>
        <svg
          className="w-2.5 h-2.5 ml-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      </Button>

      {isOpen && (
        <div
          ref={dropdownContainerRef}
          style={{ top: position }}
          className={`absolute right-0 bg-white rounded-lg shadow-lg z-50 flex ${isCustomRange ? 'w-[600px]' : 'w-[auto]'}`}
        >
          <ul className="text-sm text-gray-800 w-48">
            {Object.keys(timeRanges).map((rangeKey) => (
              <li key={rangeKey}>
                <div
                  onClick={() => handleRangeChange(rangeKey)}
                  className="cursor-pointer block px-4 py-3 hover:bg-gray-200 hover:rounded-lg"
                >
                  {rangeKey}
                </div>
              </li>
            ))}
            <li key="custom">
              <div
                onClick={() => handleRangeChange('Custom')}
                className="cursor-pointer block px-4 py-3 hover:bg-gray-200 hover:rounded-lg"
              >
                Custom
              </div>
            </li>
          </ul>

          {isCustomRange && (
            <div className="p-4 border-l-2 w-full">
              <div className="flex flex-col space-y-3">
                <label className="text-xs font-semibold text-gray-700">Start Date and Time</label>
                <input
                  type="datetime-local"
                  value={customRangeStart}
                  onChange={(e) => setCustomRangeStart(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <label className="text-xs font-semibold text-gray-700">End Date and Time</label>
                <input
                  min={customRangeStart ?? ''}
                  type="datetime-local"
                  value={customRangeEnd}
                  onChange={(e) => setCustomRangeEnd(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
                {validationMessage.length > 0 && (
                  <span className="text-xs font-semibold text-gray-700 text-red-600">{validationMessage}</span>
                )}
              </div>
              <button
                onClick={handleCustomRangeChange}
                className="bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-700 w-full text-sm mt-6 disabled:text-gray-400 disabled:bg-gray-200"
                disabled={logicValidationDateTime()}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DropdownTime
