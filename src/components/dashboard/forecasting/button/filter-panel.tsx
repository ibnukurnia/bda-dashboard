import React, { useEffect, useRef, useState } from 'react'
import {
  GetFilterDataSource,
  GetFilterMetric,
  GetFilterOptional,
  GetFilterService,
} from '@/modules/usecases/forecasting'

import Button from '@/components/system/Button/Button'

import DropdownFilter from './dropdown'

interface CheckboxOption {
  id: string
  label: string
  type: string
}

interface FilterPanelProps {
  activeFilter: {
    sourceData: string | null
    metric: string | null
    serviceName: string | null
    optional: string | null
  }
  onApplyFilters: (filters: {
    selectedSource: string | null
    selectedMetric: string | null
    selectedService: string | null
    selectedOption: string | null
  }) => void // Separate filters for anomalies and services
}

const FilterPanel: React.FC<FilterPanelProps> = ({ activeFilter, onApplyFilters }) => {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const [selectedSource, setSelectedSource] = useState<string | null>(activeFilter.sourceData)
  const [selectedMetric, setSelectedMetric] = useState<string | null>(activeFilter.metric)
  const [selectedService, setSelectedService] = useState<string | null>(activeFilter.serviceName)
  const [selectedOption, setSelectedOption] = useState<string | null>(activeFilter.optional)

  const [dataSource, setDataSource] = useState<any[]>([])
  const [metric, setMetric] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [optional, setOptional] = useState<any[]>([])

  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  const handleApply = () => {
    onApplyFilters({
      selectedSource,
      selectedMetric,
      selectedService,
      selectedOption,
    })
    setIsOpen(false) // Close the panel after applying filters
  }

  const handleReset = () => {
    setSelectedSource(null)
    setSelectedMetric(null)
    setSelectedService(null)
    setSelectedOption(null)
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
    setSelectedMetric(activeFilter.metric)
    setSelectedService(activeFilter.serviceName)
    setSelectedOption(activeFilter.optional)
  }, [isOpen])

  useEffect(() => {
    GetFilterDataSource().then((source) => setDataSource(source.data))
  }, [])

  return (
    <div className="flex self-end z-50">
      <button
        className="font-medium rounded-lg text-sm py-3 ps-4 pe-9 text-white text-center bg-blue-700 hover:bg-blue-800 inline-flex items-center gap-2"
        onClick={togglePanel}
      >
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
      </button>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div ref={panelRef} className="bg-white rounded-lg p-6 w-96 flex flex-col gap-3">
            <h2 className="text-xl font-semibold mb-4 text-center">Filter</h2>
            <DropdownFilter
              label="Source Data"
              data={dataSource}
              onChange={(item: string) => {
                setSelectedSource(item)
                setSelectedMetric(null)
                setSelectedService(null)
                setSelectedOption(null)
                GetFilterMetric().then((metric) => setMetric(metric.data))
              }}
              selected={selectedSource}
            />
            <DropdownFilter
              disabled={selectedSource === null}
              label="Metric"
              data={metric}
              onChange={(item: string) => {
                setSelectedMetric(item)
                setSelectedService(null)
                setSelectedOption(null)
                GetFilterService().then((service) => setServices(service.data))
              }}
              selected={selectedMetric}
            />
            <DropdownFilter
              disabled={selectedMetric === null}
              label="Service Name"
              data={services}
              onChange={(item: string) => {
                setSelectedService(item)
                setSelectedOption(null)
                GetFilterOptional().then((options) => setOptional(options.data))
              }}
              selected={selectedService}
            />
            <DropdownFilter
              disabled={selectedService === null}
              label="Optional"
              data={optional}
              onChange={(item: string) => setSelectedOption(item)}
              selected={selectedOption}
            />
            <div className="flex justify-between mt-6 space-x-4">
              <Button variant="secondary" onClick={handleReset}>
                RESET
              </Button>
              <Button
                disabled={[selectedSource, selectedMetric, selectedService, selectedOption].some((el) => el === null)}
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
