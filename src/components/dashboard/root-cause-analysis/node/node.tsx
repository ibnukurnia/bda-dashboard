import React, { useEffect, useRef, useState } from 'react';
import ProgressBar from '../bar/progress-bar';
import { Typography } from '@mui/material';
import Link from 'next/link';
import { NLP } from '@/modules/models/root-cause-analysis';

interface NodeProps {
  percentage: number; // Accepts a number between 0 and 100
  title: string;
  fungsi?: string;
  count?: number;
  expanded: boolean;
  handleOnClickNode: () => void;
  hasDetail?: boolean;
  queryParams?: {
    time_range?: string;
    data_source?: string;
    anomaly?: string;
    cluster?: string;
    service?: string;
  };
  tooltips?: {
    status_code: string;
    total: number;
  }[];
  nlp?: NLP;
  handleSelectNLP: (value: NLP | null) => void;
}

const Node: React.FC<NodeProps> = ({
  percentage,
  title,
  fungsi,
  count,
  expanded,
  handleOnClickNode,
  hasDetail,
  queryParams,
  tooltips,
  nlp,
  handleSelectNLP,
}) => {
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    window.addEventListener('resize', handleContainerWidth);
    return () => {
      window.removeEventListener('resize', handleContainerWidth);
    };
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    handleContainerWidth()
  }, [containerRef])

  const handleContainerWidth = () => {
    if (!containerRef.current) return
    setContainerWidth(containerRef.current?.clientWidth)
  }

  const handleClickNode = () => {
    handleOnClickNode()
    if (nlp) {
      handleSelectNLP(nlp)
    } else {
      handleSelectNLP(null)
    }
  }

  // Ensure queryParams is always an object, and then filter out null/undefined values
  const filteredQueryParams = Object.fromEntries(
    Object.entries(queryParams ?? {}).filter(([_, value]) => value != null)
  );

  return (
    <button
      ref={containerRef}
      className={`w-full min-h-20 relative flex flex-col outline-none snap-start ${count == null ? "cursor-default" : ""}`}
      onClick={handleClickNode}
    >
      {count != null && <ProgressBar progress={percentage} />}
      <div className='w-full flex gap-2 justify-between'>
        {tooltips != null &&
          <a
            id={`${queryParams?.data_source}-${queryParams?.cluster}-${queryParams?.anomaly}-${escapeAndRemoveSpaces(title)}`}
            className='mt-1'
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 0C2.7 0 0 2.7 0 6C0 9.3 2.7 12 6 12C9.3 12 12 9.3 12 6C12 2.7 9.3 0 6 0ZM6.6 9H5.4V5.4H6.6V9ZM6.6 4.2H5.4V3H6.6V4.2Z" fill="white" fillOpacity="0.8" />
            </svg>
          </a>
        }
        {count == null && <div className='w-5 h-5 bg-orange-500 rounded-md' />}
        <div className='w-4/5 flex flex-col'>
          <Typography
            color={'white'}
            fontWeight={expanded ? 700 : 400}
            fontSize={14}
            lineHeight={"17.07px"}
            align='left'
            noWrap
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%', // Adjust as needed
            }}
          >
            {title}
          </Typography>
          {queryParams?.cluster &&
            <Typography
              color={'white'}
              fontWeight={expanded ? 700 : 400}
              fontSize={14}
              lineHeight={"17.07px"}
              align='left'
              noWrap
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%', // Adjust as needed
              }}
            >
              {queryParams?.cluster}
            </Typography>
          }
          {fungsi &&
            <Typography
              color={'white'}
              fontWeight={expanded ? 700 : 400}
              fontSize={14}
              lineHeight={"17.07px"}
              align='left'
              noWrap
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%', // Adjust as needed
              }}
            >
              {fungsi}
            </Typography>
          }
        </div>
        <div className='flex flex-col gap-[5px] justify-between'>
          {count != null &&
            <Typography
              color={'white'}
              fontWeight={expanded ? 700 : 400}
              fontSize={14}
              lineHeight={"17.07px"}
              align='right'
            >
              {count}
            </Typography>
          }
          {hasDetail &&
            <Link
              href={{ pathname: '/dashboard/anomaly-detection', query: filteredQueryParams }}
              passHref
              rel="noopener noreferrer"
              className='flex gap-0 items-center rounded-lg'
            >
              <Typography
                className='hover:underline'
                fontSize={12}
                lineHeight={'14.63px'}
                color={'#4787FF'}
                noWrap
              >
                {"Detail >"}
              </Typography>
            </Link>
          }
        </div>
      </div>
    </button>
  );
};

export default Node;

function escapeAndRemoveSpaces(stringToEscape: string) {
  return stringToEscape.replace(/[\(\)\s\.]/g, match => {
    if (match === '(') return '';
    if (match === ')') return '';
    if (match === '.') return '_';
    return ''; // remove spaces
  });
}
