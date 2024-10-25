import { Typography } from '@mui/material'
import styles from './brimo-end-to-end-panel.module.css'
import HealthinessTreeWrapper from '../wrapper/healthiness-tree-wrapper'
import HealthinessTree from './healthiness-tree'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { HealthScoreResponse } from '@/modules/models/overviews'
import { formatNumberWithCommas, handleStartEnd } from '@/helper'
import Skeleton from '@/components/system/Skeleton/Skeleton'
import { GetAmountAbuseOverview, GetHealthScoreOverview } from '@/modules/usecases/overviews'
import { HEALTHINESS_LEGEND, SECTIONS_CONFIG } from './constants/brimo-end-to-end-contstans'

type Node = {
  dataSource: string;
  score: number;
  severity: number;
};

type Section = {
  score: number;
  severity: number;
  nodes: Node[];
};

// Define the type for the entire result
export type MappedHealthinessTree = {
  apps: Section;
  security: Section;
  compute: Section;
  network: Section;
};

// Helper function to get node data
const getNodeData = (data: HealthScoreResponse[], dataSource: string) => {
  return data.find(item => item.data_source === dataSource) || { score: 100, severity: 0 };
};

// Mock function to generate nodes
const generateNodes = (data: HealthScoreResponse[], sectionConfig: { [key: string]: string }) => {
  return Object.entries(sectionConfig).map(([_, value]) => ({
    dataSource: value,
    ...getNodeData(data, value)
  }));
};

// Helper function to calculate the average score of a section's nodes
const calculateAverageScore = (nodes: Node[]): number => {
  if (nodes.length === 0) return 0;
  const totalScore = nodes.reduce((sum, node) => sum + node.score, 0);
  return totalScore / nodes.length;
};

// Helper function to calculate the severity based on nodes' severities
const calculateSeverity = (nodes: Node[]): number => {
  if (nodes.every(node => node.severity === 0)) {
    return 0;
  }
  return Math.min(...nodes.filter(node => node.severity > 0).map(node => node.severity));
};

interface BRImoEndToEndPanelProps {
  timeRange: string
}

export interface BRImoEndToEndPanelHandle {
  refresh: (timeRange: string) => void
}

const BRImoEndToEndPanel = forwardRef<BRImoEndToEndPanelHandle, BRImoEndToEndPanelProps>(({
  timeRange,
}, ref) => {
  const [responseData, setResponseData] = useState<HealthScoreResponse[]>([])
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

  const mappedData: MappedHealthinessTree = useMemo(() => {
    const appsNodes = generateNodes(responseData, SECTIONS_CONFIG.apps);
    const securityNodes = generateNodes(responseData, SECTIONS_CONFIG.security);
    const computeNodes = generateNodes(responseData, SECTIONS_CONFIG.compute);
    const networkNodes = generateNodes(responseData, SECTIONS_CONFIG.network);

    const mapData = {
      apps: {
        nodes: appsNodes,
        score: calculateAverageScore(appsNodes),
        severity: calculateSeverity(appsNodes),
      },
      security: {
        nodes: securityNodes,
        score: calculateAverageScore(securityNodes),
        severity: calculateSeverity(securityNodes),
      },
      compute: {
        nodes: computeNodes,
        score: calculateAverageScore(computeNodes),
        severity: calculateSeverity(computeNodes),
      },
      network: {
        nodes: networkNodes,
        score: calculateAverageScore(networkNodes),
        severity: calculateSeverity(networkNodes),
      },
    }

    let totalScore = responseData.reduce((total, d) => total + d.score, 0)
    setTotalBrimoHealth(totalScore / responseData.length)

    setIsLoading(false)

    return mapData
  }, [responseData]);

  function fetchData(customTimeRange?: string) {
    const { startTime, endTime } = handleStartEnd(customTimeRange ?? timeRange);
    const paramsTime = { start_time: startTime, end_time: endTime };

    GetAmountAbuseOverview(paramsTime)
      .then((res) => {
        if (res.data == null) throw Error("Empty response data")
        setDetectAbuseAnomaly(res.data.is_abuse)
        setIsError(false)
      })
      .catch(_ => {
        setIsError(true)
      })

    GetHealthScoreOverview(paramsTime)
      .then((res) => {
        if (res.data == null) throw Error("Empty response data")
        setResponseData(res.data)
        setIsError(false)
      })
      .catch(_ => {
        setIsError(true)
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
                    fontSize={'18px'}
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
                    fontSize={'18px'}
                    lineHeight={'17.07px'}
                    color={'white'}
                  >
                    Total BRImo Health
                  </Typography>
                  <Typography
                    fontWeight={700}
                    fontSize={'18px'}
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
            {HEALTHINESS_LEGEND.map(legend => (
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
          data={mappedData}
          timeRange={timeRange}
        />
      </HealthinessTreeWrapper>
    </div>
  )
})

export default BRImoEndToEndPanel
