import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

import Button from '@/components/system/Button/Button'

import './dropdown-ds.css'

interface DropdownSeverityProps {
  data: { value: any; id: string | number; label: string }[]
  onSelectData: (id: string) => void
  selectedData: string
}

const DropdownSeverity: React.FC<DropdownSeverityProps> = ({ data, onSelectData, selectedData }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<number>(0)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const dropdownContainerRef = useRef<HTMLDivElement | null>(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  const handleSelectData = (dataSelection: string) => {
    onSelectData(dataSelection)
    setIsOpen(false)
  }

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
    const emptySpaceDown = window.innerHeight + window.scrollY - (buttonHeight ?? 0)

    if (buttonPos && containerHeight && buttonPos + containerHeight > emptySpaceDown) {
      setPosition(0 - containerHeight - 4)
    } else {
      if (buttonHeight) {
        setPosition(buttonHeight + 4)
      }
    }
  }, [isOpen])

  return (
    <div className="relative inline-block text-left self-end" ref={dropdownRef}>
      <Button onClick={toggleDropdown}>
        {data.find((el) => el.value === selectedData)?.label || 'All Data Source'}
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
          className={`absolute right-0 bg-white rounded-lg shadow-lg z-50 flex w-[auto] max-h-96 overflow-auto scrollbar`}
        >
          <ul className="text-sm text-gray-800 w-48">
            {data.map((dataSelection, dsid) => (
              <li key={dsid}>
                <div
                  onClick={() => handleSelectData(dataSelection.value)}
                  className="cursor-pointer block px-4 py-3 hover:bg-gray-200 hover:rounded-lg"
                >
                  {dataSelection.label}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default DropdownSeverity
