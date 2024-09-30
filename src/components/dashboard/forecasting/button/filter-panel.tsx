import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { GetFilterServiceList } from '@/modules/usecases/forecasting'

import { useLocalStorage } from '@/hooks/use-storage'
import Button from '@/components/system/Button/Button'

import DropdownFilter from './dropdown'

interface FilterPanelProps {
  activeFilter: {
    sourceData: string | null
    serviceName: string | null
    selectedDate: string
  }
  onApplyFilters: (filters: {
    selectedSource: string | null
    selectedService: string | null
    selectedDate: string
  }) => void // Separate filters for anomalies and services
}

const FilterPanel: React.FC<FilterPanelProps> = ({ activeFilter, onApplyFilters }) => {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const [selectedSource, setSelectedSource] = useState<string | null>(activeFilter.sourceData)
  const [selectedService, setSelectedService] = useState<string | null>(activeFilter.serviceName)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [services, setServices] = useState<any[]>([])
  const [filterValue] = useLocalStorage('filter', undefined)

  const dataSource = ['tpm', 'sales_volume', 'error_rate']
  const dataSourceWithoutServices = ['sales_volume', 'error_rate']

  const today = new Date()
  const todayZero = new Date(today?.getFullYear(), today?.getMonth(), today?.getDate())
  const maxDate = new Date(
    new Date(today?.getFullYear(), today?.getMonth(), today?.getDate()).setDate(todayZero.getDate() + 29)
  ).toDateString()

  const isUnavailableDate = () => {
    const parsedSelectedDate = new Date(selectedDate)
    const selectedDateZero = new Date(
      parsedSelectedDate?.getFullYear(),
      parsedSelectedDate?.getMonth(),
      parsedSelectedDate?.getDate()
    )
    const resLogicDate =
      selectedDateZero.getTime() > new Date(maxDate).getTime()

    return resLogicDate
  }

  const formatDate = (date: Date | string) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
  }

  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  const handleApply = () => {
    onApplyFilters({
      selectedSource,
      selectedService,
      selectedDate,
    })
    setIsOpen(false) // Close the panel after applying filters
  }

  const handleReset = () => {
    setSelectedSource(null)
    setSelectedService(null)
    setSelectedDate('')
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false) // Close the panel when clicking outside of it
      }
    }

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
    setSelectedSource(activeFilter.sourceData)
    setSelectedService(activeFilter.serviceName)
    setSelectedDate(activeFilter.selectedDate)
  }, [isOpen])

  useLayoutEffect(() => {
    if (filterValue?.dataSource) {
      GetFilterServiceList({ data_source: filterValue.dataSource }).then((service) => setServices(service.data))
    }
  }, [])

  return (
    <div className="flex self-end z-50">
      <Button onClick={togglePanel}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
          />
        </svg>
        Filter
      </Button>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div ref={panelRef} className="bg-white rounded-lg p-6 w-96 flex flex-col gap-3">
            <h2 className="text-xl font-semibold mb-4 text-center">Filter</h2>
            <DropdownFilter
              label="Source Data"
              data={dataSource}
              onChange={(item: string) => {
                setSelectedSource(item)
                setSelectedService(null)
                GetFilterServiceList({ data_source: item }).then((service) => setServices(service.data))
              }}
              selected={selectedSource}
            />
            {!dataSourceWithoutServices.includes(selectedSource ?? '') &&
              <DropdownFilter
                disabled={selectedSource === null}
                label="Service Name"
                data={services}
                onChange={(item: string) => {
                  setSelectedService(item)
                }}
                selected={selectedService}
              />
            }
            <label>Select Date</label>
            <input
              type="date"
              name=""
              id=""
              max={formatDate(maxDate)}
              className={`text-black border border-gray-300 bg-light-700 disabled:bg-gray-100 disabled:text-gray-400 hover:bg-light-800 focus:outline-none font-medium rounded-lg text-sm p-2 w-full`}
              onChange={(e) => setSelectedDate(e.target.value)}
              value={selectedDate}
              style={
                isUnavailableDate()
                  ? {
                      border: '1px solid red',
                      boxShadow:
                        'var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);',
                    }
                  : {}
              }
            />
            {/* <DatePicker /> */}
            <div className="flex justify-between mt-6 space-x-4">
              <Button variant="secondary" onClick={handleReset}>
                RESET
              </Button>
              <Button
                disabled={
                  selectedSource === null ||
                  (!dataSourceWithoutServices.includes(selectedSource ?? '') && selectedService == null) ||
                  !selectedDate ||
                  (selectedDate.length !== 0 && isUnavailableDate())
                }
                onClick={handleApply}
              >
                TERAPKAN
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterPanel
