import { Typography } from '@mui/material'
import styles from './brimo-end-to-end-panel.module.css'
import HealthinessTreeWrapper from '../wrapper/healthiness-tree-wrapper'
import HealthinessTree from './healthiness-tree'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { HealthScoreResponse } from '@/modules/models/overviews'
import { formatNumberWithCommas, handleStartEnd } from '@/helper'
import Skeleton from '@/components/system/Skeleton/Skeleton'
import { GetHealthScoreOverview } from '@/modules/usecases/overviews'

const healthinessLegend = [
  {
    color: '#D23636',
    label: 'Very High',
  },
  {
    color: '#FF802D',
    label: 'High',
  },
  // {
  //   color: '#08B96D',
  //   label: 'Low',
  // },
]

interface BRImoEndToEndPanelProps {
  timeRange: string
}

export interface BRImoEndToEndPanelHandle {
  refresh: (timeRange: string) => void
}

const BRImoEndToEndPanel = forwardRef<BRImoEndToEndPanelHandle, BRImoEndToEndPanelProps>(({
  timeRange,
}, ref) => {
  const [data, setData] = useState<HealthScoreResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [detectAbuseAnomaly, setDetectAbuseAnomaly] = useState(false)
  const [totalBrimoHealth, setTotalBrimoHealth] = useState(100)

  // Use useImperativeHandle to expose the custom method
  useImperativeHandle(ref, () => ({
    refresh(timeRange) {
      setIsLoading(true)
      fetchData(timeRange)
    },
  }));

  useEffect(() => {
    setIsLoading(true)
    fetchData()
  }, [timeRange])

  function fetchData(customTimeRange?: string) {
    const { startTime, endTime } = handleStartEnd(customTimeRange ?? timeRange);
    const paramsTime = { start_time: startTime, end_time: endTime };

    GetHealthScoreOverview(paramsTime)
      .then((res) => {
        if (res.data == null) throw Error("Empty response data")
        let totalScore = data.reduce((total, d) => total + d.score, 0)
        setTotalBrimoHealth(totalScore / data.length)
        setData(res.data)
        setIsError(false)
      })
      .catch(_ => {
        setIsError(true)
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

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
              {isLoading ?
                <Skeleton
                  width={230}
                  height={34}
                /> :
                <div className='px-[17px] py-[7.5px] flex border gap-[10px] rounded-[28px] items-center' style={{ borderColor: detectAbuseAnomaly ? "#D23636" : "#08B96D" }} >
                  <div className={`${detectAbuseAnomaly ? styles.blinking : ''} w-[10px] h-[10px] rounded-full`} style={{ backgroundColor: detectAbuseAnomaly ? "#D23636" : "#08B96D" }} />
                  <Typography
                    fontWeight={700}
                    fontSize={'14px'}
                    lineHeight={'17.07px'}
                    color={detectAbuseAnomaly ? "#D23636" : "#08B96D"}
                  >
                    {detectAbuseAnomaly ? "Abuse Anomaly Detected" : "No Abuse Anomaly"}
                  </Typography>
                </div>
              }
              {isLoading ?
                <Skeleton
                  width={230}
                  height={34}
                /> :
                <div className='px-[17px] py-[7.5px] flex gap-[10px] rounded-[28px] items-center border border-white border-opacity-20' >
                  <Typography
                    fontWeight={700}
                    fontSize={'14px'}
                    lineHeight={'17.07px'}
                    color={'white'}
                  >
                    Total BRImo Health
                  </Typography>
                  <Typography
                    fontWeight={700}
                    fontSize={'14px'}
                    lineHeight={'17.07px'}
                    color={'white'}
                  >
                    {formatNumberWithCommas(totalBrimoHealth)}%
                  </Typography>
                </div>
              }
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
})

export default BRImoEndToEndPanel
