import React, { useEffect, useRef, useState } from 'react';
import ProgressBar from '../bar/progress-bar';
import { Typography } from '@mui/material';
import { ChevronRight, Info } from 'react-feather';
import { replaceWordingDataSource } from '../helper';
import Link from 'next/link';
import { NLP } from '@/modules/models/root-cause-analysis';

interface NodeProps {
  percentage: number; // Accepts a number between 0 and 100
  title: string;
  count?: number;
  expanded: boolean;
  handleOnClickNode: () => void;
  hasDetail?: boolean;
  queryParams?: {
    time_range?: string;
    data_source?: string;
    metric_anomaly?: string;
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
    console.log(nlp);
    
    handleOnClickNode()
    if (nlp) {
      handleSelectNLP(nlp)
    } else {
      handleSelectNLP(null)
    }
  }

  return (
    <button
      ref={containerRef}
      className={`w-full min-h-20 relative flex flex-col outline-none snap-start ${count == null ? "cursor-default" : ""}`}
      onClick={handleClickNode}
    >
      {count != null && <ProgressBar progress={percentage} />}
      <div className='w-full flex gap-2'>
        {count == null && <div className='w-5 h-5 bg-orange-500 rounded-md'/>}
        <div className='w-full flex items-center justify-between'>
          <Typography
            className='overflow-hidden text-ellipsis whitespace-nowrap inline-block'
            variant="subtitle1"
            color={'white'}
            fontWeight={expanded ? 700 : 400}
            style={{ maxWidth: containerWidth - (count == null ? 28 : 0) - (tooltips ? 20 : 0) }}
          >
            {replaceWordingDataSource(title)}
          </Typography>
          {tooltips != null &&
            <a id={`${queryParams?.data_source}-${queryParams?.metric_anomaly}-${title.replace(/ /g,'')}`}>
              <Info size={20} color='white'/>
            </a>
          }
        </div>
      </div>
      <div className='w-full flex justify-between items-center'>
        {count != null &&
          <Typography
            variant="subtitle1"
            color={'white'}
            fontWeight={expanded ? 700 : 400}
          >
            {count}
          </Typography>
        }
        {hasDetail &&
          <Link
            href={{ pathname: '/dashboard/anomaly-detection', query: queryParams }}
            passHref
            rel="noopener noreferrer"
            className='pl-2 flex gap-0 items-center hover:bg-gray-600 active:bg-gray-500 rounded-lg'
          >
            <Typography
              variant="caption"
              color={'white'}
            >
              Detail
            </Typography>
            <ChevronRight size={16} color='white'/>
        </Link>

        }
      </div>
    </button>
  );
};

export default Node;
