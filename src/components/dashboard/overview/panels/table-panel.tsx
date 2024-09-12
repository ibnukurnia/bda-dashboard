import { Fragment, useLayoutEffect, useRef, useState } from 'react'
import { Typography } from '@mui/material'
import { Plus } from 'react-feather'

import Button from '@/components/system/Button/Button'

import './table-panel.css'

const TablePanel = ({
  selectedServices,
  handleAddServices,
}: {
  selectedServices: { name: string; data: number[]; count?: number }[]
  handleAddServices: () => void
}) => {
  const containerTableRef = useRef<HTMLDivElement>(null)
  const firstThRef = useRef<HTMLTableHeaderCellElement>(null)
  const dates = [
    'Jan 21',
    'Jan 22',
    'Jan 23',
    'Jan 24',
    'Jan 25',
    'Jan 26',
    'Jan 27',
    'Jan 28',
    'Jan 29',
    'Jan 30',
    'Jan 31',
  ]

  const [firstThWidth, setFirstThWidth] = useState(0)
  const [scrollXTable, setScrollXTable] = useState(0)

  useLayoutEffect(() => {
    const resWidth = firstThRef.current?.offsetWidth
    setFirstThWidth(resWidth ?? 0)
  }, [])

  return (
    <div className="relative grid">
      <div
        ref={containerTableRef}
        onScroll={() => setScrollXTable(containerTableRef.current?.scrollLeft ?? 0)}
        className="overflow-auto scrollbar-table"
      >
        <table className="w-full table-auto text-white relative">
          <thead>
            <tr>
              <th className="p-3 th" ref={firstThRef}>
                <Button onClick={handleAddServices}>
                  <Plus size={'16px'} />
                  <Typography>Add services</Typography>
                </Button>
              </th>
              {dates.map((date) => (
                <th key={date} className="p-3 th">
                  {date}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedServices.length > 0 ? (
              selectedServices.map((service, index) => (
                <Fragment key={index}>
                  <tr key={index} className="">
                    <td className="p-3 min-w-64 align-center flex justify-between gap-2 td">
                      <Typography>{service.name}</Typography>
                      <div className="flex">
                        <span className="bg-blue-500 text-white rounded-lg px-2 h-fit">{service.count}</span>
                      </div>
                    </td>
                    {service.data.map((cell, cellIndex) => {
                      return (
                        <td key={cellIndex} className="p-3 text-center min-w-32 align-top td">
                          <div
                            className={`${cell < 50 ? '!bg-green-600' : cell < 100 ? '!bg-yellow-600' : '!bg-red-600'} px-2 py-1 rounded-full`}
                          >
                            <span className="text-white">{cell}</span>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                </Fragment>
              ))
            ) : (
              <tr>
                <td className="td">No service selected</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TablePanel
