'use client'

import { useState } from 'react'

import './main-page.css'

import RCATree from './tree/rca-tree'
import TableModal from './modal/table-modal'

const MainPageRootCauseAnalysis = () => {
  const [modalServices, setModalServices] = useState(false)

  const handleDetail = () => {
    setModalServices(true)
  }

  return (
    <>
      <div className='flex flex-col gap-8'>
        <div className="flex flex-col gap-10 px-2 py-8 card-style z-50">
          <div className="w-full flex flex-col gap-8">
            <RCATree
              handleDetail={handleDetail}
            />
          </div>
        </div>
        <div className="flex flex-col gap-10 px-2 py-8 card-style z-50">
          <div className="w-full flex flex-col gap-8">
            <RCATree
              handleDetail={handleDetail}
            />
          </div>
        </div>
      </div>
      {modalServices && (
        <TableModal
          open={modalServices}
          handleOpenModal={setModalServices}
        />
      )}
    </>
  )
}

export default MainPageRootCauseAnalysis
