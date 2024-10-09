import { Typography } from '@mui/material'
import './gauge.css'
import HealthinessTreeWrapper from '../wrapper/healthiness-tree-wrapper'
import HealthinessTree from './healthiness-tree'
import { useEffect, useState } from 'react'
import { HealthScoreResponse } from '@/modules/models/overviews'
import { formatNumberWithCommas } from '@/helper'

const healthinessLegend = [
  {
    color: '#D23636',
    label: 'Very High',
  },
  {
    color: '#FF802D',
    label: 'High',
  },
  {
    color: '#08B96D',
    label: 'Low',
  },
]

interface BRImoEndToEndPanelProps {
  data: HealthScoreResponse[]
  isLoading: boolean
  isError: boolean
}

const BRImoEndToEndPanel = ({
  data,
  isLoading,
  isError,
}: BRImoEndToEndPanelProps) => {
  const [detectAbuseAnomaly, setDetectAbuseAnomaly] = useState(false)
  const [totalBrimoHealth, setTotalBrimoHealth] = useState(100)

  useEffect(() => {
    if (!data) return
    let totalScore = data.reduce((total, d) => total + d.score, 0)
    setTotalBrimoHealth(totalScore / data.length)
  }, [data])
  
  return (
    <div className="flex flex-col gap-8 card relative">
      <div className='flex items-center justify-between'>
        <div className='flex gap-[25px]'>
          <img
            src={`/assets/dashboard/overview/logo-brimo.svg`}
            width={66}
            height={66}
            alt='logo'
          />
          <div className='flex flex-col gap-[10px]'>
            <Typography
              fontWeight={700}
              fontSize={'20px'}
              lineHeight={'24.38px'}
              color={'white'}
            >
              BRImo End to End
            </Typography>
            <div className='flex gap-[10px]'>
              <div className='px-[17px] py-[7.5px] flex border gap-[10px] rounded-[28px] items-center' style={{ borderColor: detectAbuseAnomaly ? "#D23636" : "#08B96D" }} >
                <div className='w-[10px] h-[10px] rounded-full' style={{ backgroundColor: detectAbuseAnomaly ? "#D23636" : "#08B96D" }} />
                <Typography
                  fontWeight={700}
                  fontSize={'14px'}
                  lineHeight={'17.07px'}
                  color={detectAbuseAnomaly ? "#D23636" : "#08B96D"}
                >
                  {detectAbuseAnomaly ? "Abuse Anomaly Detected" : "No Abuse Anomaly"}
                </Typography>
              </div>
              <div className='px-[17px] py-[7.5px] flex border gap-[10px] rounded-[28px] items-center' style={{ borderColor: totalBrimoHealth < 90 ? "#D23636" : "#08B96D" }} >
                <div className='w-[10px] h-[10px] rounded-full' style={{ backgroundColor: totalBrimoHealth < 90 ? "#D23636" : "#08B96D" }} />
                <Typography
                  fontWeight={700}
                  fontSize={'14px'}
                  lineHeight={'17.07px'}
                  color={totalBrimoHealth < 90 ? "#D23636" : "#08B96D"}
                >
                  Total BRIMO Health
                </Typography>
                <Typography
                  fontWeight={700}
                  fontSize={'14px'}
                  lineHeight={'17.07px'}
                  color={totalBrimoHealth < 90 ? "#D23636" : "#08B96D"}
                >
                  {formatNumberWithCommas(totalBrimoHealth)}%
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <div className='px-4 py-[14px] flex gap-6 items-center rounded-[11px] bg-white bg-opacity-5'>
          <Typography
            fontWeight={700}
            fontSize={12}
            lineHeight={'14.63px'}
            color={'white'}
          >
            TOPOLOGY LEGEND
          </Typography>
          <div className='flex gap-4'>
            {healthinessLegend.map(legend => (
              <div key={legend.label} className='flex gap-2 items-center'>
                <div className={`w-[12px] h-[12px] rounded-[4px]`}
                  style={{
                    backgroundColor: legend.color,
                  }}
                />
                <Typography
                  fontWeight={600}
                  fontSize={14}
                  lineHeight={'17.07px'}
                  color={'white'}
                >
                  {legend.label}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </div>
      <HealthinessTreeWrapper
        isLoading={isLoading}
        isError={isError}
      >
        <HealthinessTree
          data={data}
        />
      </HealthinessTreeWrapper>
    </div>

  )
}

export default BRImoEndToEndPanel
