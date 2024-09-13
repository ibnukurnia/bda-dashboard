import React from 'react';
import ProgressBar from '../bar/progress-bar';
import { Typography } from '@mui/material';
import { ChevronRight } from 'react-feather';

interface NodeProps {
  percentage: number; // Accepts a number between 0 and 100
  title: string;
  count?: number;
  expanded: boolean;
  handleOnClickNode: () => void;
  handleOpenDetail?: () => void;
}

const Node: React.FC<NodeProps> = ({ 
  percentage,
  title,
  count,
  expanded,
  handleOnClickNode,
  handleOpenDetail,
 }) => {
  return (
    <button className="w-full min-h-20 relative flex flex-col outline-none snap-center" onClick={handleOnClickNode}>
      <ProgressBar progress={percentage} />
      <Typography
        variant="subtitle1"
        color={'white'}
        fontWeight={expanded ? 700 : 400}
      >
        {title}
      </Typography>
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
        {handleOpenDetail &&
          <div className='pl-2 flex gap-0 items-center hover:bg-gray-600 active:bg-gray-500 rounded-lg' onClick={handleOpenDetail}>
            <Typography
              variant="caption"
              color={'white'}
            >
              Detail
            </Typography>
            <ChevronRight size={16} color='white'/>
          </div>
        }
      </div>
    </button>
  );
};

export default Node;
