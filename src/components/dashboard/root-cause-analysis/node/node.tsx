import React from 'react';
import ProgressBar from '../bar/progress-bar';
import { Typography } from '@mui/material';

interface NodeProps {
  percentage: number; // Accepts a number between 0 and 100
  title: string;
  count: number;
  expanded: boolean;
  handleOnClickNode: () => void;
}

const Node: React.FC<NodeProps> = ({ 
  percentage,
  title,
  count,
  expanded,
  handleOnClickNode,
 }) => {
  return (
    <button className="w-48 h-20 relative flex flex-col outline-none snap-center" onClick={handleOnClickNode}>
      <ProgressBar progress={percentage} />
      <Typography
        variant="subtitle1"
        color={'white'}
        fontWeight={expanded ? 700 : 400}
      >
        {title}
      </Typography>
      <Typography
        variant="subtitle1"
        color={'white'}
        fontWeight={expanded ? 700 : 400}
      >
        {count}
      </Typography>
    </button>
  );
};

export default Node;
