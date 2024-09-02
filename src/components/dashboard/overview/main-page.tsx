'use client'

import React, { Fragment, useEffect, useRef, useState } from 'react'

import './main-page.css'

import { Typography } from '@mui/material'
import { Plus } from 'react-feather'

import Button from '@/components/system/Button/Button'

import OverviewModal from './modal/overview-modal'

// Define your data
const sourceData = [
  {
    name: 'APM',
    count: 1865,
    services: [
      { name: 'Windows', count: 1625, data: [28, 70, 49, 80, 132, 129, 134] },
      { name: 'Linux', count: 1240, data: [28, 50, 124, 80, 132, 78, 134] },
    ],
  },
  {
    name: 'BRIMO',
    count: 1862,
    services: [
      { name: 'Windows', count: 1102, data: [28, 133, 124, 127, 132, 129, 134] }, // Same service name as APM
      { name: 'XY', count: 1580, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'PROMETHEUS API',
    count: 1567,
    services: [
      { name: 'Winqowdkoqk', count: 980, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Z/OS System', count: 587, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'PROMETHEUS DB',
    count: 1567,
    services: [
      { name: 'Winqowdkoqk', count: 980, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Z/OS System', count: 587, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'PANW',
    count: 684,
    services: [
      { name: 'Server', count: 450, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Processor', count: 234, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'WAF',
    count: 684,
    services: [
      { name: 'Server', count: 450, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Processor', count: 234, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'FORTI',
    count: 684,
    services: [
      { name: 'Server', count: 450, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Processor', count: 234, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'IVAT',
    count: 684,
    services: [
      { name: 'Server', count: 450, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Processor', count: 234, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'IRIS',
    count: 684,
    services: [
      { name: 'Server', count: 450, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Processor', count: 234, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'PRTG',
    count: 684,
    services: [
      { name: 'Server', count: 450, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Processor', count: 234, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
  {
    name: 'ZABBIX',
    count: 684,
    services: [
      { name: 'Server', count: 450, data: [28, 133, 124, 127, 132, 129, 134] },
      { name: 'Processor', count: 234, data: [28, 133, 124, 127, 132, 129, 134] },
    ],
  },
]

const dates = ['Jan 21', 'Jan 22', 'Jan 23', 'Jan 24', 'Jan 25', 'Jan 26', 'Jan 27']

const FilterPanel = ({
  onSelectServices,
}: {
  onSelectServices: (services: { name: string; data: number[] }[]) => void
}) => {
  const [selectedSourceIndices, setSelectedSourceIndices] = useState<number[]>([])
  const [selectedServiceOptions, setSelectedServiceOptions] = useState<string[]>([])

  const handleSourceClick = (index: number) => {
    setSelectedSourceIndices((prevIndices) =>
      prevIndices.includes(index) ? prevIndices.filter((i) => i !== index) : [...prevIndices, index]
    )
  }

  const handleServiceChange = (service: { name: string; data: number[] }) => {
    setSelectedServiceOptions((prevServices) =>
      prevServices.includes(service.name)
        ? prevServices.filter((s) => s !== service.name)
        : [...prevServices, service.name]
    )

    // Update the selected services
    onSelectServices((prevServices: { name: string; data: number[] }[]) => {
      const serviceExists = prevServices.some((s) => s.name === service.name)

      // Calculate the new array of services
      const updatedServices = serviceExists
        ? prevServices.filter((s) => s.name !== service.name)
        : [...prevServices, service]

      // Directly pass the updated array to onSelectServices
      return updatedServices
    })
  }

  const selectedServices = selectedSourceIndices
    .flatMap((index) =>
      sourceData[index].services.map((service) => ({
        ...service,
        name: `${sourceData[index].name} - ${service.name}`, // Append source name to service name
      }))
    )
    .reduce(
      (acc, service) => {
        const existingService = acc.find((s) => s.name === service.name)
        if (existingService) {
          existingService.count += service.count
        } else {
          acc.push({ ...service })
        }
        return acc
      },
      [] as { name: string; count: number; data: number[] }[]
    )

  return (
    <div className="bg-gray-900 text-white w-64 p-4 flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-bold">Source Data</h3>
        <ul className="flex flex-col gap-2">
          {sourceData.map((item, index) => (
            <li key={index} className={`flex items-center gap-1 cursor-pointer m-0`}>
              <input
                type="checkbox"
                value={item.name}
                checked={selectedSourceIndices.includes(index)}
                onChange={() => handleSourceClick(index)}
                className="mr-2 cursor-pointer py-1"
              />
              <span className="" onClick={() => handleSourceClick(index)}>
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {selectedServices.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-bold">Service</h3>
          <ul className="flex flex-col gap-2">
            {selectedServices.map((service, index) => (
              <li key={index} className={`flex items-baseline gap-1 cursor-pointer m-0`}>
                <input
                  id={`checkbox-service-${index}`}
                  type="checkbox"
                  value={service.name}
                  checked={selectedServiceOptions.includes(service.name)}
                  onChange={() => handleServiceChange(service)}
                  className="mr-2 cursor-pointer py-1"
                />
                <div
                  className="flex justify-between cursor-pointer w-full gap-1"
                  onClick={() => handleServiceChange(service)}
                >
                  <span className="">{service.name}</span>
                  <div>
                    <span className="bg-blue-500 text-white rounded-lg px-2">{service.count}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const TablePanel = ({
  selectedServices,
  handleAddServices,
}: {
  selectedServices: { name: string; data: number[]; count?: number }[]
  handleAddServices: () => void
}) => {
  return (
    <div className="flex-1 px-4 overflow-auto">
      <div className="flex justify-between items-center mb-4 text-white">
        <span className="font-bold">Showing {selectedServices.length} Services</span>
        <span className="font-bold">Updated at 5:21:11 PM</span>
      </div>
      <div className="overflow-x-auto scrollbar-table">
        <table className="w-full table-auto text-white">
          <thead>
            <tr>
              <th className="p-3">
                <Button onClick={handleAddServices}>
                  <Plus size={'16px'} />
                  <Typography>Add services</Typography>
                </Button>
              </th>
              {dates.map((date) => (
                <th key={date} className="p-3">
                  {date}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedServices.map((service, index) => (
              <Fragment key={index}>
                <tr key={index} className="">
                  <td className="p-3 min-w-64 align-center flex justify-between gap-2">
                    <Typography>{service.name}</Typography>
                    <div className="flex">
                      <span className="bg-blue-500 text-white rounded-lg px-2 h-fit">{service.count}</span>
                    </div>
                  </td>
                  {service.data.map((cell, cellIndex) => {
                    return (
                      <td key={cellIndex} className="p-3 text-center min-w-32 align-top">
                        <div
                          className={`${cell < 50 ? '!bg-green-600' : cell < 100 ? '!bg-orange-600' : '!bg-red-600'} px-2 py-1 rounded-lg`}
                        >
                          <span className="text-white">{cell}</span>
                        </div>
                      </td>
                    )
                  })}
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const MainPageOverview = () => {
  const [selectedDataSource, setSelectedDataSource] = useState<any[]>([])
  const [selectedServices, setSelectedServices] = useState<{ name: string; data: number[]; count?: number }[]>([])
  const [modalServices, setModalServices] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const handleApplyFilter = (sDataSource: any[], sService: { name: string; data: number[]; count?: number }[]) => {
    setSelectedDataSource(sDataSource)
    setSelectedServices(sService)
    setModalServices(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setModalServices(false) // Close the panel when clicking outside of it
      }
    }

    if (modalServices) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [modalServices])

  return (
    <div className="flex flex-row">
      {/* <FilterPanel onSelectServices={setSelectedServices} /> */}
      <TablePanel selectedServices={selectedServices} handleAddServices={() => setModalServices(!modalServices)} />
      {modalServices && (
        <OverviewModal
          open={modalServices}
          listDataSource={sourceData}
          handleOpenModal={setModalServices}
          handleApplyFilter={handleApplyFilter}
          prevSelectedDataSource={selectedDataSource}
          prevSelectedServices={selectedServices}
        />
      )}
    </div>
  )
}

export default MainPageOverview
