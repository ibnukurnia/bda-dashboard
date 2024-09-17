import { useEffect, useRef, useState } from 'react'
import { Typography } from '@mui/material'

import './overview-modal.css'

import Button from '@/components/system/Button/Button'
import Checkbox from '@/components/system/Checkbox/Checkbox'

interface OverviewModalProps {
  open: boolean
  handleOpenModal: (open: boolean) => void
  listDataSource: {
    name: string
    count: number
    services: {
      name: string
      count: number
      data: number[]
    }[]
  }[]
  handleApplyFilter: (
    selectedDataSource: any[]
    // selectedServices: { name: string; data: number[]; count?: number }[]
  ) => void
  prevSelectedDataSource: any[]
  // prevSelectedServices: { name: string; data: number[]; count?: number }[]
}

const OverviewModal = ({
  open,
  handleOpenModal,
  listDataSource,
  handleApplyFilter,
  prevSelectedDataSource,
  // prevSelectedServices,
}: OverviewModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const [selectedDataSource, setSelectedDataSource] = useState<any[]>([])
  // const [selectedServices, setSelectedServices] = useState<{ name: string; data: number[]; count?: number }[]>([])
  const [servicesList, setServicesList] = useState<any[]>([])

  const handleCheckboxDS = (value: any) => {
    let newDataSource
    let resNewSL: any[]

    if (selectedDataSource.some((item) => item.id === value.id)) {
      newDataSource = selectedDataSource.filter((sds) => sds.id !== value.id)
      // setSelectedServices([])
    } else {
      newDataSource = [...selectedDataSource, value]
    }
    const newServicesList = listDataSource
      .filter((sd) => newDataSource.map((nds) => nds.id).includes(sd.name))
      .map((el) => el.services.map((srv) => ({ name: `${el.name} - ${srv.name}`, count: srv.count, data: srv.data })))

    if (newServicesList.length > 0) {
      resNewSL = newServicesList.reduce((prev, next) => prev.concat(next))
    } else {
      resNewSL = []
    }

    setSelectedDataSource(newDataSource)
    setServicesList(resNewSL)
    // setSelectedServices(
    //   selectedServices.filter((filteredSS) => resNewSL.map((item) => item.name).includes(filteredSS.name))
    // )
  }

  // const handleCheckboxServices = (value: any) => {
  //   let newSS
  //   if (selectedServices.some((ss) => ss.name === value.id)) {
  //     newSS = selectedServices.filter((ssf) => ssf.name !== value.id)
  //   } else {
  //     newSS = [...selectedServices, servicesList.find((sl) => sl.name === value.id)]
  //   }
  //   setSelectedServices(newSS)
  // }

  const handleReset = () => {
    setSelectedDataSource([])
    // setSelectedServices([])
    setServicesList([])
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        handleOpenModal(false) // Close the panel when clicking outside of it
      }
    }

    const newListService = listDataSource
      .filter((sd) => prevSelectedDataSource.map((psds) => psds.id).includes(sd.name))
      .map((el) => el.services.map((srv) => ({ name: `${el.name} - ${srv.name}`, count: srv.count, data: srv.data })))

    setSelectedDataSource(prevSelectedDataSource)
    // setSelectedServices(prevSelectedServices)
    setServicesList(newListService.length > 0 ? newListService.reduce((prev, next) => prev.concat(next)) : [])

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[1200]">
      {/* <div ref={panelRef} className="bg-white rounded-lg p-6 w-3/5 flex flex-col gap-3"> */}
      <div ref={panelRef} className="bg-white rounded-lg p-6 w-2/5 flex flex-col gap-3">
        <h2 className="text-xl font-semibold mb-4 text-center">Add Services</h2>
        {/* <div className="grid grid-cols-2 gap-6"> */}
        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col gap-3">
            <Typography fontWeight={600}>Data Source</Typography>
            <div className="checkbox">
              <Checkbox
                data={listDataSource.map((item) => ({
                  id: item.name,
                  value: item.name,
                }))}
                onChange={handleCheckboxDS}
                selectedData={selectedDataSource}
              />
            </div>
          </div>
          {/* <div className="flex flex-col gap-3">
            <Typography fontWeight={600}>Services</Typography>
            {servicesList.length > 0 ? (
              <div className="checkbox">
                <Checkbox
                  data={servicesList.map((item) => ({
                    id: item.name,
                    value: item.name,
                  }))}
                  onChange={handleCheckboxServices}
                  selectedData={selectedServices.map((sss) => ({ id: sss.name, value: sss.name }))}
                />
              </div>
            ) : (
              <div>
                <Typography>Please select data source first to show available services</Typography>
              </div>
            )}
          </div> */}
        </div>
        <div className="flex justify-between mt-6 space-x-4">
          <Button variant="secondary" onClick={handleReset}>
            RESET
          </Button>
          <Button
            // disabled={selectedServices.length === 0}
            disabled={selectedDataSource.length === 0}
            // onClick={() => handleApplyFilter(selectedDataSource, selectedServices)}
            onClick={() => handleApplyFilter(selectedDataSource)}
          >
            TERAPKAN
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OverviewModal
