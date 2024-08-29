import { useEffect, useRef, useState } from 'react'

interface DropdownFilterProps {
  label: string
  data: any[]
  onChange: (item: string) => void
  disabled?: boolean
  selected: any
}

const DropdownFilter = ({ label, data, onChange, disabled, selected }: DropdownFilterProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string | null>(selected)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  const handleRangeChange = (itemKey: string) => {
    setSelectedItem(itemKey)
    onChange(itemKey)
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

  useEffect(() => {
    setSelectedItem(selected)
  }, [selected])

  return (
    <div>
      <div className="flex flex-col gap-2">
        <label>{label}</label>
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={toggleDropdown}
            disabled={disabled}
            className="text-black border border-gray-300 bg-light-700 disabled:bg-gray-100 disabled:text-gray-400 hover:bg-light-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm flex justify-between items-center p-2 w-full"
          >
            {selectedItem || `Select ${label}`}
            <svg
              className="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          {isOpen && (
            <div
              className="w-full z-50 absolute mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="dropdownDefaultButton"
            >
              <ul className="text-sm text-white">
                {data.map((rangeKey) => (
                  <li key={rangeKey}>
                    <div
                      onClick={() => handleRangeChange(rangeKey)}
                      className="block px-4 py-2 hover:bg-gray-100 hover:rounded-lg text-gray-800 cursor-pointer"
                    >
                      {rangeKey}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DropdownFilter
