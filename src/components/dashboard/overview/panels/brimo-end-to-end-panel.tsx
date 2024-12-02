import { Typography } from '@mui/material'
import styles from './brimo-end-to-end-panel.module.css'
import HealthinessTreeWrapper from '../wrapper/healthiness-tree-wrapper'
import HealthinessTree from './healthiness-tree'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { HealthScoreResponse } from '@/modules/models/overviews'
import { formatNumberWithCommas, handleStartEnd } from '@/helper'
import Skeleton from '@/components/system/Skeleton/Skeleton'
import { GetAmountAbuseOverview, GetHealthScoreOverview } from '@/modules/usecases/overviews'
import { SECTIONS_CONFIG } from './constants/brimo-end-to-end-contstans'
import BulletListIcon from '@/components/system/Icon/BulletListIcon'
import TooltipHealthinessLegend from '../tooltip/tooltip-healthiness-legend'
import WarningIcon from '@/components/system/Icon/WarningIcon'

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

const audioCtx = new(window.AudioContext)();
const volume = 10
const frequency = 300
const type = 'square'
const duration = 1000

function beep() {
  let oscillator = audioCtx.createOscillator();
  let gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  gainNode.gain.value = volume;
  oscillator.frequency.value = frequency;
  oscillator.type = type;

  oscillator.start();

  setTimeout(
    function() {
      oscillator.stop();
    },
    duration
  );
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
  const audioRef = useRef<HTMLAudioElement>(null)

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
        if (res.data.is_abuse) {
          // audioRef.current?.play()
          beep()
        }
        setIsError(false)
      })
      .catch(_ => {
        setIsError(true)
        setIsLoading(false)
      })

    GetHealthScoreOverview(paramsTime)
      .then((res) => {
        if (res.data == null) throw Error("Empty response data")
        setResponseData(res.data)
        setIsError(false)
      })
      .catch(_ => {
        setIsError(true)
        setIsLoading(false)
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
                !isError && <div className='px-[17px] py-[7.5px] flex border gap-[10px] rounded-[28px] items-center' style={{ borderColor: detectAbuseAnomaly ? "#D23636" : "#08B96D" }} >
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
              {/* <audio ref={audioRef} src='/assets/dashboard/overview/abuse-anomaly-alert.mp3' preload='auto' /> */}
              {isLoading ?
                <Skeleton
                  width={230}
                  height={34}
                /> :
                !isError && <div className='px-[17px] py-[7.5px] flex gap-[10px] rounded-[28px] items-center border border-white border-opacity-20' >
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
              <a
                id={`healthiness-legend`}
                className='flex gap-2 items-center'
                data-tooltip-place={'bottom-start'}
              >
                <BulletListIcon />
                <Typography
                  fontWeight={700}
                  fontSize={'14px'}
                  lineHeight={'17.07px'}
                  color={'#3078FF'}
                >
                  Show Legend
                </Typography>
              </a>
              <TooltipHealthinessLegend />
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-[7px]'>
          <Typography
            fontWeight={700}
            fontSize={11}
            lineHeight={'13.41px'}
            color={'white'}
            align='right'
          >
            ⚠️ ALERT ERROR RATE PREDICTION
          </Typography>
          <div
            className='mt-auto flex gap-[6px]'
          >
            <div className='px-4 py-[10px] flex gap-[10px] items-center rounded-[7px] bg-[#D3530033] bg-opacity-20'>
              <WarningIcon color='#FF802D' />
              <div className='flex gap-1'>
                <Typography
                  fontWeight={700}
                  fontSize={13}
                  lineHeight={'15.85px'}
                  color={'white'}
                >
                  4
                </Typography>
                <Typography
                  fontWeight={400}
                  fontSize={13}
                  lineHeight={'15.85px'}
                  color={'white'}
                >
                  errors with a threshold of 0.01%
                </Typography>
              </div>
            </div>
            <div className='px-4 py-[10px] flex gap-[10px] items-center rounded-[7px] bg-[#D3530033] bg-opacity-20'>
              <WarningIcon color='#D23636' />
              <div className='flex gap-1'>
                <Typography
                  fontWeight={700}
                  fontSize={13}
                  lineHeight={'15.85px'}
                  color={'white'}
                >
                  2
                </Typography>
                <Typography
                  fontWeight={400}
                  fontSize={13}
                  lineHeight={'15.85px'}
                  color={'white'}
                >
                  errors with a threshold of 0.1%
                </Typography>
              </div>
              <div className='px-[10px] py-[3px] rounded-[18px] bg-[#D23636]'>
                <Typography
                  fontWeight={700}
                  fontSize={10}
                  lineHeight={'12.19px'}
                  color={'white'}
                >
                  NEED ATTENTION!
                </Typography>
              </div>
            </div>
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
