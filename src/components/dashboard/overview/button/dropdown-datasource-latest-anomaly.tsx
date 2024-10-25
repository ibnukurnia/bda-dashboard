import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'

import Button from '@/components/system/Button/Button'

import './dropdown-ds.css'
import { GetDataSourceLatestAnomaly } from '@/modules/usecases/overviews'
import Skeleton from '@/components/system/Skeleton/Skeleton'
import { handleStartEnd } from '@/helper'

interface DropdownDataSourceLatestAnomalyProps {
  timeRange: string
  onSelectData: (value?: string) => void
  handleReset?: () => void
  selectedData?: string | null
}

export interface DropdownDataSourceLatestAnomalyHandle {
  refresh: (timeRange: string) => void
}

const DropdownDataSourceLatestAnomaly = forwardRef<DropdownDataSourceLatestAnomalyHandle, DropdownDataSourceLatestAnomalyProps>(({
  timeRange,
  onSelectData,
  handleReset,
  selectedData,
}, ref) => {
  const [data, setData] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<number>(0)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const dropdownContainerRef = useRef<HTMLDivElement | null>(null)

  // Use useImperativeHandle to expose the custom method
  useImperativeHandle(ref, () => ({
    refresh(timeRange) {
      setIsLoading(true)
      fetchData(timeRange)
    },
  }));

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  const handleSelectData = (dataSelection?: string) => {
    onSelectData(dataSelection)
    setIsOpen(false)
  }

  useEffect(() => {
    setIsLoading(true)
    fetchData()
  }, [timeRange])

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

  function fetchData(
    customTimeRange?: string
  ) {
    const { startTime, endTime } = handleStartEnd(customTimeRange ?? timeRange)
    GetDataSourceLatestAnomaly({
      start_time: startTime,
      end_time: endTime,
    })
      .then((res) => {
        setData(res.data ?? []);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  if (isLoading) return (
    <Skeleton width={175} height={48} />
  )

  return (
    <div className="relative inline-block text-left self-end" ref={dropdownRef}>
      <Button onClick={toggleDropdown}>
        {selectedData ?? 'All Data Source'}
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
          className={`absolute right-0 bg-white rounded-lg shadow-lg flex w-[auto] max-h-96 overflow-auto scrollbar z-[100]`}
        >
          <ul className="text-sm text-gray-800 w-48">
            <li>
              <div
                onClick={() => handleSelectData(undefined)}
                className="cursor-pointer block px-4 py-3 hover:bg-gray-200 hover:rounded-lg"
              >
                All Data Source
              </div>
            </li>
            {data.map((d, dsid) => (
              <li key={dsid}>
                <div
                  onClick={() => handleSelectData(d)}
                  className="cursor-pointer block px-4 py-3 hover:bg-gray-200 hover:rounded-lg"
                >
                  {d}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
})

export default DropdownDataSourceLatestAnomaly
